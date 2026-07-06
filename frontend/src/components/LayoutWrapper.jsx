import { Navigate } from "react-router-dom"
import useAuthUser from "../hooks/useAuthUser"
import Layout from "./Layout"
import LoadingPage from "./LoadingPage"

function LayoutWrapper() {
  const { authenticatedUser, isLoading } = useAuthUser()

  if (isLoading) return <LoadingPage />

  if (!authenticatedUser) {
    return <Navigate to="/login" replace />
  }

  if (!authenticatedUser.isOnboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return <Layout />
}

export default LayoutWrapper