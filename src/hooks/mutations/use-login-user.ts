import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "@/actions/auth";

export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Record<string, string>) => loginUser(credentials),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(["currentUser"], data.user);
      }
    },
  });
};
