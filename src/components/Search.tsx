import { CiLocationOn, CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import useBookStore from './../../store/bookStore';

function Search() {
  const navigation = useNavigate()
  const {country} = useBookStore()
  const handleToHistory=(data:string)=>{
navigation(data)
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full lg:w-1/4 md:w-1/2 sm:w-1/2 px-6 py-2 flex">
            <button className="flex-1 text-left flex gap-1 items-center"onClick={()=>handleToHistory("/")}>
                <CiLocationOn />
                <span className="font-semibold">
                  {country}
                </span>
            </button>
            <div className="flex-1 flex items-center justify-end text-right">
            <button onClick={()=>handleToHistory("/history")}>
            <CiSearch />
            </button>
            </div>
    </div>
    </div>
  )
}


export default Search
