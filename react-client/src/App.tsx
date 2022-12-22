import { Box, Fade } from '@chakra-ui/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './features/layout/Header'
import {

  Landing,
  Dashboard,
  
  NotFound,
  NotImplemented,

  Verify,
  Forms,
  AuthWall,

  Quizzes,

  Profile,

} from './pages'

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
          <Route path='/' element={<Landing />} />
          <Route path='/dashboard' element={<Dashboard />} />

          {/* Auth */}
          <Route path="/authwall" element={<AuthWall />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path='/login' element={<Forms isLogin />} />
          <Route path='/register' element={<Forms />} />

          {/* Quizzes */}
          <Route path='/quizzes' element={<Quizzes />} />

          {/* Users */}
          <Route path='/user/:username' element={<Profile />} />

          {/* 404 */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Fade>

    </Box>
  )
}

export default App
