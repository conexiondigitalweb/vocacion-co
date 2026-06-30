import OptionButton from './OptionButton'
import MultiSelect from './MultiSelect'
import LikertScale from './LikertScale'
import ModoSelector from './ModoSelector'

export default function QuestionCard({ pregunta, respuesta, onRespuesta }) {
  if (pregunta.tipo === 'modo') {
    return (
      <div className="animate-slide-up">
        {pregunta.ayuda && (
          <p className="text-sm text-gray-500 italic mb-4">{pregunta.ayuda}</p>
        )}
        <ModoSelector
          opciones={pregunta.opciones}
          seleccionado={respuesta}
          onSeleccionar={onRespuesta}
        />
      </div>
    )
  }

  if (pregunta.tipo === 'unica') {
    return (
      <div className="space-y-3 animate-slide-up">
        {pregunta.ayuda && (
          <p className="text-sm text-gray-500 italic">{pregunta.ayuda}</p>
        )}
        {pregunta.opciones.map(opcion => (
          <OptionButton
            key={opcion.valor}
            opcion={opcion}
            seleccionado={respuesta === opcion.valor}
            onClick={(valor) => onRespuesta(valor)}
          />
        ))}
      </div>
    )
  }

  if (pregunta.tipo === 'multi') {
    return (
      <div className="animate-slide-up">
        {pregunta.ayuda && (
          <p className="text-sm text-gray-500 italic mb-3">{pregunta.ayuda}</p>
        )}
        <MultiSelect
          opciones={pregunta.opciones}
          seleccionados={respuesta || []}
          onChange={onRespuesta}
          maxSeleccion={pregunta.maxSeleccion}
        />
        <p className="text-sm text-gray-400 mt-3 text-center">
          {(respuesta || []).length}/{pregunta.maxSeleccion} seleccionados
        </p>
      </div>
    )
  }

  if (pregunta.tipo === 'departamento') {
    return (
      <div className="animate-slide-up">
        <select
          value={respuesta || ''}
          onChange={e => onRespuesta(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-primary transition-colors bg-white"
        >
          <option value="">Selecciona tu departamento...</option>
          {pregunta.opciones.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </div>
    )
  }

  if (pregunta.tipo === 'likert') {
    return (
      <div className="animate-slide-up">
        {pregunta.ayuda && (
          <p className="text-sm text-gray-500 italic mb-4">{pregunta.ayuda}</p>
        )}
        <LikertScale
          items={pregunta.items}
          valores={respuesta || []}
          onChange={onRespuesta}
        />
      </div>
    )
  }

  return null
}
