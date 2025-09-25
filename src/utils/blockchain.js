import CryptoJS from 'crypto-js'

// Vote shape: { id: string, voterId: string, candidate: string, timestamp: number }

export class Block {
  constructor(index, timestamp, votes, previousHash = '0') {
    this.index = index
    this.timestamp = timestamp
    this.votes = votes // array of vote objects
    this.previousHash = previousHash
    this.nonce = 0
    this.hash = this.calculateHash()
  }

  calculateHash() {
    return CryptoJS.SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.votes) +
        this.nonce
    ).toString()
  }

  // Simple proof-of-work so user can see hash changing (difficulty = number of leading zeros)
  mineBlock(difficulty = 2, onProgress) {
    const target = '0'.repeat(difficulty)
    while (!this.hash.startsWith(target)) {
      this.nonce++
      this.hash = this.calculateHash()
      if (onProgress && this.nonce % 500 === 0) onProgress(this.nonce, this.hash)
    }
    return this.hash
  }
}

export function createGenesisBlock() {
  return new Block(0, Date.now(), [], '0'.repeat(64))
}

export function validateVote(vote) {
  if (!vote) return false
  const { voterId, candidate, timestamp, id } = vote
  if (!id || typeof id !== 'string') return false
  if (!voterId || typeof voterId !== 'string') return false
  if (!candidate || typeof candidate !== 'string') return false
  if (typeof timestamp !== 'number') return false
  return true
}

export function calculateTally(blockchain) {
  const tally = {}
  blockchain.forEach(block => {
    block.votes.forEach(v => {
      tally[v.candidate] = (tally[v.candidate] || 0) + 1
    })
  })
  return tally
}

export function isChainValid(chain) {
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i]
    const prev = chain[i - 1]
    if (current.previousHash !== prev.hash) return false
    if (current.calculateHash() !== current.hash) return false
  }
  return true
}

export function makeVote(voterId, candidate) {
  return {
    id: crypto.randomUUID(),
    voterId,
    candidate,
    timestamp: Date.now(),
  }
}
