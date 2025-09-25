import { useState } from 'react'
import { useBlockchain } from '../context/BlockchainContext'

const CANDIDATES = ['Alice', 'Bob', 'Charlie']

export default function VotingPanel() {
  const { addVote, pendingVotes } = useBlockchain()
  const [selected, setSelected] = useState(CANDIDATES[0])
  const [feedback, setFeedback] = useState(null)

  function castVote() {
    const ok = addVote(selected)
    setFeedback(ok ? `Vote for ${selected} added to pending pool.` : 'Failed to add vote.')
    if (ok) setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        {CANDIDATES.map(c => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${selected === c ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white border-transparent shadow' : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-blue-400/60'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <button
        onClick={castVote}
        className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 text-sm font-semibold shadow hover:from-blue-500 hover:to-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cast Vote
      </button>
      <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Pending votes: {pendingVotes.length}</div>
      {feedback && <div className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{feedback}</div>}
    </div>
  )
}
