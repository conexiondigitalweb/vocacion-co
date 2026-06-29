import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import { PREGUNTAS, TOTAL_PREGUNTAS } from '../data/questions'
import { CARRERAS } from '../data/careers'
import { calcularPerfil, matchCarreras } from '../lib/scoring'
import ProgressBar from '../components/test/ProgressBar'
import QuestionCard from '../components/test/QuestionCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function Test() {
  const navigate = useNavigate()
  const { respuestas, pasoActual, setRespuesta, avanzar, retroceder, setResultado, resetTest } = useTestStore()
  const [analizando, setAnalizando] = useState(false)

  const pregunta = PREGUNTAS[pasoActual]
  const respuestaActual = respuestas[pregunta?.id]

  const puedeAvanzar = () => {
    if (!pregunta) return false
    if (pregunta.opcional) return true
    if (pregunta.tipo === 'multi') return (respuestaActual || []).length > 0
    if (pregunta.tipo === 'likert') return (respuestaActual || []).filter(v => v > 0).length === pregunta.items.length
    if (pregunta.tipo === 'departamento') return !!respuestaActual
    return !!respuestaActual
  }

  const handleRespuesta = (valor) => {
    setRespuesta(pregunta.id, valor)
    // Auto-avance para selección única (excepto departamento)
    if (pregunta.tipo === 'unica') {
      setTimeout(() => avanzarPaso(), 300)
    }
  }

  const avanzarPaso = () => {
    if (pasoActual >= TOTAL_PREGUNTAS - 1) {
      finalizarTest()
    } else {
      avanzar()
    }
  }

  const finalizarTest = () => {
    setAnalizando(true)
    setTimeout(() => {
      const perfil = calcularPerfil(respuestas)
      const carreras = matchCarreras(perfil, respuestas, CARRERAS)
      setResultado({ perfil, carreras })
      navigate('/resultados')
    }, 1800)
  }

  const handleAtras = () => {
    if (pasoActual === 0) {
      navigate('/')
    } else {
      retroceder()
    }
  }

  if (analizando) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Spinner size="lg" />
        <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">Analizando tu perfil...</h2>
        <p className="text-gray-500 text-center max-w-xs">
          Cruzando tus respuestas con los modelos de Holland, Gardner y Super
        </p>
      </div>
    )
  }

  if (!pregunta) return null

  const esUltima = pasoActual === TOTAL_PREGUNTAS - 1
  const necesitaBotonSiguiente = pregunta.tipo !== 'unica'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-xl mx-auto">
          <ProgressBar
            actual={pasoActual + 1}
            total={TOTAL_PREGUNTAS}
            bloque={pregunta.bloque}
            totalBloques={4}
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-xl mx-auto">
          {/* Bloque badge */}
          <span className="inline-block text-xs font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full mb-4">
            {pregunta.bloqueNombre}
            {pregunta.opcional && ' · Opcional'}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-snug">
            {pregunta.pregunta}
          </h2>

          <QuestionCard
            pregunta={pregunta}
            respuesta={respuestaActual}
            onRespuesta={handleRespuesta}
          />
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="px-4 py-4 border-t border-gray-100 bg-white">
        <div className="max-w-xl mx-auto flex gap-3">
          <Button variant="ghost" onClick={handleAtras} className="flex-shrink-0">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5 5-5M18 12H6" />
            </svg>
            Atrás
          </Button>

          {(necesitaBotonSiguiente || pregunta.opcional) && (
            <Button
              variant="primary"
              onClick={avanzarPaso}
              disabled={!puedeAvanzar()}
              className="flex-1"
            >
              {esUltima ? 'Ver mis resultados' : 'Siguiente'}
              {!esUltima && (
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
