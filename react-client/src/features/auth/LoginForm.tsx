import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useState } from "react"
import PasswordInput from "./PasswordInput.component"

const LoginForm: React.FC = () => {

  const [password, setPassword] = useState<string>("")

  return (
    <Flex
      direction="column"
      gap="4">
      <FormControl isRequired>
        <FormLabel>Username / Email</FormLabel>
        <Input placeholder='Enter your username or email...' />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <PasswordInput placeholder="Enter your password..." setOuterValue={setPassword} />
      </FormControl>
      <Button>
        Login
      </Button>
    </Flex>
  )
}

export default LoginForm