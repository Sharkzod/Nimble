import { useAuthStore } from "../../stores/useAuthStore";
import { authApi } from "../../api/authApi";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  const signOut = async () => {
    try {
      // Call logout API if needed
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state
      logout();
    }
  };

  return { signOut };
};