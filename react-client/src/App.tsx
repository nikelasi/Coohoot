import { Box, Fade } from '@chakra-ui/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './features/layout/Header.component'
import { Main, NotFound, Verify } from './pages'

function App() {

  const location = useLocation();

  return (
    <Box>
      <Header />

      <Fade
        key={location.pathname}
        in={true}>
        {/* Routes */}
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Fade>

    </Box>
  )
}

export default App
