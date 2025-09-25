import { useState } from 'react'
import { useBlockchain } from '../context/BlockchainContext'

export default function VotingPanel() {
  const { addVote, pendingVotes, candidates, wallet, updateCandidates, sessionActive } = useBlockchain()
  const [selected, setSelected] = useState(() => candidates[0])
  const [feedback, setFeedback] = useState(null)
  const [editing, setEditing] = useState(false)
  const [candidateInput, setCandidateInput] = useState(() => candidates.join(','))

  function castVote() {
    const ok = addVote(selected)
    setFeedback(ok ? `Vote for ${selected} added to pending pool.` : 'Action not allowed (connect wallet & active session).')
    if (ok) setTimeout(() => setFeedback(null), 2500)
  }

  function saveCandidates() {
    const parts = candidateInput.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
    if (updateCandidates(parts)) {
      setSelected(parts[0])
      setEditing(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        {candidates.map(c => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${selected === c ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white border-transparent shadow' : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-blue-400/60'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <button
          onClick={castVote}
          disabled={!wallet || !sessionActive}
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 disabled:from-neutral-400 disabled:to-neutral-500 text-white px-5 py-2.5 text-sm font-semibold shadow hover:from-blue-500 hover:to-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Cast Vote
        </button>
        <button
          onClick={() => setEditing(e => !e)}
          className="inline-flex items-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 px-4 py-2 text-sm font-medium hover:border-blue-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          {editing ? 'Cancel' : 'Edit Candidates'}
        </button>
      </div>
      {editing && (
        <div className="space-y-2 mb-4 w-full max-w-lg">
          <textarea
            value={candidateInput}
            onChange={e => setCandidateInput(e.target.value)}
            rows={3}
            className="w-full text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 resize-none"
            placeholder="One,Two,Three"
          />
          <div className="flex gap-2">
            <button onClick={saveCandidates} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60">Save</button>
            <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-neutral-500">Close</button>
          </div>
        </div>
      )}
      <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Pending votes: {pendingVotes.length}</div>
      {!wallet && <div className="mt-3 text-xs text-amber-600 dark:text-amber-400">Connect a wallet to vote.</div>}
      {!sessionActive && <div className="mt-3 text-xs text-red-600 dark:text-red-400">Session ended. Restart to continue.</div>}
      {feedback && <div className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{feedback}</div>}
    </div>
  )
}
