import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import History from "./pages/History";
import HomePage from "./pages/HomePage";
import Search from "./components/Search";
import RedirectPage from "./components/RedirectPage";
import WeatherApp from "./pages/WeatherApp";

function App() {
  return (
    <>
      <BrowserRouter>
      <RedirectPage />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<History />} />
          <Route path="/weather-app" element={<WeatherApp />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;