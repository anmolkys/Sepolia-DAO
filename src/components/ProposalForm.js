import React, { useState } from "react";
import { createProposal, voteOnProposal, executeProposal } from "../ethers";

const ProposalForm = ({ contract, fetchProposals }) => {
  const [description, setDescription] = useState("");
  const [proposalIndex, setProposalIndex] = useState("");

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    if (!description) return;
    await createProposal(contract, description);
    setDescription("");
    fetchProposals();t
  };

  const handleVote = async (e) => {
    e.preventDefault();
    if (!proposalIndex) return;
    await voteOnProposal(contract, proposalIndex);
    setProposalIndex("");
    fetchProposals();
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!proposalIndex) return;
    await executeProposal(contract, proposalIndex);
    setProposalIndex("");
    fetchProposals();
  };

  return (
    <div>
      <form onSubmit={handleCreateProposal}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Proposal Description"
          required
        />
        <button type="submit">Create Proposal</button>
      </form>

      <form onSubmit={handleVote}>
        <input
          type="number"
          value={proposalIndex}
          onChange={(e) => setProposalIndex(e.target.value)}
          placeholder="Proposal Index to Vote"
          required
        />
        <button type="submit">Vote on Proposal</button>
      </form>

      <form onSubmit={handleExecute}>
        <input
          type="number"
          value={proposalIndex}
          onChange={(e) => setProposalIndex(e.target.value)}
          placeholder="Proposal Index to Execute"
          required
        />
        <button type="submit">Execute Proposal</button>
      </form>
    </div>
  );
};

export default ProposalForm;
