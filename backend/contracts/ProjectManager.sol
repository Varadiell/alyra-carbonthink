// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TCO2} from "./TCO2.sol";

/// @custom:security-contact security@carbonthink.xyz
contract ProjectManager is Ownable {
    error AddressZero();
    error CannotChangeProjectState();
    error CannotMintZeroToken();
    error InactiveProject();
    error InvalidMetadata();
    error ProjectDoesNotExist();

    event DocumentAdded(uint256 indexed projectId);
    event PhotoAdded(uint256 indexed projectId);
    event Created(uint256 indexed projectId);
    event Minted(uint256 indexed projectId, address indexed account, uint256 amount);
    event StatusChanged(uint256 indexed projectId, ProjectStatus indexed status);

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

    address public immutable securityFund;
    TCO2 public immutable tco2Contract;

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
        uint256 projectId,
        string memory documentUrl
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        _get(projectId).documentUrls.push(documentUrl);
        emit DocumentAdded(projectId);
    }

    function addPhoto(
        uint256 projectId,
        string memory photoUrl
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        _get(projectId).photoUrls.push(photoUrl);
        emit PhotoAdded(projectId);
    }

    function create(Project memory project) external onlyOwner {
        _projects[totalProjects] = project;
        totalProjects++;
        emit Created(project.id);
    }

    function get(uint256 projectId) external view exists(projectId) returns (Project memory) {
        return _projects[projectId];
    }

    function mintTokens(
        uint256 projectId,
        address receiver,
        uint256 amount,
        string memory base64Metadata
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        if (receiver == address(0)) {
            revert AddressZero();
        }
        if (amount == 0) {
            revert CannotMintZeroToken();
        }
        bool needsMetadata = tco2Contract.exists(projectId);
        if (
            (needsMetadata && bytes(base64Metadata).length == 0) || (!needsMetadata && bytes(base64Metadata).length > 0)
        ) {
            revert InvalidMetadata();
        }
        (uint256 receiverAmount, uint256 securityFundAmount) = _splitMint(amount, 80);
        bool hasSecurityFundAmount = securityFundAmount > 0;
        // Events are emitted before the calls to please the Slither god regarding reentrancy warnings.
        emit Minted(projectId, receiver, receiverAmount);
        if (hasSecurityFundAmount) {
            emit Minted(projectId, securityFund, securityFundAmount);
        }
        // Metadata are set only once at token creation.
        tco2Contract.mint(receiver, projectId, receiverAmount, needsMetadata ? base64Metadata : "");
        // No need to mint for the Security Fund when the allocated amount is 0.
        if (hasSecurityFundAmount) {
            // No metadata to add after the first mint.
            tco2Contract.mint(securityFund, projectId, securityFundAmount, "");
        }
    }

    function setStatus(
        uint256 projectId,
        ProjectStatus status
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        _get(projectId).status = status;
        emit StatusChanged(projectId, status);
    }

    function _get(uint256 projectId) internal view returns (Project storage) {
        return _projects[projectId];
    }

    function _splitMint(uint256 totalAmount, uint8 splitPercent) internal pure returns (uint256, uint256) {
        uint256 receiverAmount = (totalAmount * (100 - splitPercent)) / 100;
        uint256 securityFundAmount = (totalAmount * splitPercent) / 100;
        if (totalAmount > (receiverAmount + securityFundAmount)) {
            receiverAmount++;
        }
        return (receiverAmount, securityFundAmount);
    }
}
