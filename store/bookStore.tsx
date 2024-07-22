import { create } from "zustand";

interface BookStoreState {
  country: string;
  setCountry: (newCountry: string) => void;
}

const useBookStore = create<BookStoreState>((set) => ({
  country: "" || "Ho Chi Minh City, VN",
  setCountry: (newCountry) => set({ country: newCountry }),
}));
export default useBookStore;