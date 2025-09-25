import { useState } from 'react'
import { useBlockchain } from '../context/BlockchainContext'

// Modernized Voting Panel with candidate tiles & refined editing UX

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
    const parts = candidateInput.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
    if (parts.length && updateCandidates(parts)) {
      setSelected(parts[0])
      setEditing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-sm font-semibold tracking-wide text-neutral-600 uppercase">Select Candidate</h3>
        <div className="flex gap-2">
          <button
            onClick={castVote}
            disabled={!wallet || !sessionActive}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white px-5 py-2 text-sm font-medium shadow-sm hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            Cast Vote
          </button>
          <button
            onClick={() => setEditing(e => !e)}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:border-blue-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {editing ? 'Close Editor' : 'Edit Candidates'}
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {candidates.map(c => {
          const active = c === selected
          return (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className={`group relative overflow-hidden rounded-xl border text-left px-4 py-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${active ? 'border-transparent bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-400 text-white shadow' : 'border-neutral-300 bg-white hover:border-blue-400/60 hover:shadow-sm'}`}
            >
              <span className="block font-semibold tracking-wide text-sm leading-tight pr-6">{c}</span>
              <span className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ring-2 ring-white transition ${active ? 'bg-emerald-400 scale-110' : 'bg-neutral-300 group-hover:bg-blue-400'}`}/>
              {active && (
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-white/30 backdrop-blur-sm" />
              )}
            </button>
          )
        })}
      </div>

      {editing && (
        <div className="rounded-lg border border-neutral-200 bg-white/70 backdrop-blur-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Edit Candidates</h4>
            <span className="text-[11px] text-neutral-400">Comma or line separated</span>
          </div>
          <textarea
            value={candidateInput}
            onChange={e => setCandidateInput(e.target.value)}
            rows={4}
            className="w-full text-sm rounded-md border border-neutral-300 bg-white p-2 font-mono leading-snug focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 resize-none"
            placeholder="Alice,Bob,Charlie"
          />
          <div className="flex flex-wrap gap-2 justify-end">
            <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400">Cancel</button>
            <button onClick={saveCandidates} className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Save</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center text-xs">
        <span className="text-neutral-500">Pending votes: <span className="font-semibold text-neutral-700">{pendingVotes.length}</span></span>
        {!wallet && <span className="text-amber-600 font-medium">Connect a wallet to vote.</span>}
        {!sessionActive && <span className="text-red-600 font-medium">Session ended. Restart to continue.</span>}
      </div>
      {feedback && (
        <div className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2 inline-flex items-center shadow-sm">
          {feedback}
        </div>
      )}
    </div>
  )
}
