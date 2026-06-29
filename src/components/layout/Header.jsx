import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isTest = location.pathname === '/test'

  if (isTest) return null

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">vocacion.co</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/sobre-nosotros"
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Cómo funciona
          </Link>
          <Link
            to="/test"
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Hacer el test
          </Link>
        </nav>
      </div>
    </header>
  )
}
