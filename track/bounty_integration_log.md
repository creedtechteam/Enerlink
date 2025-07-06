#  Bounty Integration Log

This file documents how EnerLink integrates with blockchain tools, APIs, and SDKs across multiple layers.

---

##  Solana Integration

- **Smart Contracts:** EnerLink uses custom Solana programs written in Anchor to handle:
  - Pay-per-KB tokenized bandwidth billing
  - Data usage recording
  - Reversal triggers for fallback logic

- **RPC Calls:** Used to fetch and update wallet balances during real-time billing.

- **Devnet Deployment:** Smart contracts are deployed and tested on Solana Devnet.

---

##  ISP Sandbox API Integration

- **MTN + Airtel APIs:** Backend connects to available telecom sandbox endpoints to:
  - Check network availability
  - Simulate signal strength
  - Perform mock data session initiation and termination

- **Backend Logic:** Uses NestJS to fetch signal metrics and trigger the switching logic via custom bots.

---

##  ENS + IPFS Integration

- **ENS Name:** `enerlinklab.eth` points to the DApp for censorship-resistant access.

- **Frontend Hosting:** App is deployed on IPFS via Web3.Storage with immutable content hash.

---

##  Wallet Integration

- **WalletConnect + Solana Wallet Adapter:** Enables login and pay-per-KB transactions.

- **Token Balance:** Updated dynamically on frontend post-payment.

---

##  Notes

- All integrations are live-tested and available in the GitHub commit history.
- For visual flow, refer to `architecture_diagram.png`.
  
