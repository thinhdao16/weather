// src/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import History from "./pages/History";
import HomePage from "./pages/HomePage";
import RedirectPage from "./components/RedirectPage";
import WeatherApp from "./pages/WeatherApp";

const AppRoutes = () => {
  return (
    <>
      <RedirectPage />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<History />} />
        <Route path="/weather-app" element={<WeatherApp />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
