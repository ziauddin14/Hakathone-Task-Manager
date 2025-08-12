import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      }),

      // Initialize auth state from Firebase
      initializeAuth: (user) => {
        if (user) {
          set({
            user: {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified
            },
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // only persist these fields
    }
  )
);

export default useAuthStore;
