import { useState } from "react"
import Layout from "../components/Layout"
import { data, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AddPedido = () => {
  const [formData, setFormData] = useState({
    cliente: "",
    dniCliente: "",
    direccion: "",
    tecnicoAsignado: "",
    fechaProgramada: "",
    estado:""
  })

  const navigate = useNavigate()
  const { token } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = {
      ...formData,
      dniCliente: Number(formData.dniCliente)
    }
    console.log("dataToSend:",dataToSend)
    try {

      const response = await fetch(`http://localhost:3000/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      })

      // const response = await fetch(`https://cli-l4ad.onrender.com/pedidos`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization:`Bearer ${token}`
      //   },
      //   body: JSON.stringify(dataToSend)
      // })
      
      if (!response.ok) {
        alert("❌ Error al cargar el pedido")
        return
      }

      alert("✅ Éxito al guardar el nuevo pedido")
      setFormData({
        cliente: "",
        dniCliente: "",
        direccion: "",
        tecnicoAsignado: "",
        fechaProgramada: "",
        estado:""
      })
      navigate("/")
    } catch (error) {

    }
  }

  const handleChange = (e) => {
    const nombreDeInput = e.target.name
    // console.log(nombreDeInput)
    setFormData(
      {
        ...formData,
        [nombreDeInput]: e.target.value
      })
  }

  return (
    <Layout>
      <div className="page-banner">Agregar Nuevo Pedido</div>

      <section className="page-section">
        <form className="form-container"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            type="text"
            placeholder="Cliente"
            name="cliente"
            minLength={3}
            maxLength={20}
            onChange={(e) => handleChange(e)}
            value={formData.cliente}
          />
          <input
            type="number"
            placeholder="DNI"
            name="dniCliente"
            minLength={3}
            maxLength={200}
            onChange={(e) => handleChange(e)}
            value={formData.dniCliente}
          />
          <input
            type="text"
            placeholder="Direccion"
            name="direccion"
            min={0}
            onChange={(e) => handleChange(e)}
            value={formData.direccion}
          />
          <input            
            type="text"
            placeholder="Tecnico Asignado"
            name="tecnicoAsignado"
            min={0}
            onChange={(e) => handleChange(e)}
            value={formData.tecnicoAsignado}
          />
          <input
            type="text"
            placeholder="Fecha Programada"
            name="fechaProgramada"
            minLength={3}
            maxLength={20}
            onChange={(e) => handleChange(e)}
            value={formData.fechaProgramada}
          />
          <input
            type="text"
            placeholder="Estado"
            name="estado"
            minLength={3}
            maxLength={20}
            onChange={(e) => handleChange(e)}
            value={formData.estado}
          />
          <button type="submit">Agregar</button>
        </form>
      </section>
    </Layout>
  )
}

export default AddPedido