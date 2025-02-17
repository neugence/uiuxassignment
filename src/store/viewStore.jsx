import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useViewStore = create(
  persist(
    (set) => ({
      view: 'kanban',
      setView: (newView) => set({ view: newView }),
    }),
    {
      name: 'view-storage',
    }
  )
);