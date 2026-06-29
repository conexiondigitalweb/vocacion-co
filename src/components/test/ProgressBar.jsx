export default function ProgressBar({ actual, total, bloque, totalBloques }) {
  const pct = Math.round((actual / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Pregunta {actual} de {total}
        </span>
        <span className="text-sm text-primary font-semibold">
          Bloque {bloque}/{totalBloques}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
