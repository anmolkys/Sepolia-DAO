import React, { useState } from "react";
import { getEthersProviderAndContract, getProposalsWithVoteStatus, voteOnProposal, executeProposal, createProposal } from "./ethers";
import ProposalsList from "./components/ProposalsList";
import ProposalModal from "./components/ProposalModal";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaEthereum, FaGithub } from "react-icons/fa";
import { FaFaucetDrip , FaWallet } from "react-icons/fa6";
import Howto from "./components/Howto";
import './App.css';

const App = () => {
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const CONTRACT_ADDRESS = "0x3093Ac017512C262dA3dF0a6B511f58a9c8486A4";
  const ETHERSCAN_URL = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`;


  const connectWallet = async () => {
    try {
      const { contract, signer } = await getEthersProviderAndContract();
      const userAddress = await signer.getAddress();
      setContract(contract);
      setIsConnected(true);
      setLoading(true);
      fetchProposals(contract, userAddress);
      toast.success("Connected to Wallet");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to wallet.");
    }
  };


  const fetchProposals = async (contract, userAddress) => {
    try {
      const proposals = await getProposalsWithVoteStatus(contract, userAddress);
      setProposals(proposals);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load proposals.");
    }
  };

  const vote = async (proposalIndex) => {
    try {
      await voteOnProposal(contract, proposalIndex - 1);
      fetchProposals(contract);
      toast.success(`Voted on proposal #${proposalIndex} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to vote on proposal ${proposalIndex}.`);
    }
  };

  const execute = async (proposalIndex) => {
    try {
      await executeProposal(contract, proposalIndex - 1);
      fetchProposals(contract);
      toast.success(`Executed proposal #${proposalIndex} successfully!`);
    } catch (error) {
      console.error(error);
      if (error.message.includes("Only chairperson can execute")) {
        toast.error("You are not the chairperson, only the chairperson can execute this proposal.");
      } else {
        toast.error(`Failed to execute proposal ${proposalIndex}.`);
      }
    }
  };


  const handleCreateProposal = async (description) => {
    try {
      toast.info("Check wallet for Pending Transaction");
      await createProposal(contract, description);
      fetchProposals(contract);
      toast.success("Proposal created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create the proposal.");
    }
  };

  return (
    <>
      <header className="header">
        <div>Interactive DAO</div>
        <div className="logos">
          <a href="https://github.com/anmolkys/Sepolia-DAO"><FaGithub className="logo"></FaGithub></a>
          <a href="https://www.alchemy.com/faucets/ethereum-sepolia"><FaFaucetDrip className="logo"></FaFaucetDrip></a>
        </div>
      </header>
      <div className="App dark-theme">
        <h3>Digital Assignment 3&4</h3>
        <label>by 21BCE0534</label>
        <div className="network-info">
          <span>Using : Sepolia Etherium</span>
          <FaEthereum></FaEthereum>
        </div>
        {isConnected && <div className="create-proposal-btn" onClick={() => setShowModal(true)} >New Proposal<FaPlus /></div>}
        {!isConnected ? (
          <div className="walletContainer">
          <button onClick={connectWallet} className="connect-wallet-btn">
            Metamask  
            <FaWallet></FaWallet>
          </button>
          <Howto></Howto>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <div className="main">
                <ProposalsList proposals={proposals} vote={vote} execute={execute} className="proposal" />
                <Howto></Howto>
              </div>
            )}
          </>
        )}

        <ProposalModal
          show={showModal}
          onClose={() => setShowModal(false)}
          createProposal={handleCreateProposal}
        />
        <footer className="app-footer">
          <p>
            Track this DAO on{" "}
            <a href={ETHERSCAN_URL} target="_blank" rel="noopener noreferrer" style={{color:"green"}}>
              Etherscan
            </a>
          </p>
        </footer>
        <ToastContainer />
      </div>
    </>
  );
};
export default App;