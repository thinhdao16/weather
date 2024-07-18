import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import History from "./pages/History";
import HomePage from "./pages/HomePage";
import Search from "./pages/Search";

function App() {
  return (
    <>
      <BrowserRouter>
        <Search />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="history" element={<History />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
