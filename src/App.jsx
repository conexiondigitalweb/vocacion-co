import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Test from './pages/Test'
import Results from './pages/Results'
import Share from './pages/Share'
import About from './pages/About'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="/resultado/:shareCode" element={<Share />} />
          <Route path="/sobre-nosotros" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
