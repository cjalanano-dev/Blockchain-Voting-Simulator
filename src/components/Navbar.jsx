import { useState, useEffect } from 'react'
import { Sun, Moon, Wallet, Power } from 'lucide-react'
import { useBlockchain } from '../context/BlockchainContext'

function generateFakeAddress() {
  const chars = 'abcdef0123456789'
  let addr = '0x'
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * chars.length)]
  return addr
}

export default function Navbar() {
  const { wallet, connectWallet, disconnectWallet, sessionActive, endSession, resetSession } = useBlockchain()
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const connected = !!wallet
  const address = wallet?.address || ''

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const toggleTheme = () => setDark(d => !d)
  const handleConnect = () => {
    if (connected) disconnectWallet()
    else connectWallet()
  }

  return (
    <nav className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/65 dark:supports-[backdrop-filter]:bg-neutral-900/65 bg-white/90 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400 shadow-inner" />
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-300 dark:via-indigo-300 dark:to-teal-300">Blockchain Voting Simulation</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* <button onClick={toggleTheme} aria-label="Toggle dark mode" className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group">
            <Sun className="h-5 w-5 text-amber-500 dark:hidden" />
            <Moon className="h-5 w-5 text-blue-400 hidden dark:block" />
            <span className="pointer-events-none absolute -bottom-8 scale-90 rounded bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-neutral-100 dark:text-neutral-900">{dark ? 'Light' : 'Dark'} mode</span>
          </button> */}
          <button onClick={handleConnect} className={`inline-flex items-center gap-2 rounded-lg border text-sm font-medium px-3 h-10 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-neutral-900 ${connected ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-blue-400/60 hover:bg-blue-50 dark:hover:bg-neutral-700/70'}`}>
            <Wallet className="h-4 w-4" />
            {connected ? <span className="font-mono">{address.slice(0,6)}…{address.slice(-4)}</span> : <span>Connect Wallet</span>}
          </button>
          {connected && (
            <button onClick={sessionActive ? endSession : resetSession} className={`inline-flex items-center gap-1 rounded-lg border text-xs font-medium px-3 h-10 shadow-sm transition-all focus:outline-none border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-red-400/60 hover:bg-red-50 dark:hover:bg-red-900/30 ${!sessionActive ? 'border-emerald-400/40 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30' : ''}`}> 
              <Power className="h-4 w-4" /> {sessionActive ? 'End Session' : 'Restart'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
