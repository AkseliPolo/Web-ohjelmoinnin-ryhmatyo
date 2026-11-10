import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FeaturedMovies from './components/FeaturedMovies'
import SearchPage from './pages/SearchPage'
import './App.css'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container mt-5 flex-grow-1">
        <Routes>
          <Route path="/" element={<FeaturedMovies />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App