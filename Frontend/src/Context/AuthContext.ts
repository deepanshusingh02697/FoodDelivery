import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER_QUERY } from "../graphql/Query";
import type { GET_CURRENT_USER_Interface } from "../graphql/Client";

export const useAuth = () => {
  const { data, loading, error } = useQuery<GET_CURRENT_USER_Interface>(
    GET_CURRENT_USER_QUERY,
  );
  const authUser = data?.GetCurrentUser;
  return { authUser, loading, error };
};
