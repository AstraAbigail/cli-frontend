import { useState } from "react"
import { useAuth } from "../context/AuthContext"

const UpdatePedido = ({ pedido, onClose, onUpdate }) => {
  const [loader, setLoader] = useState(false)
  const [formData, setFormData] = useState({
    cliente: pedido.cliente,
    dniCliente:Number(pedido.dniCliente),
    direccion: pedido.direccion,
    tecnicoAsignado: pedido.tecnicoAsignado,
    fechaProgramada: pedido.fechaProgramada,
    estado:pedido.estado
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const { token} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToUpdate = {
      ...formData,
      dniCliente: Number(formData.dniCliente)
    }
  

    try {
      setLoader(true)
      const response = await fetch(`http://localhost:3000/pedidos/${pedido._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      })
      // const response = await fetch(`https://cli-l4ad.onrender.com/pedidos/${pedido._id}`, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(dataToUpdate)
      // })
      onUpdate()
      onClose()
    } catch (error) {
      console.log("Error al actualizar el objeto :(")
    } finally {
      setLoader(false)
    }
  }

  return (
    <section className="modal-overlay">
      <div className="modal-box">
        <h2>Editar pedido</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Cliente"
            name="cliente"
            onChange={handleChange}
            value={formData.cliente}
          />
          <input
            type="number"
            placeholder="DNI"
            name="dniCliente"
            onChange={handleChange}
            value={formData.dniCliente}
          />
          <input
            type="text"
            placeholder="Direccion"
            name="direccion"
            onChange={handleChange}
            value={formData.direccion}
          />
          <input
            type="text"
            placeholder="Tecnico Asignado"
            name="tecnicoAsignado"
            onChange={handleChange}
            value={formData.tecnicoAsignado}
          />
          <input
            type="text"
            placeholder="Fecha Programada"
            name="fechaProgramada"
            onChange={handleChange}
            value={formData.fechaProgramada}
          />
          <input
            type="text"
            placeholder="Estado"
            name="estado"
            onChange={handleChange}
            value={formData.estado}
          />
          <button type="submit">{loader ? "Enviando..." : "Enviar"}</button>
        </form>
        <button className="close-btn" type="button" onClick={onClose}>Cancelar</button>
      </div>
    </section>
  )
}

export default UpdatePedido