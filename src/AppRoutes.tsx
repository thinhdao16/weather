import RedirectPage from './components/RedirectPage'
import {  Route, Routes } from 'react-router-dom'
import History from "./pages/History";
import HomePage from "./pages/HomePage";
import WeatherApp from "./pages/WeatherApp";
import AccessManagement from './pages/AccessManagement';
function AppRoutes() {
  return (
    <>
        <RedirectPage />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<History />} />
          <Route path="/weather-app" element={<WeatherApp />} />
          <Route path="/access-management" element={<AccessManagement />} />

        </Routes>

    </>
  )
}

AppRoutes.propTypes = {}

export default AppRoutes
