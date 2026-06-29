import { Link } from 'react-router-dom'

const PASOS = [
  { num: '01', titulo: 'Responde 16 preguntas', desc: 'Sobre tu personalidad, habilidades, valores y contexto. Sin trampa, sin respuestas correctas.' },
  { num: '02', titulo: 'Analizamos tu perfil', desc: 'Cruzamos tres métodos científicos: Holland RIASEC, Inteligencias Múltiples y Valores de Trabajo.' },
  { num: '03', titulo: 'Descubres tu vocación', desc: 'Recibes tus carreras más afines con universidades reales en tu departamento y opciones de becas.' },
]

const CIENCIA = [
  {
    titulo: 'Holland RIASEC',
    subtitulo: 'John Holland · 1959',
    desc: 'Clasifica las personalidades en 6 tipos: Realista, Investigador, Artístico, Social, Emprendedor y Convencional. Base del orientador vocacional más usado del mundo.',
    color: 'from-green-50 to-emerald-50',
    icon: '🧠',
  },
  {
    titulo: 'Inteligencias Múltiples',
    subtitulo: 'Howard Gardner · Harvard · 1983',
    desc: 'No hay una sola inteligencia. Identifica tus 8 tipos de inteligencia para alinear carrera con tus talentos naturales.',
    color: 'from-blue-50 to-indigo-50',
    icon: '💡',
  },
  {
    titulo: 'Valores de Trabajo',
    subtitulo: 'Donald Super · 1957',
    desc: 'Tu satisfacción laboral depende de que tu trabajo refleje tus valores. Este eje identifica qué motiva tus decisiones de carrera.',
    color: 'from-purple-50 to-violet-50',
    icon: '🎯',
  },
]

const PARA_QUIEN = [
  { titulo: 'Grado 10 y 11', desc: 'Para explorar opciones antes de que llegue la presión de elegir.' },
  { titulo: 'Bachiller recién graduado', desc: 'Para confirmar o reconsiderar antes de matricularte.' },
  { titulo: 'Cualquier joven colombiano', desc: 'Sin importar tu región, funciona para todo el territorio nacional.' },
]

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white pt-16 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            100% gratuito · Sin registro
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Descubre la carrera<br />
            <span className="text-primary">donde serás feliz</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Test vocacional gratuito basado en ciencia. 16 preguntas. 8 minutos.
            Para cualquier joven colombiano.
          </p>
          <Link
            to="/test"
            className="inline-flex items-center gap-2 bg-primary text-white text-lg font-bold px-8 py-4 rounded-2xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Comenzar test gratuito
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </Link>
          <p className="text-sm text-gray-400 mt-4">Sin registro · Sin correo · Sin publicidad invasiva</p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {PASOS.map(paso => (
              <div key={paso.num} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {paso.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{paso.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Base científica */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            Base científica
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            No es un quiz de redes sociales. Cruza tres frameworks validados de psicología vocacional.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CIENCIA.map(item => (
              <div key={item.titulo} className={`bg-gradient-to-br ${item.color} rounded-2xl p-6`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{item.titulo}</h3>
                <p className="text-xs text-gray-500 mb-3 font-medium">{item.subtitulo}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            ¿Para quién es?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PARA_QUIEN.map(item => (
              <div key={item.titulo} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-primary-100 transition-colors">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.titulo}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            ¿Listo para descubrir tu vocación?
          </h2>
          <p className="text-primary-100 mb-8">
            En 8 minutos tendrás claridad que muchos tardan años en encontrar.
          </p>
          <Link
            to="/test"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-lg px-8 py-4 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg"
          >
            Empezar ahora — es gratis
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
