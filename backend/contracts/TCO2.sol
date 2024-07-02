// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error EmptyMetadata();
error MetadataAlreadySet(uint256 tokenId);

/// @custom:security-contact security@carbonthink.xyz
contract TCO2 is ERC1155, ERC1155Burnable, ERC1155Supply, Ownable {
    mapping(uint256 => string) private _metadatas;

    /// @notice Constructor to initialize the contract with an initial owner.
    /// @dev No ERC1155 uri is set because we override the uri method.
    constructor() ERC1155("") Ownable(msg.sender) {}

    /// @notice Mint a new token with the specified metadata.
    /// @dev Mints a specified amount of tokens of a given id to the specified address.
    /// @param account The address to mint the tokens to.
    /// @param id The token id to mint.
    /// @param amount The amount of tokens to mint.
    /// @param base64Metadata The metadata associated with the token, encoded in base64.
    function mint(address account, uint256 id, uint256 amount, string memory base64Metadata) external onlyOwner {
        // Set metadata before mint because of "exists" check.
        if (!exists(id)) {
            _setMetadata(id, base64Metadata);
        }
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
                '"external_link":"https://alyra-carbonthink.vercel.app/"',
                "}"
            );
    }

    /// @notice Override the URI function to provide on-chain token-specific metadata.
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

    /// @notice Internal function to set the json metadata for a token id when a new token is created.
    /// @dev This function shall not be called on an already existing token.
    /// @param id The token id to set the metadata for.
    /// @param metadata The metadata to set.
    function _setMetadata(uint256 id, string memory metadata) internal {
        if (bytes(metadata).length == 0) {
            revert EmptyMetadata();
        }
        _metadatas[id] = Base64.encode(bytes(metadata));
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
