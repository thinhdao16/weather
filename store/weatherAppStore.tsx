import { create } from "zustand";

interface WeatherAppStoreState {

  reload:number;
  setReload: (newValue: number) => void;
}

const useWeatherAppStore = create<WeatherAppStoreState>((set) => ({

  reload:0,
  setReload:(newValue:any)=>set({reload:newValue})

}));
export default useWeatherAppStore;