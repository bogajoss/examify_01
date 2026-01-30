import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/actions/auth";

export const useFetchUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetchCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
