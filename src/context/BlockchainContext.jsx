import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { Block, createGenesisBlock, makeVote, validateVote, isChainValid, calculateTally } from '../utils/blockchain'

const BlockchainContext = createContext(null)

export function BlockchainProvider({ children }) {
  const [blockchain, setBlockchain] = useState(() => [createGenesisBlock()])
  const [pendingVotes, setPendingVotes] = useState([])
  const [mining, setMining] = useState(false)
  const [difficulty] = useState(2) // could expose to UI later

  const addVote = useCallback((candidate, voterId) => {
    const vote = makeVote(voterId || `anon-${Math.random().toString(36).slice(2,8)}`, candidate)
    if (!validateVote(vote)) return false
    setPendingVotes(v => [...v, vote])
    return true
  }, [])

  const mineBlock = useCallback(async () => {
    if (pendingVotes.length === 0 || mining) return null
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
  }, [pendingVotes, mining, blockchain, difficulty])

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
  }

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>
}

export function useBlockchain() {
  const ctx = useContext(BlockchainContext)
  if (!ctx) throw new Error('useBlockchain must be used within BlockchainProvider')
  return ctx
}
