# 🍀 LuckyNumber — Web3 dApp on Botchain Testnet

LuckyNumber is a minimalist, elegant Web3 decentralized application (dApp) built on **Botchain Testnet**. It enables users to connect their Web3 wallet, choose their favourite lucky number (between 1 and 100 inclusive), and permanently save it on the blockchain. Anyone can enter any wallet address to discover that wallet's chosen lucky number.

The project adheres to strict architectural simplicity: **one Solidity smart contract, one responsive webpage, zero backends, and zero centralized databases**.

---

## 🚀 Live Blockchain Network Details

- **Network Name**: Botchain Testnet
- **Chain ID**: `968`
- **RPC URL**: `https://rpc.bohr.life`
- **Block Explorer**: [https://scan.bohr.life](https://scan.bohr.life)
- **Native Currency**: `BOT` (18 decimals)
- **Deployed Contract Address**: [`0x3AdD26Fa7A69e01d94cA4c5473a8DfEC1A84076e`](https://scan.bohr.life/address/0x3AdD26Fa7A69e01d94cA4c5473a8DfEC1A84076e#code) (Verified on BohrScan)
- **Deployment Transaction**: [`0x6e790cc87d0000db89a44da37af923363ef72fadb78a520a6978b8a83e2260ad`](https://scan.bohr.life/tx/0x6e790cc87d0000db89a44da37af923363ef72fadb78a520a6978b8a83e2260ad)

---

## ✨ Features

- **Wallet Connection**: Connect with MetaMask, Rabby, OKX, Coinbase Wallet, or any standard injected Web3 wallet.
- **Network Verification & Switching**: Detects network connectivity and prompts a 1-click switch to Botchain Testnet (Chain ID 968) if connected to another network.
- **Save & Update Lucky Number**:
  - Number input restricted strictly to values between `1` and `100`.
  - Interactive slider, increment/decrement stepper, and quick-pick presets.
  - Large glowing preview badge showcasing the chosen number.
  - Emits on-chain `NumberUpdated` event.
  - Displays transaction status (signing, confirming, confirmed, or rejected).
  - Displays explorer links with the confirmed transaction hash on BohrScan.
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
│   └── deploy.js                # Hardhat deployment script for Botchain Testnet
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
│   │   ├── ContractConfigBanner.tsx # Contract address manager & BohrScan link
│   │   └── Providers.tsx        # Wagmi & React Query client providers
│   └── config/
│       ├── contract.ts          # Contract ABI, types, and address resolution
│       ├── deployedContract.json# Auto-populated deployment output
│       ├── network.ts           # Botchain Testnet chain definition
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
BOTCHAIN_RPC_URL=https://rpc.bohr.life
```

> **Security Note:** Never commit your `.env` file or private key to Git. `.env` is included in `.gitignore`.

### 2. Fund Your Deployer Wallet
Ensure your deployer address has testnet `BOT` tokens for gas fees on Botchain Testnet.

### 3. Deploy to Botchain Testnet
Run the deployment script:

```bash
npm run deploy:testnet
```

Upon successful deployment, the script:
1. Outputs the deployed contract address and deployment transaction hash.
2. Automatically updates `src/config/deployedContract.json` with the deployed address.

---

## ⚙️ Configuring the Contract Address

You can configure the active contract address in any of three ways:

1. **Automatic Deployment Output**: After running `npm run deploy:testnet`, `src/config/deployedContract.json` is updated automatically.
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
MIT License. Built for Botchain Testnet.
