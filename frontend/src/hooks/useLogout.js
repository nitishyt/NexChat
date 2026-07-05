import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logoutUser } from "../../lib/api"

const useLogout = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
           await queryClient.invalidateQueries({ queryKey: ['authUser'] })
           queryClient.removeQueries()
           window.location.href = '/login'
        }
    })

    return { logoutMutation: mutate, isPending, error }
}

export default useLogout