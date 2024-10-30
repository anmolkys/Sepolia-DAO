// src/ethers.js
import { BrowserProvider, Contract } from "ethers"; // Updated imports
import SimpleDAOABI from "./abi.json";

const CONTRACT_ADDRESS = "0x3093Ac017512C262dA3dF0a6B511f58a9c8486A4";

// Function to get the provider, signer, and contract
export const getEthersProviderAndContract = async () => {
  const provider = new BrowserProvider(window.ethereum); // Updated to BrowserProvider
  await provider.send("eth_requestAccounts", []); // Ask user to connect wallet
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, SimpleDAOABI, signer);
  return { provider, signer, contract };
};

// Function to get proposals and user vote status
export const getProposalsWithVoteStatus = async (contract, userAddress) => {
  const proposalCount = await contract.getProposalCount();
  const proposals = [];
  for (let i = 0; i < proposalCount; i++) {
    const proposal = await contract.getProposal(i);
    const hasVoted = await contract.hasVoted(i, userAddress); // Check if the user has voted
    proposals.push({
      description: proposal[0],
      voteCount: proposal[1].toString(),
      executed: proposal[2],
      hasVoted: hasVoted,
    });
  }
  return proposals;
};

// Function to vote on a proposal
export const voteOnProposal = async (contract, index) => {
  try {
    const tx = await contract.vote(index);
    await tx.wait();
  } catch (error) {
    console.error("Vote failed:", error);
    throw new Error("Failed to vote on the proposal.");
  }
};

// Function to execute a proposal
export const executeProposal = async (contract, index) => {
  try {
    const tx = await contract.executeProposal(index);
    await tx.wait();
  } catch (error) {
    console.error("Execution failed:", error);
    throw new Error("Failed to execute the proposal.");
  }
};

// Function to create a new proposal
export const createProposal = async (contract, description) => {
  try {
    const tx = await contract.createProposal(description);
    await tx.wait();
  } catch (error) {
    console.error("Proposal creation failed:", error);
    throw new Error("Failed to create the proposal.");
  }
};