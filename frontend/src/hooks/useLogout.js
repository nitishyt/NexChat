import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logoutUser } from "../../lib/api"
import { useNavigate } from "react-router-dom"
import { StreamChat } from "stream-chat"
import { useAuthStore } from "../store/authStore"

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const useLogout = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const clearAccessToken = useAuthStore((s) => s.clearAccessToken)

    const { mutate, isPending, error } = useMutation({
        mutationFn: logoutUser,
        onSuccess: async () => {
            // Disconnect Stream Chat client before clearing cache
            // so the next user login gets a clean connection
            try {
                const client = StreamChat.getInstance(STREAM_API_KEY)
                if (client.userID) await client.disconnectUser()
            } catch (e) {
                console.error("Stream disconnect error on logout:", e)
            }

            // Wipe the in-memory access token so nothing lingers after logout,
            // even if something else in the tab still holds a reference.
            clearAccessToken()

            queryClient.setQueryData(["authUser"], { user: null });
            queryClient.clear();
            navigate("/login", { replace: true });
        }
    })

    return { logoutMutation: mutate, isPending, error }
}

export default useLogout