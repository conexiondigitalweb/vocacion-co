import { useState } from 'react'
import Badge from '../ui/Badge'

const TAG_COLORS = {
  'Alta demanda': 'green',
  'Máximo prestigio': 'purple',
  'Creciente demanda': 'blue',
  'Alta empleabilidad': 'green',
  'Economía creativa': 'yellow',
  'Alto prestigio': 'purple',
  'Carrera del futuro': 'blue',
  'Impacto social': 'green',
  'Vocación rural': 'yellow',
  'Acceso rápido': 'blue',
  'Segunda más demandada': 'green',
  'Era digital': 'blue',
  'Siempre necesario': 'gray',
  'Muy versátil': 'green',
  'Impacto comunitario': 'yellow',
  'Máxima demanda': 'green',
  'Economía digital': 'blue',
  'Transición energética': 'green',
  'Salud + Tecnología': 'purple',
  'Impacto territorial': 'yellow',
  'Impacto + Innovación': 'blue',
}

export default function CareerCard({ carrera, region, destacada = false }) {
  const [mostrarRuta, setMostrarRuta] = useState(false)
  const universidades = carrera.universidades[region] || carrera.universidades['default'] || []

  return (
    <div className={`
      bg-white rounded-2xl border-2 p-6 transition-all
      ${destacada ? 'border-primary shadow-md' : 'border-gray-100 hover:border-gray-200'}
    `}>
      {/* Badges superiores */}
      <div className="flex flex-wrap gap-2 mb-3">
        {destacada && (
          <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            Mejor match para ti
          </span>
        )}
        {carrera.emergente && (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            🚀 Carrera emergente
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{carrera.nombre}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{carrera.area}</p>
        </div>
        <Badge color={TAG_COLORS[carrera.tag] || 'gray'}>{carrera.tag}</Badge>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
          {carrera.modalidadLabel}
        </span>
        {carrera.saturacion === 'baja' && (
          <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
            Baja saturación
          </span>
        )}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">{carrera.descripcion}</p>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Mercado laboral
        </p>
        <p className="text-sm text-gray-700">{carrera.mercadoLaboral}</p>
      </div>

      {universidades.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Universidades {region ? `en ${region}` : 'recomendadas'}
          </p>
          <div className="flex flex-wrap gap-2">
            {universidades.map(u => (
              <span key={u} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                {u}
              </span>
            ))}
          </div>
        </div>
      )}

      {carrera.becas?.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Opciones de financiación
          </p>
          <div className="flex flex-wrap gap-2">
            {carrera.becas.map(b => (
              <span key={b} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-lg font-medium">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ruta alternativa — solo emergentes */}
      {carrera.rutaAlternativa && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          <button
            onClick={() => setMostrarRuta(!mostrarRuta)}
            className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform ${mostrarRuta ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Ruta alternativa de entrada
          </button>
          {mostrarRuta && (
            <p className="text-xs text-gray-600 leading-relaxed mt-2 bg-indigo-50 rounded-xl p-3">
              {carrera.rutaAlternativa}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
