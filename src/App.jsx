import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Login from './Login'
import PrivateRoutes from './PrivateRoutes'
import Home from './Home'
import OnlineWrapper from './OnlineWrapper'
import Profile from './Profile'
import Friends from './Friends'
import Search from './Search'
import styled from 'styled-components'
import Game from './Game'

function App() {
  const Container = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content: space-between;
  `
  return (
    <Container>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="*" element={<Navigate to={"/home"}/>}/>
            <Route path="/login" element={<Login />}/>  
            {/* Create account */}
            {/* Home Page not loged in */}
            <Route element={<PrivateRoutes />} >
              <Route element={<OnlineWrapper />} >
                <Route path="home" element={<Home/>} />
                <Route path="user/:id" element={<Profile/>}/>
                <Route path='user/:id/friends' element={<Friends/>}/>
                <Route path='search' element={<Search/>}/>
                <Route path='/game/:id' element={<Game/>}/>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </Container>
  )
}

export default App
