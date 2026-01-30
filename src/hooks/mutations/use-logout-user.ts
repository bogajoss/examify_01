import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/actions/auth";

export const useLogoutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
