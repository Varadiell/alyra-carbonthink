// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {AccessManaged} from "@openzeppelin/contracts/access/manager/AccessManaged.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

string constant BASE_URI = "https://ipfs.io/ipfs/HASH_HERE/";

/// @custom:security-contact security@carbonthink.xyz
contract TCO2 is ERC1155, ERC1155Burnable, AccessManaged, ERC1155Supply {
    constructor(
        address initialAuthority
    ) ERC1155(string.concat(BASE_URI, "{id}.json")) AccessManaged(initialAuthority) {}

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public restricted {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public restricted {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    // Override the URI function to provide token-specific metadata.
    function uri(uint256 _tokenId) public pure override returns (string memory) {
        return string(abi.encodePacked(BASE_URI, Strings.toString(_tokenId), ".json"));
    }
}
