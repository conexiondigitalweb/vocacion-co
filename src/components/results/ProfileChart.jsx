import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { HOLLAND_NOMBRES } from '../../lib/scoring'

export default function ProfileChart({ perfil }) {
  const data = Object.entries(perfil)
    .map(([key, value]) => ({ tipo: key, nombre: HOLLAND_NOMBRES[key], valor: value }))
    .sort((a, b) => b.valor - a.valor)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
          <p className="font-semibold text-gray-900">{d.nombre}</p>
          <p className="text-primary font-bold">{d.valor}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="nombre" tick={{ fontSize: 12, fontWeight: 600 }} width={110} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="valor" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.tipo}
                fill={index === 0 ? '#007A53' : index === 1 ? '#34a07a' : '#a7d4bf'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
