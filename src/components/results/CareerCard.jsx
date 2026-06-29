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
}

export default function CareerCard({ carrera, region, destacada = false }) {
  const universidades = carrera.universidades[region] || carrera.universidades['default'] || []

  return (
    <div className={`
      bg-white rounded-2xl border-2 p-6 transition-all
      ${destacada ? 'border-primary shadow-md' : 'border-gray-100 hover:border-gray-200'}
    `}>
      {destacada && (
        <div className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
          Mejor match para ti
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{carrera.nombre}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{carrera.area}</p>
        </div>
        <Badge color={TAG_COLORS[carrera.tag] || 'gray'}>{carrera.tag}</Badge>
      </div>

      <div className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
        {carrera.modalidadLabel}
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
    </div>
  )
}
