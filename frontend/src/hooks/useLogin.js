import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoginUser } from "../../lib/api"

const useLogin = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: LoginUser,
        onSuccess: (data) => {
    queryClient.setQueryData(["authUser"], {
        user: data.user,
    });
}
    })

    return { loginMutation: mutate, isPending, error }
}

export default useLogin