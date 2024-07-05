// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

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
    uint256 public totalProjects;
    mapping(uint256 => Project) private _projects;

    modifier exists(uint256 projectId) {
        if (!_projects[projectId].isRegistered) {
            revert ProjectDoesNotExist();
        }
        _;
    }

    modifier notInactive(uint256 projectId) {
        ProjectStatus status = _projects[projectId].status;
        if (status == ProjectStatus.Canceled || status == ProjectStatus.Completed) {
            revert InactiveProject();
        }
        _;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    function addDocument(
        uint256 projectId,
        string memory documentUrl
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        _get(projectId).documentUrls.push(documentUrl);
    }

    function addPhoto(
        uint256 projectId,
        string memory photoUrl
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        _get(projectId).photoUrls.push(photoUrl);
    }

    function create() external onlyOwner {
        // TODO: implement
    }

    function get(uint256 projectId) external view exists(projectId) returns (Project memory) {
        return _projects[projectId];
    }

    function mintTokens(uint256 projectId) external onlyOwner exists(projectId) notInactive(projectId) {
        // TODO: implement
    }

    function setStatus(
        uint256 projectId,
        ProjectStatus status
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        _get(projectId).status = status;
    }

    function _get(uint256 projectId) internal view returns (Project storage) {
        return _projects[projectId];
    }
}
