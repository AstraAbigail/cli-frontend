import Layout from "../components/Layout"

const Register = () => {
  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container">
          <h3>Crear Cuenta</h3>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </Layout>
  )
}

export default Register