import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FeaturedMovies from './components/FeaturedMovies'
import { Routes, Route } from 'react-router-dom'
import Movieinfo from './pages/Movieinfo'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container mt-5 flex-grow-1">
        <Routes>
          <Route path="/" element={<FeaturedMovies />} />
          <Route path="/movies/:id" element={<Movieinfo />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App