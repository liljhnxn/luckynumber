# 🍀 LuckyNumber: Whitepaper & Pitch Deck

> **Decentralized On-Chain Personal Identity & Lucky Number Protocol on Botchain Testnet**  
> *Contract Address*: `0x3AdD26Fa7A69e01d94cA4c5473a8DfEC1A84076e` (Botchain Testnet, Chain ID: 968)  
> *Explorer Link*: [https://scan.bohr.life/address/0x3AdD26Fa7A69e01d94cA4c5473a8DfEC1A84076e#code](https://scan.bohr.life/address/0x3AdD26Fa7A69e01d94cA4c5473a8DfEC1A84076e#code)  
> *Deployment Tx*: [`0x6e790cc87d0000db89a44da37af923363ef72fadb78a520a6978b8a83e2260ad`](https://scan.bohr.life/tx/0x6e790cc87d0000db89a44da37af923363ef72fadb78a520a6978b8a83e2260ad)  
> *Repository*: [https://github.com/liljhnxn/luckynumber](https://github.com/liljhnxn/luckynumber)  

---

# PART 1: 📊 PITCH DECK (Slide-by-Slide)

### Slide 1: Title & Vision
* **Title**: **LuckyNumber**
* **Tagline**: Anchor Your Number. Claim Your Digital Identity.
* **Mission**: Providing a lightweight, composable, and 100% decentralized identity primitive where Web3 users select, verify, and broadcast their signature lucky number directly on Botchain.
* **Network**: Built natively for **Botchain Testnet** (High-performance, EVM-compatible decentralized architecture).

---

### Slide 2: The Problem
1. **Impersonal Web3 Wallet Interactions**: Crypto wallet addresses (`0x...`) are cryptic, cold 42-character hex hashes that convey zero personal sentiment, culture, or social identity.
2. **Centralized Profile Dependencies**: Existing social profile layers in Web2 and centralized Web3 platforms rely on off-chain relational databases, proprietary cloud servers, or third-party storage prone to data loss and single points of failure.
3. **Bloated & Costly On-Chain Solutions**: Many decentralized identity or profile solutions impose heavy gas overheads, complex token gates, or multi-contract systems unsuitable for everyday users.

---

### Slide 3: The Solution — LuckyNumber
* **100% On-Chain Persistence**: Users anchor their chosen number (strictly validated between `1` and `100`) directly into an EVM storage mapping.
* **Public & Open Lookup**: Anyone in the world can inspect any wallet address to read its lucky number without needing a connected wallet or paying gas fees.
* **Ultra-Low Gas Execution**: Direct $O(1)$ constant-time lookup and storage operations with custom Solidity errors for minimal gas footprint.
* **Zero Backend Infrastructure**: Smart contract is the single source of truth; zero proprietary servers, zero Web2 APIs, and zero tracking.

---

### Slide 4: User Journey & Product Features
1. **Connect**: Seamless Web3 onboarding (MetaMask, Rabby, OKX, Coinbase Wallet, etc.) with automated network switching to Botchain (Chain ID `968`).
2. **Select & Preview**: Interactive slider, increment/decrement stepper, and quick-pick presets (e.g., 7, 13, 21, 77, 99) with real-time glowing badge preview.
3. **Store On-Chain**: Send a 1-click transaction to `setNumber(n)`; track transaction lifecycle from signing to BohrScan confirmation.
4. **Public Query & Discovery**: Enter any wallet address or click the 1-click "Query Connected" shortcut to inspect saved lucky numbers.

---

### Slide 5: Market Opportunity & Web3 Social Identity
* **Cultural Numerology & Gaming**: In global gaming, sports, crypto communities, and lottery mechanics, numbers carry strong personal resonance and affinity.
* **Composable Identity Primitive**: Games, lotteries, and decentralized apps on Botchain can read `getNumber(address)` to seed random rewards, match players, or grant special perks based on a user’s lucky number.
* **On-Chain Micro-Transactions**: Drives organic on-chain transaction volume and wallet activity on Botchain with accessible, consumer-friendly gas fees.

---

### Slide 6: Technical Architecture
* **Contract**: Solidity `^0.8.20`, Hardhat test suite with 100% test coverage.
* **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS with custom dark navy glassmorphic aesthetic (`#070a13`).
* **Web3 Integration**: Wagmi v2 + Viem + TanStack React Query for reactive contract reads and optimistic state updates.
* **Network Anchor**: Botchain Testnet (Chain ID `968`), RPC `https://rpc.bohr.life`.

---

### Slide 7: Competitive Matrix
| Feature | LuckyNumber | Centralized Web2 Profiles | Heavy NFT Identity (e.g. ENS / Soulbound) |
| :--- | :---: | :---: | :---: |
| **Storage Layer** | **100% On-Chain EVM** | Centralized SQL / Cloud | Mixed On-Chain / IPFS metadata |
| **Backend Dependency** | **Zero (Client-to-Chain)** | Heavy Server / API stack | Medium (Resolvers, Indexers) |
| **Gas Cost** | **Ultra-Low (~25k-45k gas)** | Free (Monetizes user data) | High minting/renewal costs |
| **Permissionless Reads**| **Yes (Zero wallet needed)** | No (API limits, Auth required) | Yes |
| **Interoperability** | **Instant Solidity ABI read** | Closed proprietary silos | Requires complex resolver interfaces |

---

### Slide 8: Roadmap & Ecosystem Expansion
* **Phase 1 (Completed)**: Core smart contract deployment, BohrScan verification, responsive Next.js 16 dApp, and 100% unit test coverage.
* **Phase 2 (Current)**: Community onboarding on Botchain Testnet, public search indexing, and real-time event notifications.
* **Phase 3 (Next)**:
  * **Lucky Number Duels & Mini-Games**: On-chain provably fair lottery/dice duels based on stored lucky numbers.
  * **Botchain Ecosystem SDK**: NPM package allowing third-party Botchain games to query `LuckyNumber` in 1 line of code.
  * **Mainnet Rollout**: Gas-optimized deployment on Botchain Mainnet.

---

# PART 2: 📄 TECHNICAL WHITEPAPER

## 1. Abstract
LuckyNumber is a decentralized, immutable identity attribute protocol deployed on the Botchain Testnet. By mapping cryptographic wallet addresses directly to a bounded integer domain ($n \in [1, 100]$), LuckyNumber provides a tamper-proof social primitive for EVM environments. Built without external dependencies or centralized backend servers, the protocol exposes constant-time $O(1)$ read/write endpoints, strict mathematical invariant assertions, and real-time EVM event emission, serving as a composable building block for on-chain games, lotteries, and decentralized community mechanics.

---

## 2. Problem Statement & Motivation
Public addresses in decentralized networks are 160-bit cryptographic hashes represented as 42-character hexadecimal strings. While cryptographically sound for value transfer and signature validation, they present significant UX barriers:
1. **Lack of Human Emotional Connection**: Addresses are indistinguishable and offer no personalized context.
2. **Fragility of Off-Chain Profile Layers**: Traditional Web3 social platforms store user metadata on off-chain centralized databases (e.g., Supabase, PostgreSQL, AWS S3). If the server goes down, the identity layer collapses.
3. **Execution Overhead in Traditional Identity Protocols**: Complex identity protocols involve multi-token standards (ERC-721, ERC-1155) or nested registry resolvers that incur significant storage gas and deployment costs.

LuckyNumber solves this by implementing an ultra-lean, single-contract protocol where personal digital identity attributes are stored natively in EVM contract storage slots at minimal gas costs.

---

## 3. Protocol Architecture

```
+-----------------------------------------------------------------------+
|                            USER BROWSER                               |
|   +---------------------+             +---------------------------+   |
|   |   Wagmi v2 Client   |             |   Viem Read/Write Calls   |   |
|   +----------+----------+             +-------------+-------------+   |
+--------------|--------------------------------------|-----------------+
               |                                      |
               | (EIP-1193 JSON-RPC)                  | (JSON-RPC)
               v                                      v
+-----------------------------------------------------------------------+
|                    BOTCHAIN TESTNET (CHAIN ID: 968)                   |
|                        RPC: https://rpc.bohr.life                     |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |         LuckyNumber Smart Contract (0x3AdD...076e)            |   |
|   |                                                               |   |
|   |   State Variables:                                            |   |
|   |     mapping(address => uint256) private _numbers              |   |
|   |     mapping(address => bool)    private _hasNumber            |   |
|   |                                                               |   |
|   |   Functions:                                                  |   |
|   |     - setNumber(uint256 number) external                      |   |
|   |     - getNumber(address user) external view returns (uint256) |   |
|   |     - hasNumber(address user) external view returns (bool)    |   |
|   |                                                               |   |
|   |   Events:                                                     |   |
|   |     - NumberUpdated(address indexed user, uint256 number)     |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

---

## 4. Smart Contract Specification

The core contract (`LuckyNumber.sol`) is compiled under Solidity `^0.8.20`.

### 4.1 State Storage Model
* `mapping(address => uint256) private _numbers`: Stores the selected integer corresponding to the user's account address.
* `mapping(address => bool) private _hasNumber`: Explicit tracking flag that prevents ambiguity between an unset number and the default EVM integer zero value.

### 4.2 Mathematical Invariants & Boundary Enforcements
The protocol strictly restricts input to valid ranges:
$$\forall x \in \mathbb{N}, \quad 1 \le x \le 100$$

Attempting to supply $x = 0$ or $x > 100$ triggers a custom revert:
```solidity
error InvalidNumber(uint256 number);

function setNumber(uint256 number) external {
    if (number < 1 || number > 100) {
        revert InvalidNumber(number);
    }
    _numbers[msg.sender] = number;
    _hasNumber[msg.sender] = true;

    emit NumberUpdated(msg.sender, number);
}
```

### 4.3 Gas Optimization & Security Properties
1. **Custom Errors**: Utilizes `error InvalidNumber(uint256)` instead of string error messages (`require(..., "Invalid number")`), saving ~50 gas per execution failure by passing a 4-byte selector instead of full string memory chunks.
2. **Reentrancy Immunity**: Functions perform state mutations solely on internal mappings without external message calls or ETH/native token transfers, guaranteeing complete immunity to reentrancy attacks.
3. **Indexed Event Logging**: Emits `event NumberUpdated(address indexed user, uint256 number)` allowing external indexers, subgraphs, and frontend event listeners to stream number selections via topic-filtered RPC subscriptions.
4. **Zero Administrative Privilege**: The contract contains no `owner`, `onlyOwner` modifiers, self-destruct routines, or upgradeable proxy proxies. It is fully immutable and censorship-resistant.

---

## 5. Frontend & Client Architecture

The frontend is built using **Next.js 16 (App Router)** and **TypeScript**:

1. **State Hydration**: Uses `@tanstack/react-query` combined with `wagmi` hooks (`useReadContract`, `useWriteContract`, `useWaitForTransactionReceipt`) to achieve instantaneous client-side updates.
2. **Zero-Wallet Public Lookups**: Contract read methods (`getNumber`, `hasNumber`) execute through public RPC calls via Viem, allowing unauthenticated visitors to query any wallet address instantly.
3. **Graceful Network Handling**: Enforces execution exclusively on Botchain Testnet (`ChainId: 968`), displaying a reactive network banner with 1-click network addition and switching capabilities.
4. **Design System**: Built with modern CSS and Tailwind CSS using a curated dark navy background (`#070a13`), electric indigo accents (`#6366f1`), glowing glassmorphic cards, and micro-animations for an engaging user experience.

---

## 6. Live Deployment & Verification

* **Network**: Botchain Testnet
* **Chain ID**: `968`
* **RPC Endpoint**: `https://rpc.bohr.life`
* **Currency Symbol**: `BOT`
* **Contract Address**: [`0x3AdD26Fa7A69e01d94cA4c5473a8DfEC1A84076e`](https://scan.bohr.life/address/0x3AdD26Fa7A69e01d94cA4c5473a8DfEC1A84076e#code)
* **Contract Verification**: Bytecode and ABI verified directly on BohrScan.
* **Deployment Transaction**: [`0x6e790cc87d0000db89a44da37af923363ef72fadb78a520a6978b8a83e2260ad`](https://scan.bohr.life/tx/0x6e790cc87d0000db89a44da37af923363ef72fadb78a520a6978b8a83e2260ad)

---

## 7. Conclusion
LuckyNumber demonstrates that on-chain identity primitives can be elegant, gas-efficient, and mathematically robust. By removing all centralized backend points of failure and providing transparent, verified contracts on Botchain Testnet, LuckyNumber offers a delightful and reliable social primitive for the expanding Botchain ecosystem.
