import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdatePedidos from "../components/UpdatePedidos"
import { useAuth } from "../context/AuthContext"
import { TECNICOS } from "../constants/tecnicos"


const Home = () => {
  const [pedidos, setPedidos] = useState([])
  // const [user, setUser] = useState(true)
  const {user, token} = useAuth()  //estado global
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [filters, setFilters] = useState({
    cliente: "",
    dniCliente: 0,
    tecnicoAsignado: "",
    fechaDesde: "",
    fechaHasta: "",
    estado:""
  })

  
  
  const fetchingPedidos = async (query="") => {
    try {
      // const response = await fetch(`https://cli-l4ad.onrender.com/pedidos?${query}`, {
      //   method: "GET"
      // })
      const response = await fetch(`http://localhost:3000/pedidos?${query}`, {
        method: "GET"
      })
      const dataPedidos = await response.json()
      setPedidos(dataPedidos.data.reverse())
    } catch (e) {
      console.log("Error al traer los pedidos :(")
    }
  }

  useEffect(() => {
    fetchingPedidos()
  }, [])

  const deletePedido = async (idPedido) => { 
    
    if (!confirm("Esta seguro de que quieres borrar el pedido")) {
      return
    }
    
    try {
      const response = await fetch(`http://localhost:3000/pedidos/${idPedido}`, {
        method: "DELETE",
        headers: {
          Authorization:`Bearer ${token}`
        }
      })
      // const response = await fetch(`https://cli-l4ad.onrender.com/pedidos/${idPedido}`, {
      //   method: "DELETE"
      // })
      const dataResponse = await response.json()

      if (dataResponse.error) { 
        return alert(dataResponse.error)
      }


      //filtrado local - si estuvieramos en un entorno global habria que llamar a nuevamente a la bd.
      setPedidos(pedidos.filter((p) => p._id !== idPedido))
      alert(`${dataResponse.data.cliente} borrado con éxito.`)
    } catch (error) {
      console.log("Error al borrar el pedido.")
    }
  }

  const handleUpdatePedidos = (p) => {
    setSelectedPedido(p)
  }

  const handleChange = (e) => { 
    setFilters({
      ...filters,
      [e.target.name]:e.target.value
    })
  }
  const handleSubmit=(e)=>{ 
    e.preventDefault()
    console.log("Aplicando filtros y recuperando datos")
    const query = new URLSearchParams()
    if (filters.cliente) query.append("cliente", filters.cliente)
    if (filters.dniCliente) query.append("dniCliente", filters.dniCliente)
    if (filters.tecnicoAsignado) query.append("tecnicoAsignado", filters.tecnicoAsignado)
    if (filters.estado) query.append("estado", filters.estado)
    //no puse lo de la fecha
    fetchingPedidos(query.toString())

  }
  const handleResetFilter = () => { 
    setFilters({
      cliente: "",
      dniCliente: 0,
      tecnicoAsignado: "",
      fechaDesde: "",
      fechaHasta: "",
      estado:""
    })
  }

  return (
    <Layout>
      <div className="page-banner">Nuestros Pedidos</div>

      <section className="page-section">
        <p>
          Bienvenido { user && user.email} a nuestra tienda. Aquí encontrarás una amplia variedad de productos diseñados para satisfacer
          tus necesidades. Nuestro compromiso es ofrecer calidad y confianza.
        </p>
      </section>

      <section className="filters-form">
        <form className="filters-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="cliente"
            placeholder="Cliente"
            value={filters.cliente }
            onChange={handleChange} />
          <input
            type="text"
            name="dniCliente"
            placeholder="DNI"
            value={filters.dniCliente }
            onChange={handleChange} />
          <select
            name="tecnicoAsignado"
            value={filters.tecnicoAsignado }
            onChange={handleChange}>
            <option defaultValue>Técnicos Disponibles</option>
            { 
              TECNICOS.map((tecnicoAsignado) => <option key={tecnicoAsignado.id} value={tecnicoAsignado.value}>{ tecnicoAsignado.content}</option>)
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
              value="Pendiente"
              id="1"
              checked
              onChange={handleChange} />
            <label for="1">Pendiente</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="estado"
              value="Completo"
              id="2"
              onChange={handleChange} />
          <label for="2">Completado</label>
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
    </Layout>
  )
}

export default Home