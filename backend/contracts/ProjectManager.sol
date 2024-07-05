// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TCO2} from "./TCO2.sol";

// TODO: reorganize errors / enums / structs?

// TODO: add events

error CannotChangeProjectState();
error InactiveProject();
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
    mapping(uint256 => Project) private _projects;

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
        // TODO: implement
        // TODO: calculate amount for receiver & amount for security fund.
        // tco2Contract.mint(_receiver, _tokenId, _amount, _base64Metadata);
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
}
