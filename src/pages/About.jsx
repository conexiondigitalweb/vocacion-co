import { Link } from 'react-router-dom'

const FAQ = [
  {
    q: '¿El test tiene costo?',
    a: 'No. vocacion.co es completamente gratuito. No necesitas crear cuenta ni dejar tu correo.',
  },
  {
    q: '¿Este test reemplaza una orientación vocacional profesional?',
    a: 'No. Es un punto de partida científico, no un diagnóstico definitivo. Te ayuda a identificar patrones y explorar opciones con base en evidencia, pero si tienes dudas profundas sobre tu vocación, te recomendamos complementarlo con un psicólogo orientador vocacional.',
  },
  {
    q: '¿Mis respuestas son privadas?',
    a: 'Sí. No se requiere registro ni correo. Los datos se guardan de forma anónima y solo se comparten si tú decides generar y enviar el link de resultados. Nunca vendemos ni compartimos información con terceros.',
  },
  {
    q: '¿Por qué incluyen carreras que no existen en mi ciudad?',
    a: 'Para mostrarte el panorama completo de oportunidades, incluyendo rutas alternativas como bootcamps, programas virtuales y certificaciones online que puedes cursar desde cualquier rincón del país. La sección de universidades filtra por tu departamento cuando lo indicas.',
  },
  {
    q: '¿Cada cuánto se actualiza la información de carreras y universidades?',
    a: 'Actualizamos periódicamente con datos del Ministerio de Educación, el SNIES y observatorios laborales colombianos. Para información oficial de admisiones y costos, siempre verifica directamente con la institución.',
  },
  {
    q: '¿Qué tan confiable es el test?',
    a: 'Usa tres frameworks validados por décadas de investigación en psicología vocacional: Holland RIASEC, Inteligencias Múltiples de Gardner y Valores de Trabajo de Super. No reemplaza la orientación profesional, pero ofrece una base científica sólida para empezar a explorar.',
  },
  {
    q: '¿Puedo repetirlo?',
    a: 'Sí, puedes hacerlo tantas veces como quieras. Te recomendamos esperar al menos unas semanas entre intentos para que las respuestas sean genuinas.',
  },
  {
    q: '¿Qué hago si mi resultado no me convence?',
    a: 'Responder con honestidad es clave. Si no reconoces tu perfil, te sugerimos revisar las preguntas de Holland (1-4) — son las de mayor peso en el algoritmo.',
  },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Cómo funciona vocacion.co</h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Un orientador vocacional gratuito, basado en ciencia, diseñado para el contexto colombiano.
        </p>
      </div>

      {/* El problema */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">El problema que queremos resolver</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-6">
          <p className="text-gray-800 leading-relaxed">
            En Colombia, miles de jóvenes eligen carrera por moda, presión familiar o lo que hacen sus
            amigos — no por vocación real. Esto genera una de las tasas de deserción universitaria más
            altas de América Latina y frustración personal que afecta familias y economías.
          </p>
        </div>
      </section>

      {/* La ciencia */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">La ciencia detrás del test</h2>
        <div className="space-y-6">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🧠</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Teoría de Holland RIASEC</h3>
                <p className="text-xs text-gray-500 mb-2">John Holland · 1959–1997</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  El modelo más estudiado y validado de psicología vocacional. Clasifica la personalidad
                  en 6 tipos: <strong>R</strong>ealista, <strong>I</strong>nvestigador, <strong>A</strong>rtístico,
                  <strong> S</strong>ocial, <strong>E</strong>mprendedor y <strong>C</strong>onvencional.
                  Las carreras también se pueden clasificar en estos tipos. La compatibilidad entre
                  personalidad y entorno laboral predice la satisfacción a largo plazo.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">💡</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Inteligencias Múltiples</h3>
                <p className="text-xs text-gray-500 mb-2">Howard Gardner · Harvard · 1983</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  No existe una sola inteligencia. Gardner identificó 8 tipos: lingüística,
                  lógico-matemática, musical, espacial, corporal-kinestésica, interpersonal,
                  intrapersonal y naturalista. Alinear carrera con tus inteligencias dominantes
                  maximiza el desempeño y la motivación.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Valores de Trabajo</h3>
                <p className="text-xs text-gray-500 mb-2">Donald Super · 1957–1990</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  La satisfacción laboral no depende solo de habilidades sino de que el trabajo
                  refleje tus valores. Super identificó valores como autonomía, impacto social,
                  reconocimiento, creatividad, estabilidad económica y conocimiento continuo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {FAQ.map(item => (
            <details key={item.q} className="bg-gray-50 rounded-xl group">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-900 list-none">
                {item.q}
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-gray-700 text-sm leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Origen del proyecto */}
      <section className="mb-12">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-700 leading-relaxed text-sm">
            <strong className="text-gray-900">¿Por qué existe vocacion.co?</strong> Colombia tiene una de las tasas
            de deserción universitaria más altas de América Latina. Una parte significativa de esa deserción ocurre
            porque los jóvenes eligen carrera sin conocerse realmente a sí mismos — guiados por la moda, la presión
            familiar o lo que hacen sus amigos. Este proyecto nació de esa inquietud: ofrecer una herramienta gratuita,
            seria y accesible para cualquier joven colombiano, sin importar su región o condición económica.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/test"
          className="inline-flex items-center gap-2 bg-primary text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-primary-600 transition-colors shadow-md"
        >
          Hacer el test ahora — gratis
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
