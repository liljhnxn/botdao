// SPDX-License-Identifier: MIT
﻿

// Sources flattened with hardhat v2.29.1 https://hardhat.org


// File @openzeppelin/contracts/utils/StorageSlot.sol@v5.6.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.

pragma solidity ^0.8.20;

/**
 * @dev Library for reading and writing primitive types to specific storage slots.
 *
 * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
 * This library helps with reading and writing to such slots without the need for inline assembly.
 *
 * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
 *
 * Example usage to set ERC-1967 implementation slot:
 * ```solidity
 * contract ERC1967 {
 *     // Define the slot. Alternatively, use the SlotDerivation library to derive the slot.
 *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
 *
 *     function _getImplementation() internal view returns (address) {
 *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
 *     }
 *
 *     function _setImplementation(address newImplementation) internal {
 *         require(newImplementation.code.length > 0);
 *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
 *     }
 * }
 * ```
 *
 * TIP: Consider using this library along with {SlotDerivation}.
 */
library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct Int256Slot {
        int256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Int256Slot` with member `value` located at `slot`.
     */
    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns a `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }
}


// File @openzeppelin/contracts/utils/ReentrancyGuard.sol@v5.6.1

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.5.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 *
 * IMPORTANT: Deprecated. This storage-based reentrancy guard will be removed and replaced
 * by the {ReentrancyGuardTransient} variant in v6.0.
 *
 * @custom:stateless
 */
abstract contract ReentrancyGuard {
    using StorageSlot for bytes32;

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ReentrancyGuard")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant REENTRANCY_GUARD_STORAGE =
        0x9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00;

    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    /**
     * @dev A `view` only version of {nonReentrant}. Use to block view functions
     * from being called, preventing reading from inconsistent contract state.
     *
     * CAUTION: This is a "view" modifier and does not change the reentrancy
     * status. Use it only on view functions. For payable or non-payable functions,
     * use the standard {nonReentrant} modifier instead.
     */
    modifier nonReentrantView() {
        _nonReentrantBeforeView();
        _;
    }

    function _nonReentrantBeforeView() private view {
        if (_reentrancyGuardEntered()) {
            revert ReentrancyGuardReentrantCall();
        }
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        _nonReentrantBeforeView();

        // Any calls to nonReentrant after this point will fail
        _reentrancyGuardStorageSlot().getUint256Slot().value = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _reentrancyGuardStorageSlot().getUint256Slot().value == ENTERED;
    }

    function _reentrancyGuardStorageSlot() internal pure virtual returns (bytes32) {
        return REENTRANCY_GUARD_STORAGE;
    }
}


// File contracts/BotDAO.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BotDAO
 * @notice Mini Decentralized Autonomous Organization on Botchain for community treasury governance.
 * @dev Governs native BOT treasury funds with proposal creation, 1-wallet-1-vote voting, quorum, and safe execution.
 */
