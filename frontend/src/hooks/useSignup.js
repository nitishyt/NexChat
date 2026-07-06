import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registerUser } from "../../lib/api"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

const useSignup = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const setAccessToken = useAuthStore((s) => s.setAccessToken)

    const { mutate, isPending, error } = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setAccessToken(data.accessToken)
            queryClient.setQueryData(['authUser'], { user: data.user })
            navigate('/onboarding', { replace: true })
        }
    })

    return { signupMutation: mutate, isPending, error }
}

export default useSignup