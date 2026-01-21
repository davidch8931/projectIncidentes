import { Routes, Route } from "react-router-dom"

//import Layout from "./components/Layout"
import Login from "./pages/Login"
import ListadoIncidente from "./pages/incidente/Listado"
import NuevoIncidente from "./pages/incidente/Nuevo"

function App() {
  return (
   // <Layout>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path= '/incidentes' element={<ListadoIncidente/>}/>
        <Route path="/incidentes/nuevo" element={<NuevoIncidente/>}/>
      </Routes>
    //</Layout>
  )
}

export default App
