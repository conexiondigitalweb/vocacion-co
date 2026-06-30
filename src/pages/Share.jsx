import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { obtenerResultado } from '../lib/share'
import ProfileChart from '../components/results/ProfileChart'
import CareerCard from '../components/results/CareerCard'
import Spinner from '../components/ui/Spinner'
import { HOLLAND_NOMBRES, COMBOS_TOP2, matchCarreras } from '../lib/scoring'
import { CARRERAS } from '../data/careers'

export default function Share() {
  const { shareCode } = useParams()
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [descargando, setDescargando] = useState(false)
  const cardRef = useRef(null)

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

  const shareUrl = window.location.href

  const descargarImagen = async () => {
    if (!cardRef.current) return
    setDescargando(true)
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = 'perfil-vocacional.png'
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('Error descargando imagen:', e)
    } finally {
      setDescargando(false)
    }
  }

  const compartirWhatsApp = () => {
    const carreraTop = topCarreras?.[0]?.nombre || ''
    const mensaje = `Descubrí que tengo perfil vocacional para ${carreraTop} 🎯 ¡Haz tú también el test gratis y descubre tu carrera ideal! ${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener')
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

      {/* Zona capturada como imagen */}
      <div ref={cardRef} className="bg-white">

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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Carreras recomendadas</h2>
          <div className="space-y-4">
            {topCarreras.map((carrera, i) => (
              <CareerCard key={carrera.id} carrera={carrera} region={datos.region} destacada={i === 0} />
            ))}
          </div>
        </div>

      </div>{/* fin zona capturada */}

      {/* Acciones compartir */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={compartirWhatsApp}
          className="flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1ebe57] transition-colors text-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Compartir por WhatsApp
        </button>
        <button
          onClick={descargarImagen}
          disabled={descargando}
          className="flex items-center gap-2 text-sm text-gray-600 font-medium px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {descargando ? 'Generando...' : 'Descargar imagen'}
        </button>
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
