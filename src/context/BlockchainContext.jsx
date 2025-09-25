import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { Block, createGenesisBlock, makeVote, validateVote, isChainValid, calculateTally } from '../utils/blockchain'

const BlockchainContext = createContext(null)

const STORAGE_KEY = 'bvs_state_v1'

export function BlockchainProvider({ children }) {
  const [blockchain, setBlockchain] = useState(() => [createGenesisBlock()])
  const [pendingVotes, setPendingVotes] = useState([])
  const [mining, setMining] = useState(false)
  const [difficulty] = useState(2) // could expose to UI later
  const [candidates, setCandidates] = useState(['Alice', 'Bob', 'Charlie'])
  const [wallet, setWallet] = useState(null) // {address}
  const [sessionActive, setSessionActive] = useState(true)

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.blockchain && Array.isArray(parsed.blockchain)) {
          // Rehydrate blocks minimally (Block class with existing values)
          const restored = parsed.blockchain.map(b => Object.assign(new Block(b.index, b.timestamp, b.votes, b.previousHash), { nonce: b.nonce, hash: b.hash }))
          if (restored.length) setBlockchain(restored)
        }
        if (parsed.pendingVotes) setPendingVotes(parsed.pendingVotes)
        if (parsed.candidates) setCandidates(parsed.candidates)
        if (parsed.wallet) setWallet(parsed.wallet)
        if (typeof parsed.sessionActive === 'boolean') setSessionActive(parsed.sessionActive)
      }
    } catch (e) {
      console.warn('Failed to load persisted state', e)
    }
  }, [])

  // Persist state
  useEffect(() => {
    const payload = JSON.stringify({
      blockchain,
      pendingVotes,
      candidates,
      wallet,
      sessionActive,
    })
    localStorage.setItem(STORAGE_KEY, payload)
  }, [blockchain, pendingVotes, candidates, wallet, sessionActive])

  const addVote = useCallback((candidate, voterId) => {
    if (!sessionActive) return false
    if (!wallet) return false
    if (!candidates.includes(candidate)) return false
    const vote = makeVote(voterId || wallet.address, candidate)
    if (!validateVote(vote)) return false
    setPendingVotes(v => [...v, vote])
    return true
  }, [wallet, sessionActive, candidates])

  const mineBlock = useCallback(async () => {
    if (pendingVotes.length === 0 || mining || !sessionActive) return null
    setMining(true)
    try {
      const prev = blockchain[blockchain.length - 1]
      const newBlock = new Block(blockchain.length, Date.now(), pendingVotes, prev.hash)
      // Mining (synchronous CPU). In real UI we might offload; here it's fine.
      newBlock.mineBlock(difficulty)
      setBlockchain(chain => [...chain, newBlock])
      setPendingVotes([])
      return newBlock
    } finally {
      setMining(false)
    }
  }, [pendingVotes, mining, blockchain, difficulty, sessionActive])

  const connectWallet = useCallback(() => {
    const addr = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2,'0')).join('')
    setWallet({ address: addr })
    return addr
  }, [])

  const disconnectWallet = useCallback(() => {
    setWallet(null)
  }, [])

  const updateCandidates = useCallback((list) => {
    if (!Array.isArray(list) || list.length === 0) return false
    const cleaned = list.map(c => String(c).trim()).filter(Boolean)
    if (cleaned.length === 0) return false
    setCandidates(cleaned)
    return true
  }, [])

  const endSession = useCallback(() => {
    setSessionActive(false)
  }, [])

  const resetSession = useCallback(() => {
    setBlockchain([createGenesisBlock()])
    setPendingVotes([])
    setSessionActive(true)
  }, [])

  const tally = useMemo(() => calculateTally(blockchain.slice(1)), [blockchain])
  const chainValid = useMemo(() => isChainValid(blockchain), [blockchain])

  const value = {
    blockchain,
    pendingVotes,
    addVote,
    mineBlock,
    mining,
    tally,
    chainValid,
    difficulty,
    wallet,
    connectWallet,
    disconnectWallet,
    candidates,
    updateCandidates,
    sessionActive,
    endSession,
    resetSession,
  }

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>
}

export function useBlockchain() {
  const ctx = useContext(BlockchainContext)
  if (!ctx) throw new Error('useBlockchain must be used within BlockchainProvider')
  return ctx
}
