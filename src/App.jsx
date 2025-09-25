import Navbar from './components/Navbar'
import VotingPanel from './components/VotingPanel'
import './index.css'
import PendingVotes from './components/PendingVotes'
import BlockchainLedger from './components/BlockchainLedger'
import ResultsChart from './components/ResultsChart'
import { useBlockchain } from './context/BlockchainContext'
import { motion } from 'framer-motion'

export default function App() {
  const { blockchain, pendingVotes, tally, wallet, sessionActive, exportLedger } = useBlockchain()
  const minedBlocks = blockchain.length - 1
  const totalVotesMined = Object.values(tally).reduce((a,b) => a + b, 0)
  const leading = Object.entries(tally).sort((a,b) => b[1]-a[1])[0]
  return (
  <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors">
      <Navbar />
    <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
  <section className="rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Voting Panel</h2>
          <VotingPanel />
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-4 sm:p-5 flex flex-col">
            <h2 className="font-semibold mb-4">Pending & Mining</h2>
            <PendingVotes />
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-4 sm:p-5 flex flex-col">
            <h2 className="font-semibold mb-4">Session Stats</h2>
            <div className="grid gap-3 lg:gap-4 text-sm mb-6" style={{gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))'}}>
              <Stat label="Mined Blocks" value={minedBlocks} />
              <Stat label="Votes Pending" value={pendingVotes.length} />
              <Stat label="Votes Mined" value={totalVotesMined} />
              <Stat label="Candidates" value={Object.keys(tally).length || '—'} />
              <Stat label="Wallet" value={wallet ? wallet.address.slice(0,10)+'…' : 'Disconnected'} />
              <Stat label="Status" value={sessionActive ? 'Active' : 'Ended'} accent={sessionActive ? 'text-emerald-600' : 'text-red-600'} />
            </div>
            {leading && totalVotesMined > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-gradient-to-r from-blue-600/80 to-teal-500/80 text-white px-4 py-3 text-sm shadow">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Leader</span>
                  <span className="font-semibold">{leading[0]}</span>
                </div>
                <div className="mt-1 text-xs text-blue-100/90">{leading[1]} vote{leading[1]===1?'':'s'} mined</div>
              </motion.div>
            )}
            {!leading && <p className="text-xs text-neutral-500">No mined votes yet.</p>}
            <div className="mt-6 flex flex-col gap-3">
              <button onClick={exportLedger} className="inline-flex justify-center items-center gap-2 rounded-lg bg-neutral-900 text-white px-4 py-2 text-xs font-semibold shadow hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70">
                <span>Download Ledger JSON</span>
              </button>
              <div className="space-y-1 text-[11px] text-neutral-500">
                <p>Stats update in real time as you cast and mine votes.</p>
                <p className="italic">Export includes blocks, pending votes & tally snapshot.</p>
              </div>
            </div>
          </div>
        </section>
  <section className="rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-6">Blockchain Ledger</h2>
          <BlockchainLedger />
        </section>
  <section className="rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-6">Results</h2>
          <ResultsChart />
        </section>
      </main>
  <footer className="py-10 text-center text-xs text-neutral-500">Built for educational simulation purposes.</footer>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 bg-white/70 backdrop-blur px-3 py-2 shadow-sm h-full">
      <span className="text-[10px] uppercase tracking-wide text-neutral-500 leading-tight" title={label}>{label}</span>
      <span className={`text-sm font-semibold mt-1 text-neutral-800 break-all` + (accent ? ` ${accent}` : '')} title={String(value)}>{value}</span>
    </div>
  )
}

