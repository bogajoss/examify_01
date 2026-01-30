import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/actions/auth";

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (data: Record<string, string>) => registerUser(data),
  });
};
