import { Routes, Route } from "react-router-dom"
import RutaProtegida from "./components/RutaProtegida"
//import Layout from "./components/Layout"
import Login from "./pages/Login"
import ListadoIncidente from "./pages/incidente/Listado"
import NuevoIncidente from "./pages/incidente/Nuevo"
import ListadoRol from "./pages/rol/Listado"

function App() {
  return (
   // <Layout>
      <Routes>
        <Route path='/' element={<Login/>}/>

        <Route element={<RutaProtegida/>}>
          <Route path= '/incidentes' element={<ListadoIncidente/>}/>
          <Route path="/incidentes/nuevo" element={<NuevoIncidente/>}/>
          <Route path="/roles" element={<ListadoRol/>}/>
          <Route path="/roles/nuevo" element={<NuevoRol/>}/>
          
        </Route>
      </Routes>
    //</Layout>
  )
}

export default App
