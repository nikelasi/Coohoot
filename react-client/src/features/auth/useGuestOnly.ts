import { useAuth } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const useGuestOnly = (redirect: string = "/dashboard") => {
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token !== null) {
      navigate(redirect)
    }
  }, [token])
}

export default useGuestOnly;
