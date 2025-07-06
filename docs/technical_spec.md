#  technical_spec.md

##  Overview

EnerLink is a decentralized internet access system built to enable dynamic ISP switching and unified blockchain-based billing. It allows users to automatically connect to the most performant local network while recording bandwidth usage on-chain for transparent, tokenized payments.

The project uses a modular, multi-layered design that integrates Solana smart contracts, decentralized frontend infrastructure, eSIM logic, and backend APIs connected to simulated telecom data.

---

##  Architecture Layers

| Layer         | Function                                      | Technologies                        |
|---------------|-----------------------------------------------|-------------------------------------|
| Frontend      | User interface + wallet connection            | React (Next.js), Tailwind, Ethers.js |
| Backend       | Switching engine, metrics, API bridge         | NestJS, REST APIs                   |
| Blockchain    | Tokenized billing, usage tracking             | Solana, Anchor Framework            |
| Infra Layer   | UI hosting, DNS, wallet identity              | IPFS, ENS, WalletConnect            |
| Bots          | Monitoring + switch fallback logic            | Node-based scripts                  |

---

##  Smart Contracts

Built using Anchor (Solana), the contracts handle:

- Bandwidth token accounting
- Pay-per-KB payment deduction
- Onchain metadata for usage logs
- Access control for switching rights

The core program tracks user session start/end, logs bytes used, and updates billing balances on-chain.

---

##  Switching Engine (Bots)

The backend integrates bot logic that:

- Monitors active network performance (MTN, Airtel)
- Switches to best network based on latency/signal strength
- Logs session data to Solana via the contract
- Performs fallback switching if outages occur

For testing, network metrics are simulated with mock speedtest APIs.

---

##  Payment System

- Users make a single wallet payment on Solana devnet
- Smart contracts deduct bandwidth as data is consumed (per KB)
- Real-time feedback updates the UI token balance

This creates a unified, programmable billing layer across multiple ISPs.

---

##  ISP API Simulation

- Airtel/MTN sandboxes not yet public → simulated with custom speedtest-based backend APIs
- Includes endpoints for:
  - Network latency
  - Packet loss
  - Signal health

These APIs power the switching bot decisions and on-screen visual feedback.

---

##  Dev Tooling

| Purpose               | Tools                            |
|-----------------------|----------------------------------|
| Smart Contract Dev    | Solana CLI, Anchor, Rust         |
| Backend Dev           | NestJS, Postman                  |
| Frontend Dev          | React, Wagmi, WalletConnect      |
| Hosting               | IPFS via Web3.Storage            |
| Identity & Domains    | ENS: enerlinklab.eth             |
| Monitoring            | Manual logs, Tenderly (future)   |

---

##  Testnet Deployment Plan

- All smart contracts deployed to Solana devnet
- IPFS-hosted frontend available via `enerlinklab.eth`
- Simulated ISP switching using fake latency profiles
- Real-time UI updates for:
  - Token balance
  - Active network
  - Switch alerts

---

##  Notes

- Architecture is fully modular — additional ISPs or networks can be added via plugin logic
- Compatible with Layer 2 (Base, Polygon) in the future via adapters
- Backend-to-contract bridge secured using rate limits + auth tokens

---

##  Contact

Questions or collaborations: creedtechgroup@gmail.com  
ENS: `enerlinklab.eth`

---
