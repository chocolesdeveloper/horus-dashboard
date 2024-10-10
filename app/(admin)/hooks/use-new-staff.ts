import { create } from "zustand";

interface NewStaffStatus {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useNewStaff = create<NewStaffStatus>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
