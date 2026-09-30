import Init from "./pages/Init";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Candidaturas from "./pages/Candidaturas";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Init />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/candidaturas" element={<Candidaturas />} />
      <Route path="/applications" element={<Candidaturas />} />
    </Routes>
  );
}

export default App;
