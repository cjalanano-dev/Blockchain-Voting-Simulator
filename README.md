<div align="center">
	<h1>🗳️ Blockchain Voting Simulator</h1>
	<p><strong>Interactive educational sandbox</strong> demonstrating a simplified proof‑of‑work blockchain that records votes, with mining, chain validation, live tallies, and exportable ledger snapshots.</p>
	<img alt="preview" src="public/favicon.svg" height="64" />
</div>

## Table of Contents
1. Overview
2. Feature Set
3. Tech Stack
4. Quick Start
5. Core Concepts & Architecture
6. Data Model
7. Mining & Difficulty
8. State Persistence & Session Lifecycle
9. Wallet Simulation
10. Export Format
11. Theming & UI/UX Notes
12. Extending the Simulator
13. Security Notes
14. Educational Use Disclaimer
15. License

---

## 1. Overview
This project is an educational front‑end simulation of how a blockchain *could* structure immutable vote records. It is **not** a secure, production voting platform—rather a teaching tool to visualize blocks, hashing, proof‑of‑work cost, and tally derivation.

## 2. Feature Set
- Candidate vote casting (wallet‑gated)
- Pending vote pool → mined into blocks
- Simplified Proof‑of‑Work mining (adjustable in code; default difficulty=2)
- Block hash & previous hash linkage (integrity visualization)
- Live chain validity check
- Real‑time tally & results bar chart
- Dynamic candidate list editing
- Session control (end / restart)
- Wallet simulation (random pseudo address)
- Persistent state (localStorage): chain, pending votes, candidates, wallet, session
- JSON export of full ledger snapshot + tally
- Micro‑interactions & animations (Framer Motion)
- Dark / light theme with no‑flash hydration script

## 3. Tech Stack
| Layer | Tech |
|-------|------|
| Build/System | Vite (React) |
| UI | React 18+, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Hashing | crypto-js (SHA256) |
| State | React Context (BlockchainProvider) |
| Storage | localStorage (JSON serialization) |

## 4. Quick Start
```bash
# Install dependencies
npm install

# Run dev server (default http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production bundle
npm run preview
```

## 5. Core Concepts & Architecture
```
src/
	utils/blockchain.js     <- Block class + hashing + tally + validation
	context/BlockchainContext.jsx <- Global state & persistence
	components/             <- UI building blocks (Voting, Pending, Ledger, Results)
```
### Data Flow
1. User connects a simulated wallet → context stores wallet address.
2. User selects candidate → casts vote → vote enters `pendingVotes` pool.
3. Mining creates a new Block from all pending votes: hashes, PoW loop until hash starts with N zeroes.
4. Block appended to chain; pending pool cleared; tally recalculated from all non‑genesis blocks.
5. UI re-renders ledger cards + charts + session stats.

### Why Context over Redux?
State surface is small, highly localized, and mostly read‑heavy: Context + memoization keeps complexity low.

## 6. Data Model
### Vote Object
```ts
{
	id: string;        // uuid-like random string
	candidate: string; // candidate label
	timestamp: number; // ms epoch
	voter: string;     // wallet address used (simulated)
}
```
### Block Object (runtime)
```ts
{
	index: number;
	timestamp: number;
	votes: Vote[];
	previousHash: string;
	nonce: number;
	hash: string; // SHA256(index + timestamp + JSON(votes) + previousHash + nonce)
}
```
Genesis block: index 0, empty votes, previousHash = '0'.

## 7. Mining & Difficulty
Proof‑of‑Work loop increments `nonce` until `hash.startsWith('0'.repeat(difficulty))`.
Default difficulty = 2 for responsiveness in the browser; increase to observe exponential slowdown.

## 8. State Persistence & Session Lifecycle
Persisted keys (single JSON blob under `bvs_state_v1`):
```jsonc
{
	"blockchain": Block[],
	"pendingVotes": Vote[],
	"candidates": string[],
	"wallet": { "address": string } | null,
	"sessionActive": boolean
}
```
Reset (restart session) rebuilds chain with only genesis + clears pending.
End Session locks voting & mining but preserves data for inspection/export.

## 9. Wallet Simulation
Generates a pseudo 20‑byte hex address using `crypto.getRandomValues`. Not connected to any chain/provider; purely illustrative.

## 10. Export Format
The “Download Ledger JSON” button produces a snapshot:
```jsonc
{
	"exportedAt": "2025-09-25T12:34:56.789Z",
	"network": "simulation",
	"difficulty": 2,
	"sessionActive": true,
	"candidates": ["Alice","Bob","Charlie"],
	"chainLength": 5,
	"blocks": [ { /* Block objects */ } ],
	"pendingVotes": [ /* Vote objects */ ],
	"tally": { "Alice": 7, "Bob": 4 }
}
```
You can re‑import manually (developer tools) or just archive it for lessons.

## 11. Theming & UI/UX Notes
- Dark mode class applied to `<html>` early to prevent flash.
- Framer Motion for block entrance, candidate hover, pending vote transitions.
- Hash highlight animation on last mined block (CSS keyframe pulse).

## 12. Extending the Simulator
Ideas:
- Adjustable difficulty slider (throttle to avoid main‑thread jank).
- Real signature simulation (ECDSA via noble-secp256k1) to sign votes.
- Merkle root calculation per block.
- Fork / invalid block injection teaching mode.
- REST or WebSocket replication between multiple browser tabs.
- Time‑to‑mine statistics graph.

## 13. Security Notes
This project intentionally omits critical security / correctness features:
- No Sybil resistance or identity verification.
- No cryptographic signatures on votes—integrity assumes trusted client.
- Mining & validation performed entirely client‑side (modifiable by user).
- Difficulty trivial; hashes can be regenerated rapidly for manipulation demos.
- Persistence uses localStorage (tamperable). Never rely on this for real data integrity.
- No protection against replay / duplicate vote injection beyond simplistic structure.

If adapting for any higher‑stakes scenario, you must add: authenticated identities, signed payloads, server‑side consensus, audit logging, and tamper‑evident storage.

## 14. Educational Use Disclaimer
This software is provided **solely for learning purposes**. It does **not** implement secure, production‑grade electronic voting. Do *not* deploy or market this simulator as a trustworthy voting platform. The authors and contributors disclaim all liability for misuse or misrepresentation of its capabilities.

## 15. License
MIT (feel free to reuse with attribution). If you extend it for workshops or curricula, a backlink is appreciated.

---

### Attribution / Credits
Built with the React + Vite + Tailwind toolchain. Hashing powered by `crypto-js`. Animations via `framer-motion`.

---

### Quick Troubleshooting
| Issue | Fix |
|-------|-----|
| Mining seems instant | Increase difficulty in `BlockchainContext` or `blockchain.js`. |
| Chain marked invalid | A block hash no longer matches its stored data—try restarting session. |
| Export file empty | Ensure there is at least the genesis block; browser may block download in some sandboxed iframes. |
| Dark mode flicker | Confirm the inline theme script is still in `index.html`. |

---

Happy experimenting! 🧪
