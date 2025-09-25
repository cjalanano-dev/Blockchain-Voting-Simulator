import Navbar from './components/Navbar'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Voting Panel</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Under construction…</p>
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5">
            <h2 className="font-semibold mb-2">Pending Votes</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No votes yet.</p>
          </div>
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-5">
            <h2 className="font-semibold mb-2">Mine Block</h2>
            <button disabled className="mt-2 inline-flex items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 cursor-not-allowed">Mine (disabled)</button>
          </div>
        </section>
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Blockchain Ledger</h2>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">No blocks yet.</div>
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

