import { useState } from 'react'
import { ethers } from 'ethers'
import HiFiArtifact from './HiFiChain.json'
import './App.css'

// CONFIGURATION
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!currentAccount) return alert("Connect Wallet first!");

    setIsLoading(true);
    setStatusType("loading");
    setStatus("Waiting for signature...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, HiFiArtifact.abi, signer);

      const tx = await contract.registerAsset(model, serial, price);
      setStatus("Mining transaction...");
      await tx.wait();

      setStatusType("success");
      setStatus(`Asset ${serial} successfully minted on-chain.`);

      setModel(""); setSerial(""); setPrice("");
    } catch (error) {
      console.error(error);
      setStatusType("error");
      setStatus(error.reason || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!currentAccount) return alert("Connect Wallet first!");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, HiFiArtifact.abi, provider);

      const result = await contract.verifyAsset(serial);

      if (result[0] === true) {
        setVerifyResult({ isValid: true, name: result[1], owner: result[2] });
      } else {
        setVerifyResult({ isValid: false });
      }
    } catch (error) {
      console.error(error);
      alert("Verification failed.");
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo-group">
          <svg className="logo-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path>
            <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
          <h1>HiFiChain</h1>
        </div>

        {!currentAccount ? (
          <button className="btn btn-primary" onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div className="wallet-badge">
            <span className="indicator"></span>
            {currentAccount.substring(0, 6)}...{currentAccount.slice(-4)}
          </div>
        )}
      </header>

      <main className="app-main">
        <section className="glass-panel">
          <div className="panel-header">
            <h2>Factory Registration</h2>
            <p className="subtitle">Mint a new Certificate of Authenticity.</p>
          </div>

          <form onSubmit={handleRegister} className="hifi-form">
            <div className="input-group">
              <label htmlFor="model">Model Name</label>
              <input id="model" type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. Sennheiser HE-1" required />
            </div>

            <div className="input-group-row">
              <div className="input-group">
                <label htmlFor="serial">Serial Number</label>
                <input id="serial" type="text" value={serial} onChange={e => setSerial(e.target.value)} placeholder="e.g. SN-001" required />
              </div>
              <div className="input-group">
                <label htmlFor="price">Value (USD)</label>
                <input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" required />
              </div>
            </div>

            <button type="submit" className="btn btn-accent" disabled={isLoading}>
              {isLoading ? "Processing..." : "Mint Asset"}
            </button>
          </form>

          {status && (
            <div className={`status-message ${statusType}`} role="status" aria-live="polite">
              {statusType === 'loading' && <span className="spinner"></span>}
              {statusType === 'success' && <span className="icon">✓</span>}
              {statusType === 'error' && <span className="icon">!</span>}
              {status}
            </div>
          )}
        </section>

        <section className="glass-panel">
          <div className="panel-header">
            <h2>Verify Authenticity</h2>
            <p className="subtitle">Check the digital provenance of a unit.</p>
          </div>

          <form onSubmit={handleVerify} className="hifi-form">
            <div className="input-group">
              <label htmlFor="verify-serial">Device Serial Number</label>
              <div className="search-bar">
                <input id="verify-serial" type="text" onChange={e => setSerial(e.target.value)} placeholder="Enter Serial Number" required />
                <button type="submit" className="btn btn-secondary">Verify</button>
              </div>
            </div>
          </form>

          {verifyResult && (
            <div className="result-container">
              {verifyResult.isValid ? (
                <div className="certificate-card valid">
                  <div className="cert-header">
                    <span className="cert-icon">✦</span>
                    <h3>Authentic Asset</h3>
                  </div>
                  <div className="cert-body">
                    <div className="data-row">
                      <span className="label">Model</span>
                      <span className="value">{verifyResult.name}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">Owner</span>
                      <span className="value mono">{verifyResult.owner}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">Status</span>
                      <span className="value verified">Verified on Blockchain</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="certificate-card invalid">
                  <div className="cert-header">
                    <span className="cert-icon">✕</span>
                    <h3>Verification Failed</h3>
                  </div>
                  <p>No asset found with this serial number in the registry.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Secured by Ethereum
        </div>
        <div className="divider"></div>
        <div className="footer-item">
          <span className="status-dot"></span>
          Network Online
        </div>
      </footer>
    </div>
  )
}

export default App