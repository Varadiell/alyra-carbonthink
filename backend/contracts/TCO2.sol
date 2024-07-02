// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {AccessManaged} from "@openzeppelin/contracts/access/manager/AccessManaged.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

error EmptyMetadata();
error MetadataAlreadySet(uint256 tokenId);
error TokenNotFound(uint256 tokenId);

/// @custom:security-contact security@carbonthink.xyz
contract TCO2 is ERC1155, ERC1155Burnable, AccessManaged, ERC1155Supply {
    event TokenMinted(address indexed account, uint256 indexed id, uint256 amount);

    mapping(uint256 => string) private _metadatas;

    /// @notice Constructor to initialize the contract with an initial authority.
    /// @param initialAuthority The address of the initial authority.
    constructor(address initialAuthority) ERC1155("") AccessManaged(initialAuthority) {}

    /// @notice Mint a new token with the specified metadata.
    /// @dev Mints a specified amount of tokens of a given id to the specified address.
    /// @param account The address to mint the tokens to.
    /// @param id The token id to mint.
    /// @param amount The amount of tokens to mint.
    /// @param metadata The metadata associated with the token.
    function mint(address account, uint256 id, uint256 amount, string memory metadata) public restricted {
        // Set metadata before mint because of "exists" check.
        if (!exists(id)) {
            _setMetadata(id, metadata);
        }
        _mint(account, id, amount, "");
        emit TokenMinted(account, id, amount);
    }

    /// @notice Internal function to set metadata for a token id when the metadata is empty.
    /// @param id The token id to set the metadata for.
    /// @param metadata The metadata to set.
    function _setMetadata(uint256 id, string memory metadata) internal {
        if (bytes(_metadatas[id]).length > 0) {
            revert MetadataAlreadySet({tokenId: id});
        }
        if (bytes(metadata).length == 0) {
            revert EmptyMetadata();
        }
        _metadatas[id] = metadata;
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

    /// @notice Override the URI function to provide on-chain token-specific metadata.
    /// @dev This function returns the metadata URI for a given token id.
    /// @param tokenId The token id to get the metadata URI for.
    /// @return string The metadata URI for the given token id.
    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory json = _metadatas[tokenId];
        if (bytes(json).length == 0) {
            revert TokenNotFound({tokenId: tokenId});
        }
        return string.concat("data:application/json;utf8,", json);
    }
}
