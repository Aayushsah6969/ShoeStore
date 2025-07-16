import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  currentPage: 'dashboard',
  toast: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null })
}));