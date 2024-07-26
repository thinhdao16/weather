import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import useBookStore from "../../store/bookStore"
import Search from "../components/Search"
function HomePage() {
    const [data, setData] = useState<any>()
    const [dataDay, setDataDay] = useState<any>()
    const { country } = useBookStore()
    const currrentDate = new Date()
    const options: any = { year: "numeric", month: "long", day: "numeric" }
    const formatDateToForm = (data: any) => {
        const format = data?.toLocaleDateString('en-US', options)
        return format
    }
    function formatDate(dateString: string) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}, ${year}`;
    }
    const apiKey = '85ca72f1b6e7246de11846015225c31d'


    const groupedSchedule = useMemo(() => {
        if (!dataDay || !dataDay.list) {
            return {};
        }
        return dataDay.list.reduce((acc:any, item:any) => {
            const day = item.dt_txt.split(' ')[0];
            const time = item.dt_txt.split(' ')[1].slice(0, -3);
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push({ ...item, time  });
            return acc;
        }, {});
     }, [dataDay]);
    useEffect(() => {
        const dataWeather = async () => {
            try {
                const [currentWeatherResponse, forecastResponse] = await Promise.allSettled([
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${apiKey}`),
                    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${country}&appid=${apiKey}`)
                ]);
                if (currentWeatherResponse.status === 'fulfilled') {
                    setData(currentWeatherResponse.value.data)
                } else {
                    console.error('Error fetching current weather:', currentWeatherResponse.reason);
                }
                if (forecastResponse.status === 'fulfilled') {
                    setDataDay(forecastResponse.value.data)
                } else {
                    console.error('Error fetching weather forecast:', forecastResponse.reason);
                }
            } catch (error) {
                console.error("get fail");
            }
        }
        dataWeather()
    }, [])


    return (
        <>
        <Search />
        <div className="bg-gray-200 px-6 py-4 flex flex-col justify-center items-center">           
            <div className=' w-full lg:w-1/4 md:w-1/2 sm:w-1/2'>
                <div className="p-4 rounded-xl bg-white shadow-md ">
                    <div className="text-start">
                        <span className="text-gray-500 font-medium">
                            {formatDateToForm(currrentDate)}
                        </span>
                    </div>
                    <div className="flex items-center justify-evenly">
                        <img src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`} alt="error" />
                        <div className="flex flex-col">
                            <span className="text-4xl font-semibold" >{`${Math.floor(data?.main?.temp - 273)}°C`}</span>
                            <span className="text-gray-500 font-medium">
                                {`  ${data?.weather[0].description}`}
                            </span>
                        </div>

                    </div>
                    <div className="flex justify-between">
                        <div className="flex-1 text-gray-400">Humidity <span className="block text-black font-medium">
                            {data?.main?.humidity}%</span></div>
                        <div className="flex-1 text-gray-400">Winds <span className="block text-black font-medium">
                            {data?.wind?.speed} m/s</span></div>
                        <div className="flex-1 text-gray-400">Visibility <span className="block text-black font-medium">
                            {data?.visibility / 1000} km  </span></div>
                    </div>
                </div>
                <div className="text-start mt-4 mb-2">
                    <span className="font-medium">5-day Forecast (3 Hours)</span>
                </div>
                <div className="p-4 rounded-xl shadow-md bg-white flex flex-col text-start">
                    <div>
                        {Object.keys(groupedSchedule).map((day: any, index) => {
                            //    console.log(day)
                            return (
                                <div key={index}>
                                    <div className="text-gray-400">
                                        {(formatDateToForm(currrentDate) === formatDate(day)) ? (<div>Today</div>)
                                            :
                                            formatDate(day) 

                                        }
                                    </div>
                                    <div className="flex-col flex">
                                        {groupedSchedule[day].map((data: any, idx: any) => {
                                            return (

                                                <div className="grid grid-cols-12 items-center">
                                                    <span  key={idx} className="font-medium col-span-1" >{data?.time}</span>
                                                    <img src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`} alt="" className="col-span-2" />
                                                    <span className="text-gray-400 col-span-4">${Math.floor(data?.main?.temp_max - 273)} / ${Math.floor(data?.main?.temp_min - 273)}°C</span>
                                               <div className="font-medium col-span-5 text-end">
                                               <span >{data?.weather[0]?.description}</span>

                                               </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>
            </div>

        </div>
        </>
        


    )
}


export default HomePage
