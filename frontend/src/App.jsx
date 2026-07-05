import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage' 
import NotificationsPage from './pages/NotificationPage'
import ConnectionPage from './pages/ConnectionPage'
import ChatPage from './pages/ChatPage'
import RequestedPage from './pages/RequestPage'
import CallPage from './pages/CallPage'
import OnboardingPage from './pages/OnboardingPage' 
import { Toaster } from 'react-hot-toast'
import useAuthUser from './hooks/useAuthUser'
import LoadingPage from './components/LoadingPage'
import TestDaisyUI from './pages/TestDaisyUI'
import Layout from './components/Layout'
import LayoutWrapper from './components/LayoutWrapper'


function App() {
console.log("Rendering App");

const {authenticatedUser, isLoading} =useAuthUser()
const isboarded = authenticatedUser?.isOnboarded ?? false

if (isLoading) 
  return <LoadingPage/>

const isAuth = !!authenticatedUser
  return (
    <main>
      <Routes>
        {/* public Routes */}
        <Route path='/signup' element= {isAuth ? <Navigate to={isboarded ? '/' : '/onboarding'} /> : <SignupPage /> } />
        <Route path='/login' element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path='/' element={<Layout />}>
          <Route index element={<div style={{ color: "red", fontSize: 40 }}>HOME ROUTE</div>} />
          <Route path='notifications' element={isAuth && isboarded ? <NotificationsPage /> : <Navigate to={isAuth ? '/onboarding' : '/login'} />} />
          <Route path='connection' element={isAuth && isboarded ? <ConnectionPage /> : <Navigate to={isAuth ? '/onboarding' : '/login'} />} />
          <Route path='chat/:id?' element={isAuth && isboarded ? <ChatPage /> : <Navigate to={isAuth ? '/onboarding' : '/login'} />} />
          <Route path='requests' element={isAuth && isboarded ? <RequestedPage /> : <Navigate to={isAuth ? '/onboarding' : '/login'} />} />
          <Route path='call/:id?' element={isAuth && isboarded ? <CallPage /> : <Navigate to={isAuth ? '/onboarding' : '/login'} />} />
        </Route>
        <Route path='/onboarding' element={isAuth && !isboarded ? <OnboardingPage /> : <Navigate to={isAuth ? '/' : '/login'} />} />
        <Route path='/test' element={<TestDaisyUI />}/>
      </Routes>
      <Toaster position='bottom-right' toastOptions={{ className:'!bg-base-100 !text-base-content' }} />
    </main>
  )
}

export default App