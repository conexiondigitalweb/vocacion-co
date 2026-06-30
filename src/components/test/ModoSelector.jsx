export default function ModoSelector({ opciones, seleccionado, onSeleccionar }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {opciones.map(opcion => (
        <button
          key={opcion.valor}
          type="button"
          onClick={() => onSeleccionar(opcion.valor)}
          className={`
            text-left p-5 rounded-2xl border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${seleccionado === opcion.valor
              ? 'border-primary bg-primary-50'
              : 'border-gray-200 bg-white hover:border-primary-100 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0 mt-0.5">{opcion.icono}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-bold text-gray-900 text-base">{opcion.titulo}</p>
                {seleccionado === opcion.valor && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-primary mb-1">{opcion.texto}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{opcion.detalle}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
