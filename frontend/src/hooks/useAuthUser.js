import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../../lib/axios"
import { FetchAuthUser } from "../../lib/api"

 
 
function useAuthUser() { 
 const authUser = useQuery({
    queryKey:['authUser'],
    queryFn: FetchAuthUser,
    retry:false,
    staleTime: 0,
  })
  return {authenticatedUser: authUser.data?.user,isLoading: authUser.isLoading }
}

export default useAuthUser
