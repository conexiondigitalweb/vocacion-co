import { useState } from 'react'
import { guardarResultado } from '../../lib/share'

export default function ShareButton({ respuestas, scores, perfil, top2, carreras }) {
  const [estado, setEstado] = useState('idle') // idle | loading | copiado | error
  const [shareUrl, setShareUrl] = useState('')

  const compartir = async () => {
    setEstado('loading')
    try {
      const code = await guardarResultado({ respuestas, scores, perfil, top2, carreras })
      const url = `${window.location.origin}/resultado/${code}`
      setShareUrl(url)
      await navigator.clipboard.writeText(url)
      setEstado('copiado')
      setTimeout(() => setEstado('idle'), 3000)
    } catch {
      setEstado('error')
      setTimeout(() => setEstado('idle'), 3000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={compartir}
        disabled={estado === 'loading'}
        className="flex items-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60"
      >
        {estado === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generando enlace...
          </>
        ) : estado === 'copiado' ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            ¡Enlace copiado!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartir mis resultados
          </>
        )}
      </button>

      {shareUrl && estado === 'copiado' && (
        <p className="text-xs text-gray-500 text-center">
          Enlace copiado al portapapeles
        </p>
      )}

      {estado === 'error' && (
        <p className="text-xs text-red-500 text-center">
          Error al generar el enlace. Verifica tu conexión.
        </p>
      )}
    </div>
  )
}
