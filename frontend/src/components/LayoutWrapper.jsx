import { Navigate } from "react-router-dom"
import useAuthUser from "../hooks/useAuthUser"
import { Layout } from "./Layout.jsx"
import LoadingPage from "./LoadingPage.jsx"

function LayoutWrapper() {
  const { authenticatedUser, isLoading } = useAuthUser()

  if (isLoading) return <LoadingPage />

  if (!authenticatedUser) {
    return <Navigate to="/login" />
  }

  return <Layout />
}

export default LayoutWrapper