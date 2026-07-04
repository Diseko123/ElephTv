import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AdminPage from "./pages/Admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home apiUrl={API_URL} />} />
        <Route path="/admin" element={<AdminPage apiUrl={API_URL} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
