import { useState } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useNavigate} from "react-router-dom"

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password:""
  })

  const { login } = useAuth()
  const navigateUser = useNavigate()
  
  const handleSubmit = async (e) => { 
    e.preventDefault()
    try {
      // const response = await fetch("http://localhost:3000/auth/login", {
      const response = await fetch("https://cli-l4ad.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })
      const responseData = await response.json()
      if (responseData.error) { 
        return alert(responseData.error)
      }
      //enviar token al context  tengo el token en .data 
      login(responseData.data)
      navigateUser("/")
      
    } catch (error) {
      console.log(error)
    }
    
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })

  }

  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container" onSubmit={ handleSubmit}>
          <h3>Iniciar Sesión</h3>
          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            onChange={handleChange}            
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            name="password"
            onChange={handleChange}
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </Layout>
  )
}

export default Login