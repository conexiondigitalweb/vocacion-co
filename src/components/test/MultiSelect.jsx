export default function MultiSelect({ opciones, seleccionados = [], onChange, maxSeleccion = 2 }) {
  const toggle = (valor) => {
    if (seleccionados.includes(valor)) {
      onChange(seleccionados.filter(v => v !== valor))
    } else if (seleccionados.length < maxSeleccion) {
      onChange([...seleccionados, valor])
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {opciones.map(opcion => {
        const seleccionado = seleccionados.includes(opcion.valor)
        const deshabilitado = !seleccionado && seleccionados.length >= maxSeleccion

        return (
          <button
            key={opcion.valor}
            type="button"
            onClick={() => toggle(opcion.valor)}
            disabled={deshabilitado}
            className={`
              text-left px-4 py-3 rounded-xl border-2 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${seleccionado
                ? 'border-primary bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-100 hover:bg-gray-50'
              }
              ${deshabilitado ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center
                ${seleccionado ? 'border-primary bg-primary' : 'border-gray-300'}
              `}>
                {seleccionado && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-sm leading-snug">{opcion.texto}</p>
                {opcion.detalle && (
                  <p className="text-xs text-gray-500 mt-0.5">{opcion.detalle}</p>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
