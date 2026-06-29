import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { obtenerResultado } from '../lib/share'
import ProfileChart from '../components/results/ProfileChart'
import CareerCard from '../components/results/CareerCard'
import Spinner from '../components/ui/Spinner'
import { HOLLAND_NOMBRES, COMBOS_TOP2 } from '../lib/scoring'
import { matchCarreras } from '../lib/scoring'
import { CARRERAS } from '../data/careers'

export default function Share() {
  const { shareCode } = useParams()
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerResultado(shareCode)
      .then(setDatos)
      .catch(() => setError('No encontramos este resultado. El enlace puede haber expirado.'))
      .finally(() => setCargando(false))
  }, [shareCode])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" text="Cargando perfil vocacional..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/test" className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors">
          Hacer mi propio test
        </Link>
      </div>
    )
  }

  const perfil = datos.scores
  const top2 = Object.entries(perfil).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0])
  const total = Object.values(perfil).reduce((a, b) => a + b, 0) || 1
  const perfilPct = {}
  Object.entries(perfil).forEach(([k, v]) => { perfilPct[k] = Math.round((v / total) * 100) })

  const carreras = matchCarreras({ top2 }, datos.answers || {}, CARRERAS)
  const topCarreras = carreras.slice(0, 3)
  const comboKey = top2.join('')
  const comboDesc = COMBOS_TOP2[comboKey] || COMBOS_TOP2[top2.slice().reverse().join('')] || ''

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
      {/* Banner */}
      <div className="bg-primary-50 border-2 border-primary-100 rounded-2xl p-4 mb-8 text-center">
        <p className="text-primary font-semibold">Alguien compartió su perfil vocacional contigo</p>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Perfil {top2.map(t => HOLLAND_NOMBRES[t]).join(' + ')}
        </h1>
        <p className="text-gray-600">{comboDesc}</p>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Puntuación RIASEC</h2>
        <ProfileChart perfil={perfilPct} />
      </div>

      {/* Carreras */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Carreras recomendadas</h2>
        <div className="space-y-4">
          {topCarreras.map((carrera, i) => (
            <CareerCard key={carrera.id} carrera={carrera} region={datos.region} destacada={i === 0} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">¿Quieres conocer el tuyo?</h3>
        <p className="text-primary-100 mb-6">El test es gratuito y toma solo 8 minutos.</p>
        <Link
          to="/test"
          className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Hacer mi test vocacional
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
