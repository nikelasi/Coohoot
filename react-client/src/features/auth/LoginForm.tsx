import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { FormEvent, useState } from "react"
import api from "../../api"
import useToast from "../layout/useToast"
import { useAuth } from "./AuthContext"
import PasswordInput from "./PasswordInput.component"

const LoginForm: React.FC = () => {

  const toast = useToast()
  const auth = useAuth()

  const [userIdentification, setUserIdentification] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [submitting, setSubmitting] = useState<boolean>(false)

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const result = await api.auth.login(userIdentification, password)
    setSubmitting(false)
    if (result.success) {
      auth.setToken(result.token)
      toast.success(`Login successful`, `Welcome back, ${userIdentification}`)
    } else {
      toast.error("Login failed", "Invalid username or password")
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Flex
        direction="column"
        gap="4">
        <FormControl isRequired>
          <FormLabel>Username / Email</FormLabel>
          <Input
            value={userIdentification}
            onChange={e => setUserIdentification(e.target.value)}
            placeholder='Enter your username or email...' />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <PasswordInput placeholder="Enter your password..." setOuterValue={setPassword} />
        </FormControl>
        <Button
          isLoading={submitting}
          loadingText="Logging in..."
          type="submit">
          Login
        </Button>
      </Flex>
    </form>
  )
}

export default LoginForm