import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

const AuthProvider = ({ children }) => { 

  const [user, setUser] = useState(false)

  const login = () => setUser(true)

  const logout = () => setUser(false)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
    
  )

}

//custom hook

const useAuth =() =>useContext(AuthContext)

export { AuthProvider , useAuth}