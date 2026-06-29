export default function LikertScale({ items, valores = [], onChange }) {
  const update = (index, valor) => {
    const nuevo = [...valores]
    nuevo[index] = valor
    onChange(nuevo)
  }

  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-800 mb-3">{item}</p>
          <div className="flex gap-2 justify-between">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => update(i, n)}
                className={`
                  flex-1 h-10 rounded-lg font-semibold text-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                  ${valores[i] === n
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                  }
                `}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">No me describe</span>
            <span className="text-xs text-gray-400">Me describe perfecto</span>
          </div>
        </div>
      ))}
    </div>
  )
}
