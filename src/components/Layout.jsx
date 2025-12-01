// src/layouts/Layout.jsx
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Layout = ({ children }) => {

  const { user, logout } = useAuth()
  const navigateUser = useNavigate()

  const handleLogout = () => { 
    logout()
    navigateUser("/inicio")
  }
  return (
    <>
      <header className="layout-header">
        <nav className="layout-nav">
          <Link to="/">Pedidos</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contactanos</Link>
                   
          { 
            !user ?
              <>
              <Link to="/inicio">Login</Link>
              <Link to="/registro">Registro</Link>  
              </>
              :
              <>
              <Link to="/agregar-pedido">Agregar Pedidos</Link>
              <button onClick={handleLogout}>Cerrar Sesion</button>
              </> 
          }
          
        </nav>
      </header>

      <main className="layout-main">
        {children}
      </main>

      <footer className="layout-footer">
        <p>Sitio desarrollado por Abigail Astradas</p>
      </footer>
    </>
  )
}

export default Layout