import "./App.css";
import Init from "./pages/Init";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Init />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
