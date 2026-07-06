import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registerUser } from "../../lib/api"
import { useNavigate } from "react-router-dom"

const useSignup = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate, isPending, error } = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            queryClient.setQueryData(['authUser'], { user: data.user })
            navigate('/onboarding', { replace: true })
        }
    })

    return { signupMutation: mutate, isPending, error }
}

export default useSignup
