import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdatePedidos from "../components/UpdatePedidos"
import { useAuth } from "../context/AuthContext"
import { TECNICOS } from "../constants/tecnicos"
import { ToastMessage } from "../components/ToastMessage"


const Home = () => {

  const initialErrorState = {
    success: null,
    notification: null,
    error: {
      fetch: null,
      delete: null
    }
  }


  const [pedidos, setPedidos] = useState([])
  // const [user, setUser] = useState(true)
  const { user, token } = useAuth()  //estado global
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [filters, setFilters] = useState({
    cliente: "",
    dniCliente: 0,
    tecnicoAsignado: "",
    fechaDesde: "",
    fechaHasta: "",
    estado: []
  })

   

  const [responseServer, setResponseServer] = useState(initialErrorState)
  
  
  
  
  const fetchingPedidos = async (query = "") => {
    console.log(query,"query")
    setResponseServer(initialErrorState)
    try {
      // const response = await fetch(`https://cli-l4ad.onrender.com/pedidos?${query}`, {
      //   method: "GET"
      // })
      const response = await fetch(`http://localhost:3000/pedidos?${query}`, {
        method: "GET"
      })
      const dataPedidos = await response.json()
      console.log(dataPedidos,"dataPedidos del fetching ")

      setPedidos(dataPedidos.data.reverse())
      setResponseServer({
        success: true,
        notification: "Exito carga de pedido",
        error: {
          ...responseServer.error,
          fetch: true
        }
      })
    } catch (e) {
      setResponseServer({
        success: false,
        notification: e.message,
        error: {
          ...responseServer.error,
          fetch: false
        }
      })
      
    }
  }


  useEffect(() => {
    fetchingPedidos()
  }, [])

  const deletePedido = async (idPedido) => {
    setResponseServer(initialErrorState)
    
    if (!confirm("Esta seguro de que quieres borrar el pedido")) {
      return
    }
    
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${idPedido}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // const response = await fetch(`https://cli-l4ad.onrender.com/pedidos/${idPedido}`, {
      //   method: "DELETE",
      //   headers: {
      //     Authorization:`Bearer ${token}`
      //   }
      // })
      const dataResponse = await response.json()

      if (dataResponse.error) {
        return alert(dataResponse.error)
      }


      //filtrado local - si estuvieramos en un entorno global habria que llamar a nuevamente a la bd.
      setPedidos(pedidos.filter((p) => p._id !== idPedido))
      alert(`${dataResponse.data.cliente} borrado con éxito.`)
    } catch (error) {
      setResponseServer({ ...error, delete: "error al borrar el pedido" })
      
    }
  }

  const handleUpdatePedidos = (p) => {
    setSelectedPedido(p)
  }

  

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    // checkboxes "estado"
    if (name === "estado") {
      let estadoActual;

      if (checked) {
        //se marca
        estadoActual = [...filters.estado, value];
      } else {
        // se desmarca
        estadoActual = filters.estado.filter(v => v !== value);
      }

      setFilters({
        ...filters,
        estado: estadoActual
      });

    } else {
      // inputs de text-select
      setFilters({
        ...filters,
        [name]: value
      });
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const query = new URLSearchParams()
    if (filters.cliente) query.append("cliente", filters.cliente)
    if (filters.dniCliente) query.append("dniCliente", filters.dniCliente)
    if (filters.tecnicoAsignado) query.append("tecnicoAsignado", filters.tecnicoAsignado)
    filters.estado.forEach(est => query.append("estado", est))
    if (filters.fechaDesde) query.append("fechaDesde", filters.fechaDesde)
    if (filters.fechaHasta) query.append("fechaHasta", filters.fechaHasta)
   
   
    fetchingPedidos(query.toString())
    
  }
  const handleResetFilter = () => {
    setFilters({
      cliente: "",
      dniCliente: 0,
      tecnicoAsignado: "",
      fechaDesde: "",
      fechaHasta: "",
      estado: []
    })
  }

    return (
      <Layout>
        <div className="page-banner">Nuestros Pedidos</div>

        <section className="page-section">
          <p>
            Bienvenido {user && user.email} a nuestra tienda. Aquí encontrarás una amplia variedad de productos diseñados para satisfacer
            tus necesidades. Nuestro compromiso es ofrecer calidad y confianza.
          </p>
        </section>

        <section className="filters-form">
          <form className="filters-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="cliente"
              placeholder="Cliente"
              value={filters.cliente}
              onChange={handleChange} />
            <input
              type="text"
              name="dniCliente"
              placeholder="DNI"
              value={filters.dniCliente}
              onChange={handleChange} />
            <select
              name="tecnicoAsignado"
              value={filters.tecnicoAsignado}
              onChange={handleChange}>
              <option defaultValue>Técnicos Disponibles</option>
              {
                TECNICOS.map((tecnicoAsignado) => <option key={tecnicoAsignado.id} value={tecnicoAsignado.value}>{tecnicoAsignado.content}</option>)
              }
            </select>
            <input
            type="text"
            name="fechaDesde"
            value={filters.fechaDesde }
            placeholder="Fecha Desde"
            onChange={handleChange} />
          <input
            type="text"
            name="fechaHasta"
            value={filters.fechaHasta }
            placeholder="Fecha Hasta"
            onChange={handleChange} />
            <div>
              <input type="checkbox"
                name="estado"
                value="pendiente"
                checked={filters.estado.includes("pendiente")}
                id="pendiente"
                onChange={handleChange} />
              <label htmlFor="pendiente">Pendiente</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="estado"
                value="completado"
                checked={filters.estado.includes("completado")}
                id="completado"
                onChange={handleChange} />
              <label htmlFor="completado">Completado</label>
            </div>
            <button type="submit">Aplicar Filtro</button>
            <button type="button" onClick={handleResetFilter}>Cancelar</button>
          </form>
        </section>


        {
          selectedPedido &&
          <UpdatePedidos
            pedido={selectedPedido}
            onClose={() => setSelectedPedido(null)}
            onUpdate={fetchingPedidos}
          />
        }

        <section className="products-grid">
          {pedidos.map((p, i) => (
            <div key={i} className="product-card">
              <h3>{p.cliente}</h3>
              <p>{p.dniCliente}</p>
              <p><strong>Direccion:</strong> {p.direccion}</p>
              <p><strong>Tecnico Asignado:</strong> {p.tecnicoAsignado}</p>
              <p><strong>Fecha Programada:</strong> {p.fechaProgramada}</p>
              <p><strong>Estado:</strong> {p.estado}</p>
              {
                user && <div className="cont-btn">
                  <button onClick={() => handleUpdatePedidos(p)}>Actualizar</button>
                  <button onClick={() => deletePedido(p._id)}>Borrar</button>
                </div>
              }
            </div>
          ))}
        
        </section>

        {!responseServer.error.fetch && <ToastMessage color={"red"} msg={responseServer.notification} />}
      
        {responseServer.success && <ToastMessage color={"green"} msg={responseServer.notification} />}

      </Layout>
    )
  }

export default Home