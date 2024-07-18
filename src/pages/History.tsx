import axios from "axios";
import { useEffect, useState } from "react";
import { CiSearch, CiTrash } from "react-icons/ci";

function History() {
  const [keySearch, setKeySearch] = useState("");
  const [weather, updateWeather] = useState();
  const [invalidKey, setInvalidKey] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [refeshData, setRefeshData] = useState<number>(0);
  console.log(weather);
  const handleSearchWeather = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${keySearch}&appid=fe4feefa8543e06d4f3c66d92c61b69c`
      );
      if (response.data) {
        updateWeather(response.data);
        setInvalidKey(false);
        const countryWaetherSearch =
          response?.data?.name + "," + response?.data?.sys?.country;
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
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/weather"
        );
        console.log(response);
        setDataHistory(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [refeshData]);

  const handleDelelteHistory = async (data: string) => {
    try {
      const response = await axios.delete(
        `https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/weather/${data}`
      );
      if (response.data) {
        setRefeshData((prev) => prev + 1);
        alert("Delete successfully");
      }
    } catch (error) {
      alert("dont delete history please try agin");
    }
  };

  return (
    <div className="w-full md:w-1/2 sm:w-1/2 bg-gray-400">
      <div className="">
        <div className="flex">
          <input
            required
            type="text"
            className="shadow-lg border border-solid border-gray-300 rounded-md p-1.5 w-full hover:border-blue-600 focus:outline-0"
            placeholder="Search country or city herer ..."
            onChange={(event) => setKeySearch(event.target.value)}
          />
          <button
            className="bg-blue-600 py-2 px-4 text-white font-medium text-sm rounded-md"
            onClick={() => handleSearchWeather}
          >
            {" "}
            Search
          </button>
        </div>
        {invalidKey && (
          <div className="text-red-800 text-sm">Invalid country or city</div>
        )}
        <div>
          <span className="font-medium">Search History</span>
          <div className="bg-white px-2 py-6 rounded-md flex flex-col gap-3">
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
                      <CiSearch />
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
  );
}

History.propTypes = {};

export default History;
