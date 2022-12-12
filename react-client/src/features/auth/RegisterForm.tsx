import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useState } from "react"
import PasswordInput from "./PasswordInput.component"

const RegisterForm: React.FC = () => {

  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  return (
    <Flex
      direction="column"
      gap="4">
      <FormControl isRequired>
        <FormLabel>Username</FormLabel>
        <Input placeholder='Enter a username...' />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder='Enter your email...' />
      </FormControl>
      <Flex
        gap="4"
        direction={{
          base: "column",
          md: "row"
        }}>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <PasswordInput placeholder="Enter password..." setOuterValue={setPassword} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <PasswordInput placeholder="Confirm password..." setOuterValue={setConfirmPassword} />
        </FormControl>
      </Flex>
      <Button>
        Register
      </Button>
    </Flex>
  )
}

export default RegisterForm