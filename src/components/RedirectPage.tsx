import { useNavigate } from "react-router-dom"
import AccessManagement from './../pages/AccessManagement';

function RedirectPage() {
const navigation = useNavigate()

const handleNavigatePage = (data:string)=>{
    navigation(data)
}

  return (
    <div className="flex items-center justify-center bg-zinc-200 ">
      <div className="  w-full lg:w-1/4 md:w-1/2 sm:w-1/2 px-6 py-2 flex justify-evenly">
            <button onClick={()=>handleNavigatePage("/")}>
                5-day forecast
            </button>
            <button onClick={()=>handleNavigatePage("/weather-app")}>
                Weather forecast
            </button>
            <button onClick={()=>handleNavigatePage("/access-management")}>
               Access management
            </button>
    </div>
    </div>
  )
}

RedirectPage.propTypes = {}

export default RedirectPage
