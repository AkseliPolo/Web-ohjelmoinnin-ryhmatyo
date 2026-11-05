import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FeaturedMovies from './components/FeaturedMovies'
import './App.css'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container mt-5 flex-grow-1">
        <FeaturedMovies />
      </main>

      <Footer />
    </div>
  )
}

export default App