import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { useState } from "react"


const Register = () => {

  const [formData, setFormData] = useState({
    email: "",
    password:""
  })

  const navigate = useNavigate()

  const handleChange = (e) => { 
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => { 
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type":"application/json"          
        },
        body:JSON.stringify(formData)
      })
      console.log(response)
      const responseData = await response.json()
      if (!responseData.success) { 
          alert(responseData.error)
      }
      alert(`Usuario creado con exito: ${responseData.data._id}`)
      navigate("/inicio")
    } catch (error) {
      console.log("Error al registrar el usuario", error)
    }
    
  }

  


  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Crear Cuenta</h3>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            onChange={handleChange}
          />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </Layout>
  )
}

export default Register