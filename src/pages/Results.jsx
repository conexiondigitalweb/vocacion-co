import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { useTestStore } from '../store/testStore'
import ProfileChart from '../components/results/ProfileChart'
import CareerCard from '../components/results/CareerCard'
import ShareButton from '../components/results/ShareButton'
import { HOLLAND_NOMBRES, HOLLAND_DESCRIPCIONES, COMBOS_TOP2 } from '../lib/scoring'

const PASOS_ACCION = [
  { num: '1', titulo: 'Investiga las carreras', desc: 'Entra al SNIES (snies.mineducacion.gov.co) para ver la oferta oficial de programas en tu región.' },
  { num: '2', titulo: 'Habla con profesionales', desc: 'Busca personas que ejerzan las carreras de tu top 3. Una conversación de 15 minutos vale más que semanas de research.' },
  { num: '3', titulo: 'Explora becas y financiación', desc: 'Visita icetex.gov.co y el sitio del SENA para conocer todas las opciones de financiación disponibles.' },
]

export default function Results() {
  const navigate = useNavigate()
  const { resultado, respuestas, resetTest } = useTestStore()
  const [mostrarMas, setMostrarMas] = useState(false)
  const [descargando, setDescargando] = useState(false)
  const cardRef = useRef(null)

  const descargarImagen = async () => {
    if (!cardRef.current) return
    setDescargando(true)
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = 'mi-perfil-vocacional.png'
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('Error descargando imagen:', e)
    } finally {
      setDescargando(false)
    }
  }

  if (!resultado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">No hay resultados aún</h2>
        <p className="text-gray-600 mb-6">Completa el test para ver tu perfil vocacional.</p>
        <Link
          to="/test"
          className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors"
        >
          Hacer el test
        </Link>
      </div>
    )
  }

  const { perfil, carreras } = resultado
  const { top2 } = perfil
  const region = respuestas.q12
  const topCarreras = carreras.slice(0, 3)
  const masCarreras = carreras.slice(3)
  const comboKey = top2.join('')
  const comboDesc = COMBOS_TOP2[comboKey] || COMBOS_TOP2[top2.slice().reverse().join('')] || ''

  const hacerDeNuevo = () => {
    resetTest()
    navigate('/test')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
      {/* Zona capturada como imagen */}
      <div ref={cardRef} className="bg-white">

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block bg-primary-50 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
          Tu perfil vocacional
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Perfil {top2.map(t => HOLLAND_NOMBRES[t]).join(' + ')}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          {comboDesc || `Tus dos tipos dominantes son ${HOLLAND_NOMBRES[top2[0]]} (${HOLLAND_DESCRIPCIONES[top2[0]]?.split('.')[0]}) y ${HOLLAND_NOMBRES[top2[1]]}.`}
        </p>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Tu puntuación RIASEC</h2>
        <ProfileChart perfil={perfil.perfil} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {Object.entries(perfil.perfil)
            .sort((a, b) => b[1] - a[1])
            .map(([tipo, pct]) => (
              <div key={tipo} className="text-center">
                <p className="text-xs text-gray-500">{HOLLAND_NOMBRES[tipo]}</p>
                <p className="font-bold text-gray-900">{pct}%</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* Top 3 carreras */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Carreras recomendadas para ti</h2>
        <div className="space-y-4">
          {topCarreras.map((carrera, i) => (
            <CareerCard
              key={carrera.id}
              carrera={carrera}
              region={region}
              destacada={i === 0}
            />
          ))}
        </div>
      </div>

      </div>{/* fin zona capturada */}

      {/* Compartir */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center">
        <h3 className="font-bold text-gray-900 mb-2">¿Quieres guardar o compartir tu resultado?</h3>
        <p className="text-sm text-gray-600 mb-4">Genera un enlace único para compartir con familia o amigos.</p>
        <ShareButton
          respuestas={respuestas}
          scores={perfil.scores}
          perfil={perfil.perfil}
          top2={top2}
          carreras={carreras}
        />
        <button
          onClick={descargarImagen}
          disabled={descargando}
          className="mt-3 flex items-center gap-2 mx-auto text-sm text-gray-600 font-medium px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {descargando ? 'Generando imagen...' : 'Descargar como imagen'}
        </button>
      </div>

      {/* Qué hacer ahora */}
      <div className="bg-primary-50 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">¿Qué hacer ahora?</h2>
        <div className="space-y-4">
          {PASOS_ACCION.map(paso => (
            <div key={paso.num} className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {paso.num}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{paso.titulo}</p>
                <p className="text-sm text-gray-600 mt-0.5">{paso.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explorar más carreras */}
      <div className="mb-6">
        <button
          onClick={() => setMostrarMas(!mostrarMas)}
          className="w-full flex items-center justify-between bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 hover:border-primary transition-colors"
        >
          <span className="font-semibold text-gray-800">
            Explorar {masCarreras.length} carreras más
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${mostrarMas ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {mostrarMas && (
          <div className="space-y-4 mt-4">
            {masCarreras.map(carrera => (
              <CareerCard key={carrera.id} carrera={carrera} region={region} />
            ))}
          </div>
        )}
      </div>

      {/* Hacer de nuevo */}
      <div className="text-center">
        <button
          onClick={hacerDeNuevo}
          className="text-sm text-gray-500 hover:text-primary transition-colors underline underline-offset-2"
        >
          Hacer el test de nuevo
        </button>
      </div>
    </div>
  )
}
