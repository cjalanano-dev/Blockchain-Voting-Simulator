import { useBlockchain } from '../context/BlockchainContext'
import { useState } from 'react'

export default function PendingVotes() {
  const { pendingVotes, mineBlock, mining, difficulty } = useBlockchain()
  const [lastHash, setLastHash] = useState(null)

  async function handleMine() {
    const block = await mineBlock()
    if (block) setLastHash(block.hash)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-2 pr-1 custom-scroll">
        {pendingVotes.length === 0 && (
          <p className="text-sm text-neutral-500">No votes waiting. Cast some above.</p>
        )}
        {pendingVotes.map(v => (
          <div key={v.id} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs flex justify-between items-center">
            <span className="font-mono text-neutral-600">{v.id.slice(0,8)}</span>
            <span className="font-medium text-neutral-800">{v.candidate}</span>
            <span className="text-neutral-400">{new Date(v.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
  <div className="pt-4 mt-4 border-t border-neutral-200">
        <button
          onClick={handleMine}
          disabled={pendingVotes.length === 0 || mining}
          className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 disabled:from-neutral-400 disabled:to-neutral-500 disabled:cursor-not-allowed text-white px-4 py-2.5 text-sm font-semibold shadow hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition-colors"
        >
          {mining ? 'Mining…' : `Mine Block (Diff ${difficulty})`}
        </button>
        {lastHash && !mining && (
          <div className="mt-3 text-[10px] font-mono break-all text-neutral-500">
            New block hash: {lastHash}
          </div>
        )}
      </div>
    </div>
  )
}
