# 🍀 LuckyNumber — Web3 dApp on Botchain Mainnet

LuckyNumber is a minimalist, elegant Web3 decentralized application (dApp) built on **Botchain Mainnet**. It enables users to connect their Web3 wallet, choose their favourite lucky number (between 1 and 100 inclusive), and permanently save it on the blockchain. Anyone can enter any wallet address to discover that wallet's chosen lucky number.

The project adheres to strict architectural simplicity: **one Solidity smart contract, one responsive webpage, zero backends, and zero centralized databases**.

---

## 🚀 Live Blockchain Network Details (Botchain Mainnet)

- **Network Name**: BOT Chain (Mainnet)
- **Chain ID**: `677`
- **BOT Chain Website**: [https://botchain.ai](https://botchain.ai)
- **BOT Chain Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)
- **RPC URL**: `https://rpc.botchain.ai`
- **Native Currency**: `BOT` (18 decimals)
- **Total Supply**: `150 Million BOT`
- **Deployed Contract Address**: [`0x27Cdd24BEa9983E50fAfCF943F992b7785731f36`](https://scan.botchain.ai/address/0x27Cdd24BEa9983E50fAfCF943F992b7785731f36)
- **Deployment Transaction**: [`0x06e009cf1a0564058dbd93fe117916d4e6a13e45d9d46443fbfad3f3e16ffb74`](https://scan.botchain.ai/tx/0x06e009cf1a0564058dbd93fe117916d4e6a13e45d9d46443fbfad3f3e16ffb74)
- **Gas Fee Consumed**: `0.00314386 BOT` (Economical & minimal)

---

## ✨ Features

- **Wallet Connection**: Connect with MetaMask, Rabby, OKX, Coinbase Wallet, or any standard injected Web3 wallet.
- **Network Verification & Switching**: Detects network connectivity and prompts a 1-click switch to Botchain Mainnet (Chain ID 677) if connected to another network.
- **Save & Update Lucky Number**:
  - Number input restricted strictly to values between `1` and `100`.
  - Interactive slider, increment/decrement stepper, and quick-pick presets.
  - Large glowing preview badge showcasing the chosen number.
  - Emits on-chain `NumberUpdated` event.
  - Displays transaction status (signing, confirming, confirmed, or rejected).
  - Displays explorer links with the confirmed transaction hash on BotchainScan.
  - Users can update their number at any time.
- **Look Up Any Wallet**:
  - Validates Ethereum/Botchain format (42-character hex).
  - Reads directly from the smart contract functions `hasNumber` and `getNumber`.
  - Distinguishes clearly between unset wallets and wallets with a saved number.
  - Quick-action to query the currently connected wallet with a single click.
- **Dark Navy Aesthetics**: Sleek dark navy palette (`#070a13`), electric indigo and purple gradients, glassmorphism cards, and smooth micro-interactions.

---

## 🛠 Technology Stack

- **Smart Contract**: Solidity `^0.8.20`
- **Development & Testing**: Hardhat, Ethers.js, Chai
- **Frontend Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: wagmi v2, viem, `@tanstack/react-query`
- **Icons**: Lucide React

---

## 📁 Repository Structure

```text
├── contracts/
│   └── LuckyNumber.sol          # Solidity smart contract
├── scripts/
│   └── deploy.js                # Deployment script for Botchain Mainnet
├── test/
│   └── LuckyNumber.test.js      # Hardhat unit tests
├── src/
│   ├── app/
│   │   ├── globals.css          # Theme styles, gradients, and custom animations
│   │   ├── layout.tsx           # Root layout with Web3 providers & metadata
│   │   └── page.tsx             # Single-page dApp interface
│   ├── components/
│   │   ├── Navbar.tsx           # Header, logo, network badge & wallet button
│   │   ├── SaveNumberCard.tsx   # Visual selector, preview, contract writer
│   │   ├── LookupWalletCard.tsx # Address search & on-chain reader
│   │   ├── ContractConfigBanner.tsx # Contract address manager & BotchainScan link
│   │   └── Providers.tsx        # Wagmi & React Query client providers
│   └── config/
│       ├── contract.ts          # Contract ABI, types, and address resolution
│       ├── deployedContract.json# Auto-populated deployment output
│       ├── network.ts           # Botchain Mainnet chain definition
│       └── wagmi.ts             # Wagmi client configuration
├── hardhat.config.js            # Hardhat network & compiler configuration
├── .env.example                 # Template for environment variables
├── package.json                 # Project scripts and dependencies
└── README.md                    # Documentation
```

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd Luckynumber
npm install
```

---

## 🧪 Smart Contract Testing

Run the full suite of unit tests using Hardhat:

```bash
npm test
```

Or directly via Hardhat:

```bash
npx hardhat test
```

### Verified Test Cases:
- ✅ A wallet can save a valid number (1–100).
- ✅ Lower (1) and upper (100) boundary values succeed.
- ✅ A wallet can update its number at any time.
- ✅ Different wallets can save independent numbers.
- ✅ Zero (`0`) is rejected with `InvalidNumber(0)`.
- ✅ Numbers greater than 100 (e.g. `101`, `999`) are rejected with `InvalidNumber`.
- ✅ An unset wallet is correctly identified (`hasNumber == false`, `getNumber == 0`).
- ✅ `NumberUpdated` event is emitted with the correct indexed address and number.

---

## 🚀 Smart Contract Deployment

### 1. Configure Your Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set your deployer wallet private key:

```env
PRIVATE_KEY=your_private_key_without_quotes
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
```

> **Security Note:** Never commit your `.env` file or private key to Git. `.env` is included in `.gitignore`.

### 2. Fund Your Deployer Wallet
Ensure your deployer address has `BOT` tokens for gas fees on Botchain Mainnet.

### 3. Deploy to Botchain Mainnet
Run the deployment script:

```bash
npm run deploy:mainnet
```

Upon successful deployment, the script:
1. Outputs the deployed contract address and deployment transaction hash.
2. Automatically updates `src/config/deployedContract.json` with the deployed address.

---

## ⚙️ Configuring the Contract Address

You can configure the active contract address in any of three ways:

1. **Automatic Deployment Output**: After running `npm run deploy:mainnet`, `src/config/deployedContract.json` is updated automatically.
2. **Environment Variable**: Set `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...` in `.env.local` or `.env`.
3. **In-DApp UI Configuration**: When you load the dApp, if no contract address is set or if you wish to test with an address on-the-fly, click **"Enter Contract Address"** or **"Change"** in the top banner and paste the address. The dApp will save it to your browser's local storage.

---

## 💻 Running the Frontend Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To verify a production build locally:

```bash
npm run build
npm start
```

---

## 🌐 Deploying to Vercel

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of LuckyNumber Web3 dApp"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section on Vercel, add:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: Your deployed `LuckyNumber` contract address (e.g. `0x...`).
5. Click **Deploy**. Vercel will build and host your dApp with global CDN edge routing and automatic HTTPS.

---

## 📄 Smart Contract Specification (`LuckyNumber.sol`)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LuckyNumber {
    mapping(address => uint256) private _numbers;
    mapping(address => bool) private _hasNumber;

    event NumberUpdated(address indexed user, uint256 number);

    error InvalidNumber(uint256 number);

    function setNumber(uint256 number) external {
        if (number < 1 || number > 100) {
            revert InvalidNumber(number);
        }
        _numbers[msg.sender] = number;
        _hasNumber[msg.sender] = true;
        emit NumberUpdated(msg.sender, number);
    }

    function getNumber(address user) external view returns (uint256) {
        return _numbers[user];
    }

    function hasNumber(address user) external view returns (bool) {
        return _hasNumber[user];
    }
}
```

---

## 📜 License
MIT License. Built for Botchain Mainnet.
