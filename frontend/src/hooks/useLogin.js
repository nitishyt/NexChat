import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../lib/api";
import { useAuthStore } from "../store/authStore";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  const { mutate, isPending, error } = useMutation({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);

      queryClient.setQueryData(["authUser"], { user: data.user });
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      navigate("/", { replace: true });
    },
  });

  return { loginMutation: mutate, isPending, error };
};

export default useLogin;