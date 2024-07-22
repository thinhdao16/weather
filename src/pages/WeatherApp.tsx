import axios from "axios";
import { useEffect, useRef, useState } from "react";

function WeatherApp() {
  const [openHistory, setOpenHistory] = useState(false);
  const [data, setData] = useState<any>();
  const [valueSearch, setValueSearch] = useState("");
  const [dataSearch, setDataSearch] = useState<any>();

  const apiKey = "fe4feefa8543e06d4f3c66d92c61b69c";
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${valueSearch}&limit=5&appid=${apiKey}`;

  console.log(data);
  const toggleRef = useRef<any>(null);
  const handleOpenHistory = () => {
    setOpenHistory(true);
  };

  const handleClickOutside = (event: any) => {
    if (toggleRef.current && !toggleRef.current.contains(event.target)) {
      setOpenHistory(false);
    }
  };

  const handleSearchWeatherToData = async () => {
    try {
      const response = await axios.get(url);
      if (response.data) {
        console.log(response);

        setDataSearch(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchWeather = async (name: string) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=fe4feefa8543e06d4f3c66d92c61b69c`
      );
      if (response.status === 200) {
        console.log(response.data);
        const postResponse = await axios.post("add-new", response.data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Post response:", postResponse?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  }, []);
  return (
    <div className=" w-full bg-zinc-200 flex justify-center items-center">
      <div className="w-2/3 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="text-left font-serif">
            <span className="text-4xl block font-medium  ">
              Weather forecast
            </span>
            <span className="text-gray-400  ">
              Simple but powerful weather forcasting service based on
              OpenWeatherMap API
            </span>
          </div>
          <div className="flex w-full relative justify-end">
            <input
              type="text"
              className="w-80 h-12 bg-gray-300 p-4 rounded-l-lg focus:outline-none focus:border focus:border-solid focus:border-main"
              placeholder="Search"
              onClick={handleOpenHistory}
              ref={toggleRef}
              onChange={(e) => setValueSearch(e.target.value)}
            />
            <button
              className="w-12 h-12 p-4 rounded-r-lg bg-main justify-center items-center flex text-white "
              onClick={handleSearchWeatherToData}
            >
              <img
                className="text-white"
                src="../../src/assets/icon_weather_app/Search.png"
                alt=""
              />
            </button>
            {openHistory && (
              <div
                className="absolute top-[55px] w-[368px] bg-white rounded-lg shadow-lg z-50"
                ref={toggleRef}
              >
                {dataSearch?.map((data_item: any) => (
                  <div className=" hover:bg-gray-100">
                    <div className="flex justify-between p-6 items-center ">
                      <div className="text-start">
                        <span className="font-medium">
                          {data_item?.name}, {data_item?.country}
                        </span>
                        <p className="text-gray-400">
                          {data_item?.lat}, {data_item?.lon}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSearchWeather(data_item?.name)}
                      >
                        <img
                          src="../../src/assets/icon_weather_app/Add.png"
                          alt=""
                        />
                      </button>
                    </div>
                    <hr className=" mx-6" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-8">
          {data?.map((data_item: any) => (
            <div className="rounded-3xl bg-white shadow-md ">
              <div className="p-7">
                <div className="flex justify-between items-center">
                  <span className="text-main text-3xl">{data_item?.name}</span>
                  <button className="bg-white w-12 h-12 rounded-full border border-solid border-gray-400 flex items-center justify-center">
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
              <div className="p-7">
                <div className="flex items-center gap-7 ">
                  <div className=" text-gray-400 flex gap-1">
                    <img
                      src="../../src/assets/icon_weather_app/Wind.png"
                      alt=""
                    />{" "}
                    <span className="block text-black ">
                      {data_item?.wind?.speed} m/s
                    </span>
                  </div>
                  <div className=" text-gray-400 flex gap-1">
                    <img
                      src="../../src/assets/icon_weather_app/Humidity.png"
                      alt=""
                    />{" "}
                    <span className="block text-black ">
                      {data_item?.main?.humidity}%
                    </span>
                  </div>

                  <div className=" text-gray-400 flex gap-1">
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
