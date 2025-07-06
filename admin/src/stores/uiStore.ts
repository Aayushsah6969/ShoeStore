import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  currentPage: string;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  currentPage: 'dashboard',
  toast: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null })
}));