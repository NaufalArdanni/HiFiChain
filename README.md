# IF4035 Blockchain Semester 1 2025/2026 Project - HiFiChain: Decentralized High-Fidelity Asset Authentication

## Identity

| Student ID | Name                    |
| ---------- | ----------------------- |
| 13521154   | Naufal Baldemar Ardanni |

## 1. Application Description

HiFiChain is a decentralized application (dApp) designed to combat counterfeiting in the high-end audio market. It enables manufacturers to mint immutable digital certificates on a private Ethereum blockchain, allowing buyers to cryptographically verify asset provenance without intermediaries.

**Key Features:**

- **Asset Minting:** Records Model, Serial Number, and Manufacture Date on-chain.
- **Transparent Verification:** Anyone can verify the authenticity status using the Serial Number.
- **Oracle Integration:** Fetches real-time ETH/USD market prices from an external API (CoinGecko) to benchmark asset value.
- **OWASP Security:** Implements strict _Access Control_ (only the owner can register assets) to prevent data manipulation.

---

## 2. System Requirements

The following environment is required to deploy the dApp and run the private chain:

**Software (Mandatory):**

- **Node.js** (v18.0.0 or later)
- **Git** (for version control)
- **Modern Browser** (Chrome/Edge/Brave) with **MetaMask** extension installed.

**Project Dependencies (Installed via `npm install`):**

- **Blockchain Engine:** Hardhat (v2.x)
- **Frontend Framework:** React + Vite
- **Web3 Library:** Ethers.js v6
- **HTTP Client:** Axios (for Oracle)

---

## 3. How to Run the Private Chain

The private blockchain must run in the background while the application is in use.

1.  Open a terminal in the project root folder.
2.  Navigate to the smart contract directory:
    ```bash
    cd smart-contract
    ```
3.  Install dependencies (first time only):
    ```bash
    npm install
    ```
4.  Start the local Hardhat node:
    ```bash
    npx hardhat node
    ```
    > **Important:** Do not close this terminal. It acts as the "Blockchain Server".

---

## 4. How to Deploy the Smart Contract

Once the Private Chain is running (Step 3), the smart contract must be deployed to the network.

1.  Open a **New Terminal**.
2.  Navigate to the smart contract directory:
    ```bash
    cd smart-contract
    ```
3.  Run the deployment script:
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```
4.  **Configure Contract Address:**
    - Copy the address displayed in the terminal (e.g., `0x5Fb...`).
    - Open `frontend/src/App.jsx` and paste it into the `contractAddress` variable.
    - Open `oracle/priceOracle.js` and paste it into the `CONTRACT_ADDRESS` variable.

---

## 5. How to Deploy and Integrate the Oracle

The Oracle service bridges real-world data (ETH price) to the closed blockchain environment.

1.  Open a **New Terminal**.
2.  Navigate to the oracle directory:
    ```bash
    cd oracle
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the Oracle service:
    ```bash
    node priceOracle.js
    ```
    _Output "Oracle Update Complete!" indicates price data was successfully pushed to the Smart Contract._

---

## 6. Videos

- **Playlist:** https://youtube.com/playlist?list=PLOP7MIysOlx9QSCsXAPLbJmS8Abl42myj
- **Demo:** https://www.youtube.com/watch?v=MTB2pBaO0Nc
- **Presentation:** https://www.youtube.com/watch?v=X76cgh9kIfE

---

## 7. Running the Frontend (User Access)

After completing steps 1-5, users can interact with the application.

1.  Open a **New Terminal**.
2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and access: `http://localhost:5173`
