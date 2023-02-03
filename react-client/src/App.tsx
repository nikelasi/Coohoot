import { Box, Fade } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './features/layout/Header'
import {

  Landing,
  Dashboard,
  
  NotFound,
  NotImplemented,

  Verify,
  ResetPassword,
  Forms,
  AuthWall,

  Discover,

  Profile,
  Quiz,
  Editor

} from './pages'

function App() {

  const location = useLocation()
  const noheadersPath = [/^\/quiz\/.*\/edit$/]

  useEffect(() => {
    console.log(location.pathname)
  }, [location.pathname])

  return (
    <Box>
      { !noheadersPath.some(re => re.test(location.pathname)) && <Header /> }

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
          <Route path='/login' element={<Forms isLogin />} />
          <Route path='/register' element={<Forms />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/password_reset/:token" element={<ResetPassword />} />

          {/* Quizzes */}
          <Route path='/discover' element={<Discover />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/quiz/:quizId/edit" element={<Editor />} />

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
