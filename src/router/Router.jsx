import { BrowserRouter , Routes, Route } from "react-router-dom";
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import AboutUs from "../pages/AboutUs"
import AddPedido from "../pages/AddPedido"
import NotFound from "../pages/NotFound"
import ProtectedRoute from "../components/ProtectedRoute";

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/nosotros" element={<AboutUs />} />
        <Route path="/agregar-pedido"
          element={
            <ProtectedRoute>
              <AddPedido />
            </ProtectedRoute>
            }
        />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export { RouterApp}