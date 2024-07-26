import axios from "axios";
import { useEffect, useState } from "react";
import useWeatherAppStore from '../../store/weatherAppStore';
import Search from "../components/weather-app/Search";

function WeatherApp() {
  const [data, setData] = useState<any>();

const{reload ,setReload} = useWeatherAppStore()

 
  const handleDeleteWeather = async (id: number) => {
    try {
      const response = await axios.delete(`/api/messages/${id}`);
      if (response) {
        console.log("Deleted data:", response?.data);
        setReload((prev) => 1 + prev);
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    const dataWeather = async () => {
      try {
        const forecastResponse: any = await axios.get(`/user`);
        setData(forecastResponse.data);
      } catch (error) {
        console.error("get fail");
      }
    };
    dataWeather();
  }, [reload]);


  return (
    <div className=" w-full bg-zinc-200 flex justify-center items-center">
      <div className="w-[1000px] p-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4 items-end">
          <div className="text-left font-serif">
            <span className="text-4xl block font-medium  ">
              Weather forecast
            </span>
            <span className="text-gray-400  ">
              Simple but powerful weather forcasting service based on
              OpenWeatherMap API
            </span>
          </div>
         <Search/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-8 mt-8">
          {data?.map((data_item: any, index:number) => (
            <div className="rounded-3xl bg-white shadow-md " key={index}>
              <div className="p-4 sm:p-7 md:p-7 lg:p-7">
                <div className="flex justify-between items-center">
                  <span className="text-main text-3xl">{data_item?.name}</span>
                  <button className="bg-white w-12 h-12 rounded-full border border-solid border-gray-400 flex items-center justify-center"
                    onClick={() => handleDeleteWeather(data_item?.id)}
                  aria-label="delete"
                  >
                    <img
                      src="../../src/assets/icon_weather_app/Delete.png"
                      className=""
                      alt=""
                    />
                  </button>
                </div>
                <div className=" text-start">
                  <div className="flex items-center gap-4 ">
                    <span className="text-5xl">{`${Math.floor(
                      data_item?.main?.temp - 273
                    )}°C`}</span>
                    <img
                      className="w-12 h-12"
                      src={`https://openweathermap.org/img/wn/${data_item?.weather[0]?.icon}@2x.png`}
                      alt="error"
                    />
                  </div>
                  <span className="text-gray-400 ">
                    {`  ${data_item?.weather[0].description}`}
                  </span>
                </div>
              </div>
              <hr />
              <div className="p-4 sm:p-7 md:p-7 lg:p-7">
                <div className="flex items-center gap-7 ">
                  <div className=" text-gray-400 flex gap-1 items-center">
                    <img
                      src="../../src/assets/icon_weather_app/Wind.png"
                      alt=""
                    />{" "}
                    <span className="block text-black ">
                      {data_item?.wind?.speed} m/s
                    </span>
                  </div>
                  <div className=" text-gray-400 flex gap-1 items-center">
                    <img
                      src="../../src/assets/icon_weather_app/Humidity.png"
                      alt=""
                    />{" "}
                    <span className="block text-black ">
                      {data_item?.main?.humidity}%
                    </span>
                  </div>

                  <div className=" text-gray-400 flex gap-1 items-center">
                    <img
                      src="../../src/assets/icon_weather_app/Pressure.png"
                      alt=""
                    />{" "}
                    <span className="block text-black ">
                      {data_item?.visibility} hPa{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

WeatherApp.propTypes = {};

export default WeatherApp;