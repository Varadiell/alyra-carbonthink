// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TCO2} from "./TCO2.sol";

/// @title ProjectManager contract.
/// @notice This contract manages projects and mints TCO2 tokens based on the projects' data.
/// @custom:security-contact security@carbonthink.xyz
contract ProjectManager is Ownable {
    /// @notice Emitted when the zero address is provided where it is not allowed.
    error AddressZero();
    /// @notice Emitted when the project state cannot be altered.
    error CannotChangeProjectState();
    /// @notice Emitted when attempting to mint zero tokens.
    error CannotMintZeroToken();
    /// @notice Emitted when an action is attempted on an inactive project.
    error InactiveProject();
    /// @notice Emitted when invalid metadata is provided.
    error InvalidMetadata();
    /// @notice Emitted when a project does not exist.
    error ProjectDoesNotExist();
    /// @notice Emitted when attempting to set the same status to a project.
    error SameStatus();

    /// @notice Emitted when a document is added to a project.
    /// @param projectId The ID of the project.
    /// @param projectId The index of the document.
    event DocumentAdded(uint256 indexed projectId, uint256 index);
    /// @notice Emitted when a photo is added to a project.
    /// @param projectId The ID of the project.
    /// @param projectId The index of the photo.
    event PhotoAdded(uint256 indexed projectId, uint256 index);
    /// @notice Emitted when a project is created.
    /// @param projectId The ID of the created project.
    /// @param account The project holder of the created project.
    event Created(uint256 indexed projectId, address indexed account);
    /// @notice Emitted when tokens are minted for a project.
    /// @param projectId The ID of the project.
    /// @param account The account receiving the minted tokens.
    /// @param amount The amount of tokens minted.
    event Minted(uint256 indexed projectId, address indexed account, uint256 amount);
    /// @notice Emitted when the status of a project changes.
    /// @param projectId The ID of the project.
    /// @param status The new status of the project.
    event StatusChanged(uint256 indexed projectId, Status indexed status);

    /// @notice The possible statuses of a project.
    /// @dev Once the status is either "Canceled" or "Completed", it can not be altered anymore.
    enum Status {
        Canceled,
        Pending,
        Active,
        Completed
    }

    /// @notice Represents the details of a new project to be created.
    /// @dev This structure is used to store the initial information for a new project.
    /// @param projectHolder The address of the project holder.
    /// @param name The name of the project.
    /// @param description A brief description of the project.
    /// @param externalUrl The external URL related to the project.
    /// @param image The image URL of the project.
    /// @param data The detailed data of the project (see "ProjectData" struct).
    struct CreateParams {
        address projectHolder;
        string name;
        string description;
        string externalUrl;
        string image;
        ProjectData data;
    }

    /// @notice The structure representing a project.
    /// @param isRegistered Whether the project is registered.
    /// @param projectHolder The address of the project holder.
    /// @param id The ID of the project.
    /// @param name The name of the project.
    /// @param description The description of the project.
    /// @param externalUrl The external URL of the project.
    /// @param image The image URL of the project.
    /// @param photoUrls The photo URLs related to the project, stored with IPFS.
    /// @param documentUrls The document URLs related to the project, stored with IPFS.
    /// @param data The detailed data of the project (see "ProjectData" struct).
    /// @param status The current status of the project (see "Status" enum).
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
        Status status;
    }

    /// @notice The detailed data of a project.
    /// @param duration The duration of the project in years.
    /// @param ares The area of the project in ares.
    /// @param expectedCo2Tons The expected CO2 tons reduction.
    /// @param startDate The start date of the project in Unix timestamp.
    /// @param continent The continent where the project is located.
    /// @param country The country where the project is located.
    /// @param region The region where the project is located.
    /// @param province The province where the project is located.
    /// @param city The city where the project is located.
    /// @param location The specific location of the project (address).
    /// @param coordinates The coordinates of the project.
    /// @param plantedSpecies The species planted in the project.
    /// @param calculationMethod The method used for CO2 calculation.
    /// @param unSDGs The UN Sustainable Development Goals addressed by the project.
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

    /// @notice The address of the security fund.
    address public immutable securityFund;
    /// @notice The TCO2 contract instance.
    TCO2 public immutable tco2Contract;

    /// @notice The total number of projects.
    uint256 public totalProjects;
    /// @notice The mapping of project IDs to projects.
    mapping(uint256 => Project) internal _projects;

    /// @notice Ensures the project exists.
    /// @param _projectId The ID of the project.
    modifier exists(uint256 _projectId) {
        if (!_projects[_projectId].isRegistered) {
            revert ProjectDoesNotExist();
        }
        _;
    }

    /// @notice Ensures the project is not inactive (Canceled or Completed).
    /// @param _projectId The ID of the project.
    modifier notInactive(uint256 _projectId) {
        Status status = _projects[_projectId].status;
        if (status == Status.Canceled || status == Status.Completed) {
            revert InactiveProject();
        }
        _;
    }

    /// @notice Initializes the contract with the given parameters.
    /// @param _initialOwner The initial owner of the contract.
    /// @param _securityFund The address of the security fund.
    /// @param _tco2Contract The address of the TCO2 contract.
    constructor(address _initialOwner, address _securityFund, address _tco2Contract) Ownable(_initialOwner) {
        if (_securityFund == address(0) || _tco2Contract == address(0)) {
            revert AddressZero();
        }
        tco2Contract = TCO2(_tco2Contract);
        securityFund = _securityFund;
    }

    /// @notice Adds a document URL (stored with IPFS) to the project.
    /// @param projectId The ID of the project.
    /// @param documentUrl The IPFS URL of the document to add.
    function addDocument(
        uint256 projectId,
        string memory documentUrl
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        Project storage project = _get(projectId);
        emit DocumentAdded(projectId, project.documentUrls.length);
        project.documentUrls.push(documentUrl);
    }

    /// @notice Adds a photo URL (stored with IPFS) to the project.
    /// @param projectId The ID of the project.
    /// @param photoUrl The URL of the photo to add.
    function addPhoto(
        uint256 projectId,
        string memory photoUrl
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        Project storage project = _get(projectId);
        emit PhotoAdded(projectId, project.photoUrls.length);
        project.photoUrls.push(photoUrl);
    }

    /// @notice Creates a new project.
    /// @param newProject The project data (see "CreateParams" struct).
    function create(CreateParams memory newProject) external onlyOwner {
        string[] memory emptyArray = new string[](0);
        ProjectData memory projectData = ProjectData(
            newProject.data.duration,
            newProject.data.ares,
            newProject.data.expectedCo2Tons,
            newProject.data.startDate,
            newProject.data.continent,
            newProject.data.country,
            newProject.data.region,
            newProject.data.province,
            newProject.data.city,
            newProject.data.location,
            newProject.data.coordinates,
            newProject.data.plantedSpecies,
            newProject.data.calculationMethod,
            newProject.data.unSDGs
        );
        _projects[totalProjects] = Project(
            true, // isRegistered
            newProject.projectHolder,
            totalProjects, // id
            newProject.name,
            newProject.description,
            newProject.externalUrl,
            newProject.image,
            emptyArray, // photoUrls
            emptyArray, // documentUrls
            projectData,
            Status.Pending
        );
        emit Created(totalProjects, newProject.projectHolder);
        totalProjects++;
    }

    /// @notice Returns the project details.
    /// @param projectId The ID of the project.
    /// @return Project The project details.
    function get(uint256 projectId) external view exists(projectId) returns (Project memory) {
        return _projects[projectId];
    }

    /// @notice Mints TCO2 tokens for the given project.
    /// @dev Do not include metadata when the project already has minted tokens.
    /// @param projectId The ID of the project.
    /// @param amount The amount of tokens to mint.
    /// @param base64Metadata The metadata associated with the tokens, as a base64 string.
    function mintTokens(
        uint256 projectId,
        uint256 amount,
        string memory base64Metadata
    ) external onlyOwner exists(projectId) notInactive(projectId) {
        if (amount == 0) {
            revert CannotMintZeroToken();
        }
        bool needsMetadata = !tco2Contract.exists(projectId);
        if (
            (needsMetadata && bytes(base64Metadata).length == 0) || (!needsMetadata && bytes(base64Metadata).length > 0)
        ) {
            revert InvalidMetadata();
        }
        (uint256 receiverAmount, uint256 securityFundAmount) = _splitMint(amount, 20);
        bool hasSecurityFundAmount = securityFundAmount > 0;
        address receiver = _projects[projectId].projectHolder;
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

    /// @notice Sets the status of the project.
    /// @param projectId The ID of the project.
    /// @param status The new status of the project.
    function setStatus(uint256 projectId, Status status) external onlyOwner exists(projectId) notInactive(projectId) {
        Project storage project = _get(projectId);
        if (project.status == status) {
            revert SameStatus();
        }
        project.status = status;
        emit StatusChanged(projectId, status);
    }

    /// @notice Retrieves the project details for the given project ID.
    /// @dev This is an internal function to get project details.
    /// @param projectId The ID of the project.
    /// @return Project The project details stored in the contract.
    function _get(uint256 projectId) internal view returns (Project storage) {
        return _projects[projectId];
    }

    /// @notice Splits the total amount into two parts based on the split percentage.
    /// @dev The function ensures that the total amount is properly divided between the receiver and the security fund.
    /// The receiver will always receive more than the security fund when the amount to be shared is not a round number.
    /// @param totalAmount The total amount to be split.
    /// @param splitPercent The percentage to allocate to the security fund.
    /// @return receiverAmount The amount allocated to the receiver.
    /// @return securityFundAmount The amount allocated to the security fund.
    function _splitMint(uint256 totalAmount, uint8 splitPercent) internal pure returns (uint256, uint256) {
        uint256 receiverAmount = (totalAmount * (100 - splitPercent)) / 100;
        uint256 securityFundAmount = (totalAmount * splitPercent) / 100;
        if (totalAmount > (receiverAmount + securityFundAmount)) {
            receiverAmount++;
        }
        return (receiverAmount, securityFundAmount);
    }
}
