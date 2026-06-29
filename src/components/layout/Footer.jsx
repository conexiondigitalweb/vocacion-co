import { Link, useLocation } from 'react-router-dom'

export default function Footer() {
  const location = useLocation()
  if (location.pathname === '/test') return null

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="text-white font-semibold">vocacion.co</span>
        </div>

        <p className="text-sm text-center">
          Desarrollado con propósito social · Colombia 2025
        </p>

        <nav className="flex gap-4 text-sm">
          <Link to="/sobre-nosotros" className="hover:text-white transition-colors">
            Cómo funciona
          </Link>
          <Link to="/test" className="hover:text-white transition-colors">
            Hacer el test
          </Link>
        </nav>
      </div>
    </footer>
  )
}
