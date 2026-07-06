import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      queryClient.setQueryData(["authUser"], {
        user: data.user,
      });

      // Ensure the auth query is updated
      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      navigate("/", { replace: true });
    },
  });

  return { loginMutation: mutate, isPending, error };
};

export default useLogin;