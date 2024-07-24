import { create } from "zustand";

interface WeatherAppStoreState {
  reload: number;
  setReload: any;
}

const useWeatherAppStore = create<WeatherAppStoreState>((set) => ({
  reload: 0,
  setReload: (newValue: number) => set({ reload: newValue }),
}));
export default useWeatherAppStore;
