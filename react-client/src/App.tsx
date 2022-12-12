import { Box, Fade } from '@chakra-ui/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './features/layout/Header.component'
import { Main, NotFound, Verify } from './pages'
import Forms from './pages/auth/Forms';
import NotImplemented from './pages/NotImplemented';

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
          {/* Main */}
          <Route path='/' element={<Main />} />

          {/* Auth */}
          <Route path="/verify/:token" element={<Verify />} />
          <Route path='/login' element={<Forms isLogin />} />
          <Route path='/register' element={<Forms />} />

          {/* Quizzes */}
          <Route path='/quizzes' element={<NotImplemented />} />

          {/* 404 */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Fade>

    </Box>
  )
}

export default App
