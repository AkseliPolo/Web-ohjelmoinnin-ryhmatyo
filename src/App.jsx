import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FeaturedMovies from './components/FeaturedMovies'
import { Routes, Route } from 'react-router-dom'
import Movieinfo from './pages/Movieinfo'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BrowsePage from './pages/BrowsePage'
import './App.css'
import GroupsPage from './pages/GroupsPage'
import GroupPage from './pages/GroupPage'
import WatchlistPage from './pages/WatchlistPage'
import SharedWatchlistPage from './pages/SharedWatchlistPage'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container mt-5 flex-grow-1">
        <Routes>
          <Route path="/" element={<FeaturedMovies />} />
          <Route path="/movies/:id" element={<Movieinfo />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/watchlist/shared/:token" element={<SharedWatchlistPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:id" element={<GroupPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App