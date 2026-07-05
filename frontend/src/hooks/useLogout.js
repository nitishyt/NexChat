import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logoutUser } from "../../lib/api"
import { useNavigate } from "react-router-dom"
const useLogout = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { mutate, isPending, error } = useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
           await queryClient.invalidateQueries({ queryKey: ['authUser'] })
           queryClient.removeQueries()
           navigate('/login')
        }
    })

    return { logoutMutation: mutate, isPending, error }
}

export default useLogout