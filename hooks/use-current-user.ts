import { useSession } from "next-auth/react";

type CurrentUser = {
  isLoading: boolean;
  isAuthenticated: boolean;
  id: string | null;
  name: string | null;
  email: string | null;
  avatar: string | null;
};

export function useCurrentUser(): CurrentUser & { isLoading: boolean; isAuthenticated: boolean } {
  const { data: session, status } = useSession();

  return {
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    id: session?.user?.id || null,
    name: session?.user?.name || null,
    email: session?.user?.email || null,
    avatar: session?.user?.image || null,
  };
}