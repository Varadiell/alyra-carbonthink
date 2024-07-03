// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error MintAmountZero(); // Mint amount should not be zero.
error MintEmptyMetadata(); // Mint metadata to set should not be empty (on token creation).
error TokenMetadataExists(uint256 tokenId); // New metadata should not be set to an already existing token.

/// @custom:security-contact security@carbonthink.xyz
contract TCO2 is ERC1155, ERC1155Burnable, ERC1155Supply, ERC2981, Ownable {
    mapping(uint256 => string) private _metadatas;

    /// @notice Constructor to initialize the contract with an initial owner.
    /// @dev No ERC1155 uri is set because we override the uri function for on-chain metadata.
    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {
        _setDefaultRoyalty(initialOwner, 500); // Set royalties to 5%.
    }

    /// @notice Mint a new token with the specified metadata.
    /// @dev Mints a specified amount of tokens of a given id to the specified address.
    /// @param account The address to mint the tokens to.
    /// @param id The token id to mint.
    /// @param amount The amount of tokens to mint.
    /// @param base64Metadata The metadata associated with the token, encoded in base64.
    function mint(address account, uint256 id, uint256 amount, string memory base64Metadata) external onlyOwner {
        if (amount == 0) {
            revert MintAmountZero();
        } else if (exists(id) && bytes(base64Metadata).length > 0) {
            revert TokenMetadataExists(id);
        } else if (!exists(id) && bytes(base64Metadata).length == 0) {
            revert MintEmptyMetadata();
        } else {
            _metadatas[id] = base64Metadata;
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
                '"image":"ipfs://bafybeidcsrvmcxoqoxqgmiidnyrovb4hqx2f5mm6tyjsgyrjz7ribbwkpe/",',
                '"banner_image":"ipfs://bafybeib5zu3kakff2ax67e7el4erucdwivlcdr3l4i7hbxhtddp6w36oji/",',
                '"featured_image":"ipfs://bafybeidcsrvmcxoqoxqgmiidnyrovb4hqx2f5mm6tyjsgyrjz7ribbwkpe/",',
                '"external_link":"https://alyra-carbonthink.vercel.app/"',
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

    /// @notice Overrides the URI function to provide on-chain token-specific metadata.
    /// @dev This function returns the metadata URI for a given token id.
    /// @param tokenId The token id to get the metadata URI for.
    /// @return string The metadata URI for the given token id.
    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory jsonBase64 = _metadatas[tokenId];
        if (bytes(jsonBase64).length == 0) {
            return "";
        }
        return string.concat("data:application/json;base64,", jsonBase64);
    }

    /// @notice Override required by Solidity for token transfer updates.
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
        super._update(from, to, ids, values);
    }
}
