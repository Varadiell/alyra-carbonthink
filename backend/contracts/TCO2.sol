// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Arrays} from "@openzeppelin/contracts/utils/Arrays.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Error thrown when the mint amount is zero.
error MintAmountZero();

/// @notice Error thrown when the metadata to be set during mint is empty.
error MintEmptyMetadata();

/// @notice Error thrown when trying to set metadata for an already existing token.
error TokenMetadataExists(uint256 tokenId);

/// @custom:security-contact security@carbonthink.xyz
contract TCO2 is ERC1155, ERC1155Burnable, ERC1155Supply, ERC2981, Ownable {
    using Arrays for uint256[];
    using Arrays for address[];

    uint256 internal _totalBurnSupplyAll;
    mapping(address account => uint256) internal _totalBalances;
    mapping(address account => uint256) internal _totalBurnBalances;
    mapping(uint256 id => mapping(address account => uint256)) internal _burnBalances;
    mapping(uint256 id => uint256) internal _totalBurnSupply;
    mapping(uint256 => string) internal _metadatas;

    /// @notice Constructor to initialize the contract with an initial owner.
    /// @dev No ERC1155 uri is set because we override the uri function for on-chain metadata.
    /// @param initialOwner The address of the initial owner of the contract.
    constructor(address initialOwner, address royaltiesAddress) ERC1155("") Ownable(initialOwner) {
        _setDefaultRoyalty(royaltiesAddress, 500); // Set royalties to 5%.
    }

    /// @notice Retrieves the burned token balance of a specific account for a given project ID.
    /// @param account The address of the account.
    /// @param id The ID of the project.
    /// @return uint256 The burned token balance of the specified account for the given project ID.
    function burnBalanceOf(address account, uint256 id) public view returns (uint256) {
        return _burnBalances[id][account];
    }

    /// @notice Retrieves the burned token balances for multiple accounts and project IDs.
    /// @param accounts An array of account addresses.
    /// @param ids An array of project IDs.
    /// @return uint256[] A batch of burned token balances corresponding to the provided accounts and project IDs.
    /// @dev The length of the accounts and ids arrays must be equal.
    function burnBalanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    ) external view returns (uint256[] memory) {
        if (accounts.length != ids.length) {
            revert ERC1155InvalidArrayLength(ids.length, accounts.length);
        }
        uint256[] memory batchBurnBalances = new uint256[](accounts.length);
        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBurnBalances[i] = burnBalanceOf(accounts.unsafeMemoryAccess(i), ids.unsafeMemoryAccess(i));
        }
        return batchBurnBalances;
    }

    /// @notice Mint a new token with the specified metadata.
    /// @dev Mints a specified amount of tokens of a given id to the specified address.
    /// @param account The address to mint the tokens to.
    /// @param id The token id to mint.
    /// @param amount The amount of tokens to mint.
    /// @param base64Metadata The metadata associated with the token, encoded in base64.
    function mint(address account, uint256 id, uint256 amount, string memory base64Metadata) external onlyOwner {
        bool tokenExists = exists(id);
        bool hasMetadata = bytes(base64Metadata).length > 0;
        if (amount == 0) {
            revert MintAmountZero();
        } else if (tokenExists && hasMetadata) {
            revert TokenMetadataExists(id);
        } else if (!tokenExists && hasMetadata) {
            _metadatas[id] = base64Metadata;
        } else if (!tokenExists && !hasMetadata) {
            revert MintEmptyMetadata();
        }
        // Mint after "exists" checks.
        _mint(account, id, amount, "");
    }

    /// @notice Returns the contract-level metadata for the collection.
    /// @dev This function returns a JSON string that contains metadata about the contract, formatted as a data URI.
    /// @return string A JSON string containing the contract metadata, including name, description, and images.
    function contractURI() external pure returns (string memory) {
        return
            string.concat(
                "data:application/json;utf8,",
                "{",
                '"name":"CarbonThink TCO2",',
                '"description":"CarbonThink TCO2 tokens collection.",',
                '"external_link":"https://alyra-carbonthink.vercel.app/",',
                '"image_data":"',
                _getSvg(),
                '"',
                "}"
            );
    }

    /// @notice Overrides the supportsInterface function to include ERC2981 (royalty standard) support.
    /// @dev This function overrides `supportsInterface` to handle the ERC2981 interface check.
    /// @param interfaceId The interface identifier, as specified in ERC-165.
    /// @return bool True if the contract implements the requested interface, false otherwise.
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// @notice Retrieves the total token balance of a specific account across all tokens.
    /// @param account The address of the account.
    /// @return uint256 The total token balance of the specified account across all tokens.
    function totalBalanceOf(address account) external view returns (uint256) {
        return _totalBalances[account];
    }

    /// @notice Retrieves the total burned token balance of a specific account across all tokens.
    /// @param account The address of the account.
    /// @return uint256 The total burned token balance of the specified account across all tokens.
    function totalBurnBalanceOf(address account) external view returns (uint256) {
        return _totalBurnBalances[account];
    }

    /// @notice Retrieves the total amount of tokens burned for a specific project ID.
    /// @param id The ID of the project.
    /// @return The total amount of tokens burned for the specified project ID.
    function totalBurnSupply(uint256 id) external view returns (uint256) {
        return _totalBurnSupply[id];
    }

    /// @notice Retrieves the total amount of tokens burned across all projects.
    /// @return uint256 The total amount of tokens burned across all projects.
    function totalBurnSupply() external view returns (uint256) {
        return _totalBurnSupplyAll;
    }

    /// @notice Overrides the URI function to provide on-chain token-specific metadata.
    /// @dev This function returns the metadata URI for a given token id.
    /// @param tokenId The token id to get the metadata URI for.
    /// @return string The metadata URI for the given token id.
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string.concat("data:application/json;base64,", _metadatas[tokenId]);
    }

    /// @notice Generates CarbonThink logo SVG image as a string.
    /// @dev This function generates an SVG image with specific attributes and returns it as a string.
    /// @return string A string representing the SVG image.
    function _getSvg() internal pure returns (string memory) {
        return
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 24 24' fill='green' stroke='#004000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z'></path><path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'></path></svg>";
    }

    /// @notice Override required by Solidity for token transfer updates. Also implements tokens burn count and total balance count.
    /// @dev This function overrides the required update function to handle token transfers.
    /// @param from The address to transfer tokens from.
    /// @param to The address to transfer tokens to.
    /// @param ids The ids of the tokens to transfer.
    /// @param values The amounts of the tokens to transfer.
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        uint256 idsLength = ids.length;
        uint256 totalTransferredValue = 0;
        for (uint256 i = 0; i < idsLength; ++i) {
            totalTransferredValue += values[i];
        }
        if (from != address(0)) {
            _totalBalances[from] -= totalTransferredValue;
        }
        if (to != address(0)) {
            _totalBalances[to] += totalTransferredValue;
        }
        if (to == address(0)) {
            uint256 totalBurnValue = 0;
            for (uint256 i = 0; i < idsLength; ++i) {
                uint256 value = values[i];
                _totalBurnSupply[ids[i]] += value;
                _burnBalances[ids[i]][from] += value;
                totalBurnValue += value;
            }
            _totalBurnBalances[from] += totalBurnValue;
            _totalBurnSupplyAll += totalBurnValue;
        }
        super._update(from, to, ids, values);
    }
}
