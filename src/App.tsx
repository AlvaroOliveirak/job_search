import Init from "./pages/Init";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Candidaturas from "./pages/Candidaturas";
import Perfil from "./pages/Perfil";
import { ProtectedRoute } from "./components";

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Init />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Login" element={<Login />} />

      {/* Área protegida: sem sessão, o ProtectedRoute redireciona para /login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/candidaturas" element={<Candidaturas />} />
        <Route path="/applications" element={<Candidaturas />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/profile" element={<Perfil />} />
      </Route>
    </Routes>
  );
}

export default App;
