import { useAuth } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const useAuthWall = (redirect: string = "/dashboard") => {
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token === null) {
      navigate(`/authwall?redirect=${redirect}`)
    }
  }, [token])
}

export default useAuthWall;
