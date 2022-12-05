import { Box } from '@chakra-ui/react'
import { Link, Route, Routes } from 'react-router-dom'
import Header from './features/layout/Header.component'
import { Main, NotFound, Verify } from './pages'

function App() {
  return (
    <Box>
      <Header />


      {/* Routes */}
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

    </Box>
  )
}

export default App
