import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogin } from "@/actions/auth";

export const useAdminLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Record<string, string>) => adminLogin(credentials),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(["currentUser"], data.user);
      }
    },
  });
};
