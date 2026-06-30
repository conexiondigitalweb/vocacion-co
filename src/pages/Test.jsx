import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTestStore } from '../store/testStore'
import { PREGUNTAS, TOTAL_PREGUNTAS } from '../data/questions'
import { CARRERAS } from '../data/careers'
import { calcularPerfil, matchCarreras } from '../lib/scoring'
import ProgressBar from '../components/test/ProgressBar'
import QuestionCard from '../components/test/QuestionCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

// q0 es introductoria — excluirla del conteo de progreso y bloques
const PREGUNTAS_TEST = PREGUNTAS.filter(p => p.id !== 'q0')
const PREGUNTA_INTRO = PREGUNTAS.find(p => p.id === 'q0')

export default function Test() {
  const navigate = useNavigate()
  const { respuestas, pasoActual, setRespuesta, avanzar, retroceder, setResultado, resetTest } = useTestStore()
  const [analizando, setAnalizando] = useState(false)

  const esIntro = pasoActual === 0
  const pregunta = esIntro ? PREGUNTA_INTRO : PREGUNTAS_TEST[pasoActual - 1]
  const respuestaActual = pregunta ? respuestas[pregunta.id] : undefined

  // Número a mostrar en ProgressBar (solo cuenta preguntas del test, no q0)
  const pasoTest = esIntro ? 0 : pasoActual
  const totalTest = PREGUNTAS_TEST.length

  const puedeAvanzar = () => {
    if (!pregunta) return false
    if (pregunta.tipo === 'modo') return !!respuestaActual
    if (pregunta.opcional) return true
    if (pregunta.tipo === 'multi') return (respuestaActual || []).length > 0
    if (pregunta.tipo === 'likert') return (respuestaActual || []).filter(v => v > 0).length === pregunta.items.length
    if (pregunta.tipo === 'departamento') return !!respuestaActual
    return !!respuestaActual
  }

  const handleRespuesta = (valor) => {
    setRespuesta(pregunta.id, valor)
    // Auto-avance para selección única y modo (excepto departamento)
    if (pregunta.tipo === 'unica' || pregunta.tipo === 'modo') {
      setTimeout(() => avanzarPaso(), 300)
    }
  }

  const avanzarPaso = () => {
    const totalPasos = PREGUNTAS_TEST.length + 1 // +1 por q0
    if (pasoActual >= totalPasos - 1) {
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

  const esUltima = pasoActual === PREGUNTAS_TEST.length // última es q16 (paso 16 en 0-index + 1 por q0)
  const necesitaBotonSiguiente = pregunta.tipo !== 'unica' && pregunta.tipo !== 'modo'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar — oculto en intro */}
      {!esIntro && (
        <div className="px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="max-w-xl mx-auto">
            <ProgressBar
              actual={pasoTest}
              total={totalTest}
              bloque={pregunta.bloque}
              totalBloques={4}
            />
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 px-4 py-8">
        <div key={pasoActual} className="max-w-xl mx-auto question-animate">
          {esIntro ? (
            // Pantalla de intro especial
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.346-.347z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Antes de empezar</p>
            </div>
          ) : (
            <span className="inline-block text-xs font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full mb-4">
              {pregunta.bloqueNombre}
              {pregunta.opcional && ' · Opcional'}
            </span>
          )}

          <h2 className={`font-bold text-gray-900 mb-6 leading-snug ${esIntro ? 'text-2xl sm:text-3xl text-center' : 'text-xl sm:text-2xl'}`}>
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
