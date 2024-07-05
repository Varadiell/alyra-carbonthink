// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TCO2} from "./TCO2.sol";

// TODO: reorganize errors / enums / structs?

// TODO: add events

error AddressZero();
error CannotChangeProjectState();
error CannotMintZeroToken();
error InactiveProject();
error InvalidMetadata();
error ProjectDoesNotExist();

enum ProjectStatus {
    Canceled,
    Pending,
    Active,
    Completed
}

struct Project {
    bool isRegistered;
    address projectHolder;
    uint256 id;
    string name;
    string description;
    string externalUrl;
    string image;
    string[] photoUrls;
    string[] documentUrls;
    ProjectData data;
    ProjectStatus status;
}

struct ProjectData {
    uint8 duration;
    uint64 ares;
    uint64 expectedCo2Tons;
    uint64 startDate;
    string continent;
    string country;
    string region;
    string province;
    string city;
    string location;
    string coordinates;
    string plantedSpecies;
    string calculationMethod;
    uint8[] unSDGs;
}

/// @custom:security-contact security@carbonthink.xyz
contract ProjectManager is Ownable {
    address public securityFund;
    TCO2 public tco2Contract;

    uint256 public totalProjects;
    mapping(uint256 => Project) internal _projects;

    modifier exists(uint256 _projectId) {
        if (!_projects[_projectId].isRegistered) {
            revert ProjectDoesNotExist();
        }
        _;
    }

    modifier notInactive(uint256 _projectId) {
        ProjectStatus status = _projects[_projectId].status;
        if (status == ProjectStatus.Canceled || status == ProjectStatus.Completed) {
            revert InactiveProject();
        }
        _;
    }

    constructor(address _initialOwner, address _securityFund, address _tco2Contract) Ownable(_initialOwner) {
        if (_initialOwner == address(0) || _securityFund == address(0) || _tco2Contract == address(0)) {
            revert AddressZero();
        }
        tco2Contract = TCO2(_tco2Contract);
        securityFund = _securityFund;
    }

    function addDocument(
        uint256 _projectId,
        string memory _documentUrl
    ) external onlyOwner exists(_projectId) notInactive(_projectId) {
        _get(_projectId).documentUrls.push(_documentUrl);
    }

    function addPhoto(
        uint256 _projectId,
        string memory _photoUrl
    ) external onlyOwner exists(_projectId) notInactive(_projectId) {
        _get(_projectId).photoUrls.push(_photoUrl);
    }

    function create() external onlyOwner {
        // TODO: implement
        // TODO: increment totalProjects number
    }

    function get(uint256 _projectId) external view exists(_projectId) returns (Project memory) {
        return _projects[_projectId];
    }

    function mintTokens(
        uint256 _projectId,
        address _receiver,
        uint256 _tokenId,
        uint256 _amount,
        string memory _base64Metadata
    ) external onlyOwner exists(_projectId) notInactive(_projectId) {
        if (_receiver == address(0)) {
            revert AddressZero();
        }
        if (_amount == 0) {
            revert CannotMintZeroToken();
        }
        bool needsMetadata = tco2Contract.exists(_tokenId);
        if (
            (needsMetadata && bytes(_base64Metadata).length == 0) ||
            (!needsMetadata && bytes(_base64Metadata).length > 0)
        ) {
            revert InvalidMetadata();
        }
        (uint256 receiverAmount, uint256 securityFundAmount) = _splitMint(_amount, 80);
        // Metadata are set only once at token creation.
        tco2Contract.mint(_receiver, _tokenId, receiverAmount, needsMetadata ? _base64Metadata : "");
        // No need to mint for the Security Fund when the allocated amount is 0.
        if (securityFundAmount > 0) {
            // No metadata to add after the first mint.
            tco2Contract.mint(securityFund, _tokenId, securityFundAmount, "");
        }
    }

    function setStatus(
        uint256 _projectId,
        ProjectStatus _status
    ) external onlyOwner exists(_projectId) notInactive(_projectId) {
        _get(_projectId).status = _status;
    }

    function _get(uint256 _projectId) internal view returns (Project storage) {
        return _projects[_projectId];
    }

    function _splitMint(uint256 _totalAmount, uint8 _splitPercent) internal pure returns (uint256, uint256) {
        uint256 receiverAmount = (_totalAmount * (100 - _splitPercent)) / 100;
        uint256 securityFundAmount = (_totalAmount * _splitPercent) / 100;
        if (_totalAmount > (receiverAmount + securityFundAmount)) {
            receiverAmount++;
        }
        return (receiverAmount, securityFundAmount);
    }
}
