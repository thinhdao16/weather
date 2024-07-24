import axios from 'axios';
import { LoadingCustom } from './LoadingCustom';
import useWeatherAppStore from '../../../store/weatherAppStore';
import { useEffect, useRef, useState } from 'react';

function Search() {
  const [valueSearch, setValueSearch] = useState("");
  const [dataSearch, setDataSearch] = useState<any>();
  const [openHistory, setOpenHistory] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errorLog, setErrorLog] = useState(false)

const{setReload} = useWeatherAppStore()

  const toggleRef = useRef<any>(null);

  const apiKey = "85ca72f1b6e7246de11846015225c31d";
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${valueSearch}&limit=3&appid=${apiKey}`;
  const handleSearchWeatherToData = async () => {
    try {
      setLoading(true)
      setErrorLog(false)
    setOpenHistory(true);

      const response = await axios.get(url);
      if (response.data) {
        setDataSearch(response?.data);
        setLoading(false)
        if (response.data?.length === 0) {
          setErrorLog(true)
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
      setErrorLog(true)
    }
  };

  const handleSearchWeather = async (name: string) => {
    console.log(name)
    try {
      const response = await axios.get(
       `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=85ca72f1b6e7246de11846015225c31d`
      );
      if (response.status === 200) {
        const dataSave = response.data
        console.log(dataSave)
        const postResponse = await axios.post("/api/messages", JSON.stringify({ dataSave }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        console.log("Post response:", postResponse?.data);
        setReload((prev) => 1 + prev)
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleOpenHistory = () => {
    setOpenHistory(true);
  };

  const handleClickOutside = (event: any) => {
    console.log("first")
    if (toggleRef.current && !toggleRef.current.contains(event.target)) {
      setOpenHistory(false);
    }
  };

  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(()=>{
    if(errorLog === true || dataSearch?.length >0){
     setDataSearch([])
      setErrorLog(false)
    }
      },[valueSearch])

  return (
    <div className="flex w-full relative justify-end">
            <input
              type="text"
              className="w-80 h-12 bg-gray-300 p-4 rounded-l-lg focus:outline-none focus:border focus:border-solid focus:border-main"
              placeholder="Search"
              onClick={handleOpenHistory}
              onChange={(e) => setValueSearch(e.target.value)}
              ref={toggleRef}
            />
            <button
              className="w-12 h-12 p-4 rounded-r-lg bg-main justify-center items-center flex text-white "
              onClick={handleSearchWeatherToData}
              ref={toggleRef}
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
                {
                  loading ? (
                    <div className="p-6 flex justify-center">
                      <LoadingCustom />
                    </div>
                  ) : (
                    <>
                      {
                        errorLog ? (
                          <div className="p-6">
                            <p className="font-medium">
                              City called "{valueSearch}" was not found
                            </p>
                            <span className="text-gray-400">
                              Try different city name
                            </span>
                          </div>
                        ) : (
                          <>
                            {dataSearch?.map((data_item: any, index: string) => (
                              <div className=" hover:bg-gray-100" key={index}>
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
                          </>
                        )
                      }
                    </>
                  )
                }
              </div>
            )}
          </div>
  )
}

Search.propTypes = {}

export default Search