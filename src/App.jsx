import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./views/login/components/Login";
import Dashboard from "./views/home/componets/Home";
import UpdateBootcamp from "./views/crear/components/Crear";
import EliminarBootcamp from "./views/eliminar/componets/Eliminar";
import CreateBootcamp from "./views/actualizar/componets/Actualizar";

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bootcamps/update/:id" element={<UpdateBootcamp />} />
        <Route path="/bootcamps/create" element={<CreateBootcamp />} />
        <Route path="/bootcamps/delete/:id" element={<EliminarBootcamp />} />
        <Route path="/" element={<Dashboard />} /> {/* Ruta por defecto */}
      </Routes>
    </Router>
  );
}

export default App;
