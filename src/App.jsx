import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container mt-5 flex-grow-1">
        <h1 className="text-primary">Tervetuloa verkkosivulle!</h1>
        <p className="lead">Bootstrap toimii nyt projektissasi.</p>
        <button className="btn btn-success">Kokeile painiketta</button>
      </main>

      <Footer />
    </div>
  )
}

export default App