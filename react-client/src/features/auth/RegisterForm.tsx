import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { FormEvent, useState } from "react"
import api from "../../api"
import useToast from "../layout/useToast"
import PasswordInput from "./PasswordInput.component"

const RegisterForm: React.FC = () => {

  const toast = useToast()

  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const [submitting, setSubmitting] = useState<boolean>(false)

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Registration failed", "Passwords do not match")
      return
    }
    setSubmitting(true)
    const success = await api.auth.register(username, email, password)
    setSubmitting(false)
    if (success) {
      toast.success("Registration successful", "Please check your email to verify your account")
    } else {
      toast.error("Registration failed", "An account with that email already exists")
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Flex
        direction="column"
        gap="4">
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder='Enter a username...' />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder='Enter your email...' />
          </FormControl>
          <Flex
            gap="4"
            direction={{
              base: "column",
              md: "row"
            }}>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <PasswordInput
                placeholder="Enter password..."
                setOuterValue={setPassword} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <PasswordInput
                placeholder="Confirm password..."
                setOuterValue={setConfirmPassword} />
            </FormControl>
          </Flex>
          <Button
            isLoading={submitting}
            loadingText="Registering..."
            type="submit">
            Register
          </Button>
      </Flex>
    </form>
  )
}

export default RegisterForm