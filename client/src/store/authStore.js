import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setAuth: (user, token) => {
    set({
      user,
      token,
      isAuthenticated: true,
    });
    // Persist to localStorage manually
    localStorage.setItem('auth-storage', JSON.stringify({ user, token, isAuthenticated: true }));
  },
  
  setToken: (token) => {
    set({ token });
    const stored = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    localStorage.setItem('auth-storage', JSON.stringify({ ...stored, token }));
  },
  
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('auth-storage');
  },
  
  // Initialize from localStorage
  init: () => {
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const { user, token, isAuthenticated } = JSON.parse(stored);
        if (user && token) {
          set({ user, token, isAuthenticated: true });
        }
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
    }
  },
}));

// Initialize on load
if (typeof window !== 'undefined') {
  useAuthStore.getState().init();
}
