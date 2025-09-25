import { Wallet, Power } from 'lucide-react'
import { useBlockchain } from '../context/BlockchainContext'

// Dark mode removed; keeping component lean.

export default function Navbar() {
  const { wallet, connectWallet, disconnectWallet, sessionActive, endSession, resetSession } = useBlockchain()
  const connected = !!wallet
  const address = wallet?.address || ''

  const handleConnect = () => {
    if (connected) disconnectWallet()
    else connectWallet()
  }

  return (
    <nav className="sticky top-0 z-20 backdrop-blur bg-white/90 border-b border-neutral-200 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400 shadow-inner" />
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600">Blockchain Voting Simulation</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleConnect} className={`inline-flex items-center gap-2 rounded-lg border text-sm font-medium px-3 h-10 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${connected ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700' : 'border-neutral-300 bg-white text-neutral-700 hover:border-blue-400/60 hover:bg-blue-50'}`}>
            <Wallet className="h-4 w-4" />
            {connected ? <span className="font-mono">{address.slice(0,6)}…{address.slice(-4)}</span> : <span>Connect Wallet</span>}
          </button>
          {connected && (
            <button onClick={sessionActive ? endSession : resetSession} className={`inline-flex items-center gap-1 rounded-lg border text-xs font-medium px-3 h-10 shadow-sm transition-all focus:outline-none border-neutral-300 bg-white text-neutral-600 hover:border-red-400/60 hover:bg-red-50 ${!sessionActive ? 'border-emerald-400/40 hover:border-emerald-400 hover:bg-emerald-50' : ''}`}> 
              <Power className="h-4 w-4" /> {sessionActive ? 'End Session' : 'Restart'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
