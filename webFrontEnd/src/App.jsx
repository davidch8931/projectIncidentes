import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import RutaProtegida from "./components/RutaProtegida";

import ListadoIncidente from "./pages/incidente/Listado";
import NuevoIncidente from "./pages/incidente/Nuevo";
import EditarIncidente from "./pages/incidente/Editar";

import ListadoRol from "./pages/rol/Listado";
import NuevoRol from "./pages/rol/Nuevo";

import ListadoRecurso from "./pages/rol/Listado";
import NuevoRecurso from "./pages/rol/Nuevo";

import ListadoTipoRecurso from "./pages/tiporecurso/Listado";
import NuevoTipoRecurso from "./pages/tiporecurso/Nuevo";

import ListadoTipoIncidente from "./pages/tipoincidente/Listado";
import NuevoTipoIncidente from "./pages/tipoincidente/Nuevo";

function App() {
  return (
    <Routes>
    
      <Route path="/" element={<Login />} />

      
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/incidentes" element={<ListadoIncidente />} />
          <Route path="/incidentes/nuevo" element={<NuevoIncidente />} />
          <Route path="/incidentes/editar/:id" element={<EditarIncidente />} />

          <Route path="/roles" element={<ListadoRol />} />
          <Route path="/roles/nuevo" element={<NuevoRol />} />

          <Route path="/recursos" element={<ListadoRecurso />} />
          <Route path="/recursos/nuevo" element={<NuevoRecurso />} />

          <Route path="/tipos/recurso" element={<ListadoTipoRecurso />} />
          <Route path="/tipos/recurso/nuevo" element={<NuevoTipoRecurso />} />

          <Route path="/tipos-incidentes" element={<ListadoTipoIncidente />} />
          <Route path="/tipos/incidente/nuevo" element={<NuevoTipoIncidente />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
