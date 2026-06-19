import { create } from "zustand";

type BookingStore = {
  selectedRoute: string;
  setSelectedRoute: (route: string) => void;
};

export const useBookingStore = create<BookingStore>((set) => ({
  selectedRoute: "",
  setSelectedRoute: (route) => set({ selectedRoute: route }),
}));
