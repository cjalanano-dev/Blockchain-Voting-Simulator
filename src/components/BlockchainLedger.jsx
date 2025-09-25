import { useBlockchain } from '../context/BlockchainContext'
import { motion, AnimatePresence } from 'framer-motion'

function truncate(hash) {
  return hash.slice(0, 10) + '…' + hash.slice(-6)
}

export default function BlockchainLedger() {
  const { blockchain, chainValid } = useBlockchain()
  const blocks = blockchain

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Chain ({blocks.length - 1} mined blocks)</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${chainValid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>{chainValid ? 'VALID' : 'INVALID'}</span>
      </div>
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-4 min-w-max">
          <AnimatePresence initial={false}>
            {blocks.map((block, idx) => (
              <motion.div
                key={block.hash}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={`relative w-72 shrink-0 rounded-xl border ${idx === 0 ? 'border-indigo-300/50 dark:border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-950/40' : 'border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/50'} backdrop-blur-sm p-4 shadow-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Block</span>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">#{block.index}</span>
                </div>
                <div className="space-y-2 mb-3">
                  <Field label="Timestamp" value={new Date(block.timestamp).toLocaleTimeString()} />
                  <Field label="Hash" value={truncate(block.hash)} mono />
                  {idx !== 0 && <Field label="Prev" value={truncate(block.previousHash)} mono />}
                  <Field label="Nonce" value={block.nonce} />
                </div>
                <div className="text-xs font-medium mb-1 text-neutral-600 dark:text-neutral-300">Votes ({block.votes.length})</div>
                <ul className="space-y-1 max-h-28 overflow-auto pr-1 text-xs">
                  {block.votes.length === 0 && <li className="text-neutral-400 dark:text-neutral-500 italic">(empty)</li>}
                  {block.votes.map(v => (
                    <li key={v.id} className="rounded bg-neutral-100 dark:bg-neutral-700/60 px-2 py-1 flex justify-between items-center">
                      <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">{v.id.slice(0,6)}</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">{v.candidate}</span>
                    </li>
                  ))}
                </ul>
                {idx !== blocks.length - 1 && (
                  <div className="absolute -right-5 top-1/2 -translate-y-1/2 hidden md:block" aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-50 dark:opacity-60">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 dark:text-neutral-500" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, mono }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-wide text-neutral-400 dark:text-neutral-500 w-14">{label}</span>
      <span className={`text-xs truncate ${mono ? 'font-mono text-neutral-600 dark:text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>{value}</span>
    </div>
  )
}
