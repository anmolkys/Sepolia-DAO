pragma solidity ^0.8.0;

contract SimpleDAO {
    struct Proposal {
        string description;
        uint voteCount;
        bool executed;
    }

    address public chairperson;
    Proposal[] public proposals;
    mapping(address => bool) public voters;
    mapping(uint => mapping(address => bool)) public hasVoted;

    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only chairperson can execute");
        _;
    }

    modifier onlyVoter() {
        require(voters[msg.sender], "Not a registered voter");
        _;
    }

    constructor() {
        chairperson = msg.sender;
        voters[chairperson] = true; // Chairperson is a voter by default
    }

    function registerVoter(address voter) public onlyChairperson {
        voters[voter] = true;
    }

    function createProposal(string memory description) public onlyVoter {
        proposals.push(Proposal({
            description: description,
            voteCount: 0,
            executed: false
        }));
    }

    function vote(uint proposalIndex) public onlyVoter {
        require(!hasVoted[proposalIndex][msg.sender], "Already voted");
        proposals[proposalIndex].voteCount += 1;
        hasVoted[proposalIndex][msg.sender] = true;
    }

    function executeProposal(uint proposalIndex) public onlyChairperson {
        Proposal storage proposal = proposals[proposalIndex];
        require(!proposal.executed, "Already executed");
        require(proposal.voteCount > 0, "Not enough votes");
        proposal.executed = true;
    }

    function getProposalCount() public view returns (uint) {
        return proposals.length;
    }

    function getProposal(uint proposalIndex) public view returns (string memory description, uint voteCount, bool executed) {
        Proposal storage proposal = proposals[proposalIndex];
        return (proposal.description, proposal.voteCount, proposal.executed);
    }
}