import "./App.css";
import Init from "./pages/Init";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Init />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
}

export default App;