contract BotDAO is ReentrancyGuard {
    struct Proposal {
        uint256 id;
        address proposer;
        address recipient;
        uint256 amount;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
    }

    /// @notice Quorum votes required for a proposal to pass
    uint256 public quorumVotes;

    /// @notice Total proposals counter
    uint256 public proposalCount;

    /// @notice Mapping from proposal ID to Proposal struct
    mapping(uint256 => Proposal) public proposals;

    /// @notice Mapping to track if a wallet has voted on a proposal: proposalId => voter => voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        address indexed recipient,
        uint256 amount,
        string description,
        uint256 startTime,
        uint256 endTime
    );

    event TreasuryDeposit(
        address indexed depositor,
        uint256 amount
    );

    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support
    );

    event ProposalExecuted(
        uint256 indexed proposalId,
        address indexed executor,
        address indexed recipient,
        uint256 amount
    );

    event ProposalCanceled(
        uint256 indexed proposalId,
        address indexed proposer
    );

    /**
     * @notice Initialize BotDAO with required quorum votes
     * @param _initialQuorum Minimum total votes needed for proposal validity
     */
    constructor(uint256 _initialQuorum) {
        quorumVotes = _initialQuorum;
    }

    /**
     * @notice Deposit native BOT tokens into the DAO treasury
     */
    function depositTreasury() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit TreasuryDeposit(msg.sender, msg.value);
    }

    /**
     * @notice Allow contract to receive native BOT directly
     */
    receive() external payable {
        if (msg.value > 0) {
            emit TreasuryDeposit(msg.sender, msg.value);
        }
    }

    /**
     * @notice Create a funding proposal requesting native BOT from treasury
     * @param recipient Target address to receive treasury funds if passed
     * @param amount Amount of BOT requested (in wei)
     * @param description Purpose/title/details of the proposal
     * @param votingDuration Duration of voting in seconds
     * @return proposalId The ID of the newly created proposal
     */
    function createProposal(
        address recipient,
        uint256 amount,
        string calldata description,
        uint256 votingDuration
    ) external returns (uint256) {
        require(recipient != address(0), "Recipient cannot be zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(votingDuration > 0, "Voting duration must be greater than zero");

        proposalCount++;
        uint256 proposalId = proposalCount;
        uint256 startTime = block.timestamp;
        uint256 endTime = block.timestamp + votingDuration;

        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            recipient: recipient,
            amount: amount,
            description: description,
            startTime: startTime,
            endTime: endTime,
            forVotes: 0,
            againstVotes: 0,
            executed: false,
            canceled: false
        });

        emit ProposalCreated(
            proposalId,
            msg.sender,
            recipient,
            amount,
            description,
            startTime,
            endTime
        );

        return proposalId;
    }

    /**
     * @notice Cast a vote on a proposal (One wallet = one vote)
     * @param proposalId ID of the proposal
     * @param support True for FOR, False for AGAINST
     */
    function vote(uint256 proposalId, bool support) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[proposalId];

        require(!proposal.canceled, "Proposal is canceled");
        require(!proposal.executed, "Proposal is already executed");
        require(block.timestamp >= proposal.startTime, "Voting has not started");
        require(block.timestamp <= proposal.endTime, "Voting period has ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted on this proposal");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposal.forVotes++;
        } else {
            proposal.againstVotes++;
        }

        emit VoteCast(proposalId, msg.sender, support);
    }

    /**
     * @notice Check if a proposal meets all criteria to pass
     * @param proposalId ID of the proposal
     * @return True if proposal passed, false otherwise
     */
    function proposalPassed(uint256 proposalId) public view returns (bool) {
        if (proposalId == 0 || proposalId > proposalCount) {
            return false;
        }

        Proposal storage proposal = proposals[proposalId];

        // Must be past voting end time
        if (block.timestamp <= proposal.endTime) {
            return false;
        }

        // Cannot be canceled or already executed
        if (proposal.canceled || proposal.executed) {
            return false;
        }

        // Total votes must meet or exceed quorum
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        if (totalVotes < quorumVotes) {
            return false;
        }

        // Majority rule: FOR > AGAINST
        if (proposal.forVotes <= proposal.againstVotes) {
            return false;
        }

        return true;
    }

    /**
     * @notice Execute a passed proposal and transfer native BOT from treasury
     * @dev Follows Checks-Effects-Interactions pattern with ReentrancyGuard
     * @param proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[proposalId];

        require(block.timestamp > proposal.endTime, "Voting period has not ended");
        require(!proposal.canceled, "Proposal is canceled");
        require(!proposal.executed, "Proposal is already executed");
        require(proposalPassed(proposalId), "Proposal did not pass");
        require(address(this).balance >= proposal.amount, "Insufficient treasury balance");
        require(proposal.recipient != address(0), "Invalid recipient address");

        // Effects
        proposal.executed = true;

        // Interaction
        (bool success, ) = proposal.recipient.call{value: proposal.amount}("");
        require(success, "BOT treasury transfer failed");

        emit ProposalExecuted(
            proposalId,
            msg.sender,
            proposal.recipient,
            proposal.amount
        );
    }

    /**
     * @notice Cancel a proposal before it is executed
     * @param proposalId ID of the proposal
     */
    function cancelProposal(uint256 proposalId) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[proposalId];

        require(msg.sender == proposal.proposer, "Only the proposer can cancel");
        require(!proposal.executed, "Proposal is already executed");
        require(!proposal.canceled, "Proposal is already canceled");

        proposal.canceled = true;

        emit ProposalCanceled(proposalId, msg.sender);
    }

    /**
     * @notice Get single proposal by ID
     * @param proposalId ID of the proposal
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        return proposals[proposalId];
    }

    /**
     * @notice Get total number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }

    /**
     * @notice Get current native BOT treasury balance
     */
    function getTreasuryBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Fetch all proposals in a single call for efficient UI rendering
     */
    function getAllProposals() external view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalCount);
        for (uint256 i = 1; i <= proposalCount; i++) {
            allProposals[i - 1] = proposals[i];
        }
        return allProposals;
    }

    /**
     * @notice Helper to check if a specific user has voted on a proposal
     */
    function hasUserVoted(uint256 proposalId, address user) external view returns (bool) {
        return hasVoted[proposalId][user];
    }
}
