# SafeCast – Decentralized, Private, and Resilient Information Broadcast Tool

## Concept
A Web3-powered broadcast system for activists to share messages, updates, or warnings securely — resistant to censorship and metadata tracking.

## Why It Fits Both Tracks

### Privacy Infrastructure
Messages are relayed via Waku or Tor-mixnet nodes with encrypted payloads.

### Activist Resilience
Works even if traditional web access is blocked; messages stored on IPFS or Arweave with content hash anchors on Ethereum.

### Technical Stack
- Waku (for encrypted peer-to-peer message relaying)
- Tor for private RPC + message submission
- Ethereum contract anchoring message hashes for authenticity
- Optional incentive model using tokenized relayers (private RPC or Waku nodes)

### Judging Strength
- **Resilience:** Works offline-first + censorship-resistant
- **Privacy:** No message traceability
- **Usability:** Telegram-like minimal UI for community broadcast

## Deliverables
- P2P broadcast demo (frontend + Waku integration)
- Smart contract verifying message integrity
- Docs: threat model + demo video simulating restricted network conditions

## ⚙️ Required Technologies
- Tor (SOCKS5, onion services, or Brume integration)
- Explore using Waku for messaging and Nimbus Execution Client for private RPC use cases (check out the Waku Cheatsheet)
- Ethereum/Web3 stack (wallets, smart contracts, RPCs)
- (Optional) Mixnets, PIR, or ZK proofs for advanced privacy
- (Optional) Frontend frameworks (React/Next.js) for demos
