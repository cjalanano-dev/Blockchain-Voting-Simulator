import { useBlockchain } from '../context/BlockchainContext'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useMemo } from 'react'

export default function ResultsChart() {
  const { tally } = useBlockchain()

  const data = useMemo(() => {
    const entries = Object.entries(tally)
    if (entries.length === 0) return []
    return entries.map(([candidate, votes]) => ({ candidate, votes }))
  }, [tally])

  if (data.length === 0) {
  return <div className="text-sm text-neutral-500">No votes mined yet.</div>
  }

  return (
  <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="candidate" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip contentStyle={{ background: 'rgba(30,41,59,0.85)', border: '1px solid #334155', borderRadius: 8, padding: '8px 10px', color: 'white' }} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
          <Bar dataKey="votes" radius={[6,6,0,0]} className="fill-blue-500" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
