import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registerUser } from "../../lib/api"
const useSignup = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        }
    })

    return { signupMutation: mutate, isPending, error }
}

export default useSignup