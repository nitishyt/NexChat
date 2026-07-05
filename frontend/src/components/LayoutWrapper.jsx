import useAuthUser from "../hooks/useAuthUser"

function LayoutWrapper() {
  const { authenticatedUser, isLoading } = useAuthUser()

  if (isLoading) return <LoadingPage />

  if (!authenticatedUser) {
    return <Navigate to="/login" />
  }

  return <Layout />
}

export default LayoutWrapper