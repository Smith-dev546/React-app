import { BrowserRouter as Router, Routes, Route } from "react-router";
import UpdateBootcamp from "./views/actualizar/componets/Actualizar"; // importa el componente

function App() {
  return (
    <Router>
      <Routes>
        {/* Aquí irían tus otras rutas, por ejemplo: */}
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* Ruta para actualizar un bootcamp */}
        <Route path="/bootcamps/update/:id" element={<UpdateBootcamp/>} />
      </Routes>
    </Router>
  );
}

export default App;
