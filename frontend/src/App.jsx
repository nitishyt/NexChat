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
import LayoutWrapper from './components/LayoutWrapper'

function App() {
  const { authenticatedUser, isLoading } = useAuthUser()
  const isAuth = !!authenticatedUser
  const isOnboarded = authenticatedUser?.isOnboarded ?? false

  if (isLoading) return <LoadingPage />

  return (
    <main>
      <Routes>
        {/* Public routes */}
        <Route
          path="/signup"
          element={
            isAuth ? (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
            ) : (
              <SignupPage />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            !isAuth ? (
              <Navigate to="/login" replace />
            ) : isOnboarded ? (
              <Navigate to="/" replace />
            ) : (
              <OnboardingPage />
            )
          }
        />

        {/* Protected routes — LayoutWrapper is the ONLY place that
            checks auth/onboarded for everything nested under it */}
        <Route path="/" element={<LayoutWrapper />}>
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="connection" element={<ConnectionPage />} />
          <Route path="chat/:id?" element={<ChatPage />} />
          <Route path="requests" element={<RequestedPage />} />
          <Route path="call/:id?" element={<CallPage />} />
        </Route>

        <Route path="/test" element={<TestDaisyUI />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{ className: '!bg-base-100 !text-base-content' }}
      />
    </main>
  )
}

export default App