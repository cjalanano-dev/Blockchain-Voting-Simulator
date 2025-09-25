import Navbar from './components/Navbar'
import VotingPanel from './components/VotingPanel'
import './index.css'
import PendingVotes from './components/PendingVotes'
import BlockchainLedger from './components/BlockchainLedger'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Voting Panel</h2>
          <VotingPanel />
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 flex flex-col">
            <h2 className="font-semibold mb-4">Pending & Mining</h2>
            <PendingVotes />
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5 flex flex-col">
            <h2 className="font-semibold mb-4">Next Features</h2>
            <ul className="text-sm list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>Visual ledger view</li>
              <li>Results chart</li>
              <li>Export ledger</li>
            </ul>
            <p className="mt-4 text-xs text-neutral-400 dark:text-neutral-500">(Placeholders until implemented)</p>
          </div>
        </section>
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Blockchain Ledger</h2>
          <BlockchainLedger />
        </section>
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">No data.</div>
        </section>
      </main>
      <footer className="py-10 text-center text-xs text-neutral-500 dark:text-neutral-500">Built for educational simulation purposes.</footer>
    </div>
  )
}

