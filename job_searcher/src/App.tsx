import "./App.css";
import Init from "./pages/Init";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Init />} />
      {<Route path="/Register" element={<Register />} />}
    </Routes>
  );
}

export default App;
