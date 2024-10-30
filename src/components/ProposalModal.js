import React, { useState } from "react";

const ProposalModal = ({ show, onClose, createProposal }) => {
  const [description, setDescription] = useState("");

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description) {
      try {
        await createProposal(description);
        onClose();
      } catch (error) {
        console.error("Error creating proposal:", error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Proposal</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Proposal Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="modal-input"
          />
          <button type="submit" className="modal-submit-btn">
            Create Proposal
          </button>
        </form>
        <button onClick={onClose} className="close-modal">
          Close
        </button>
      </div>
    </div>
  );
};

export default ProposalModal;