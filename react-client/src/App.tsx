import { Link, Route, Routes } from 'react-router-dom'
import { Main, NotFound, Verify } from './pages'

function App() {
  return (
    <div>

      {/* Placeholder Nav */}
      <nav>
        <Link to="/">Main</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

    </div>
  )
}

export default App
