export default function OptionButton({ opcion, seleccionado, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onClick(opcion.valor)}
      disabled={disabled}
      className={`
        w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${seleccionado
          ? 'border-primary bg-primary-50 text-primary-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-primary-100 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          ${seleccionado ? 'border-primary bg-primary' : 'border-gray-300'}
        `}>
          {seleccionado && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
        <div>
          <p className="font-medium leading-snug">{opcion.texto}</p>
          {opcion.detalle && (
            <p className="text-sm text-gray-500 mt-0.5">{opcion.detalle}</p>
          )}
        </div>
      </div>
    </button>
  )
}
