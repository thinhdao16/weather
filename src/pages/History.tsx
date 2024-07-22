import axios from "axios";
import { useEffect, useState } from "react";
import { CiSearch, CiTrash } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import useBookStore from "../../store/bookStore";
import Search from "../components/Search";

function History() {
  const [keySearch, setKeySearch] = useState("");
  const [invalidKey, setInvalidKey] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [refeshData, setRefeshData] = useState<number>(0);
  const { setCountry } = useBookStore()
  const navigation = useNavigate()
  const handleSearchWeather = async () => {

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${keySearch}&appid=fe4feefa8543e06d4f3c66d92c61b69c`
      );
      if (response.data) {
        console.log(response)

        setInvalidKey(false);
        const countryWaetherSearch =
          response?.data?.name + "," + response?.data?.sys?.country;
        navigation("/")
        setCountry(response?.data?.name)
        const postResponse = await axios.post(
          "https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/weather",
          {
            country: countryWaetherSearch,
          }
        );
        console.log("Post response:", postResponse?.data);
      }
    } catch (error) {
      console.error(error);
      setInvalidKey(true);
    }
  };

  const handleDelelteHistory = async (data: string) => {
    try {
      const response = await axios.delete(
        `https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/weather/${data}`
      );
      if (response.data) {
        setRefeshData((prev) => prev + 1);
      }
    } catch (error) {
      alert("dont delete history please try agin");
    }
  };

  const handleSearchWeatherToData = async (data:string) => {

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=fe4feefa8543e06d4f3c66d92c61b69c`
      );
      if (response.data) {
        console.log(response)

        setInvalidKey(false);
        navigation("/")
        setCountry(response?.data?.name)

      }
    } catch (error) {
      console.error(error);
      setInvalidKey(true);
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/weather"
        );
        setDataHistory(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [refeshData]);



  return (
   <>
   <Search/>
   <div className="  flex flex-col justify-center items-center bg-gray-200">
 <div className="w-full lg:w-1/4 md:w-1/2 sm:w-1/2  px-6 py-4">
      <div className="flex gap-2">
        <input
          required
          type="text"
          className="shadow-md border border-solid border-gray-300 rounded-md p-1.5 w-full hover:border-blue-600 focus:outline-0"
          placeholder="Search country or city herer ..."
          onChange={(event) => setKeySearch(event.target.value)}
        />
        <button
          className="shadow-md bg-blue-600 py-2 px-4 text-white font-medium text-sm rounded-md"
          onClick={handleSearchWeather}
        >
          {" "}
          Search
        </button>
      </div>
      {invalidKey && (
        <div className="text-red-800 text-sm text-left">Invalid country or city</div>
      )}
      <div className="mt-9 text-start">
        <span className="font-medium">Search History</span>
        <div className="bg-white mt-2 px-4 py-6 rounded-xl shadow-md flex flex-col gap-6">
          {dataHistory?.length === 0 ? (
            <div>nothing</div>
          ) : (
            dataHistory?.map(
              (data: { country: string; id: string }, index: number) => (
                <div
                  className="flex items-center justify-between"
                  key={index}
                >
                  <span>{data?.country}</span>
                  <div className="flex gap-3">
                    <button
                    onClick={()=>handleSearchWeatherToData(data?.country)}
                    >
                    <CiSearch />

                    </button>
                    <button onClick={() => handleDelelteHistory(data?.id)}>
                      <CiTrash />
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
    </div>
   </>
   
  );
}

History.propTypes = {};

export default History;