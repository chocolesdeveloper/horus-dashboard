import { create } from "zustand";

type NewContractState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewContract = create<NewContractState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
