import React from "react";
import { FaCheck, FaHourglassHalf } from "react-icons/fa";

const ProposalsList = ({ proposals, vote, execute }) => {
  return (
    <div className="proposals-list">
      {proposals.length === 0 ? (
        <p>No proposals found.</p>
      ) : (
        <ul className="proposalUL">
          {proposals.map((proposal, index) => (
            <li key={index} className="proposal-card">
              <div className="proposal-info">
                <strong>{index + 1}: {proposal.description}</strong> <br />
                Votes: {proposal.voteCount} <br />
                Status: {proposal.executed ? "Executed" : "Pending"}
              </div>

              <div className="proposal-actions">
                {!proposal.executed && (
                  <>
                    {proposal.hasVoted ? (
                      <FaCheck style={{ color: "green", fontSize: "1rem" }} />
                    ) : (
                      <>
                        <FaHourglassHalf style={{ color: "orange", fontSize: "1rem" }} />
                        <button onClick={() => vote(index + 1)} className="vote-btn">
                          Vote
                        </button>
                      </>
                    )}
                    <button onClick={() => execute(index + 1)} className="execute-btn">
                      Execute
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProposalsList;