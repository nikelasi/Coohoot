import { Button, FormErrorMessage, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { Field } from "formik";
import { useState } from "react"

interface PasswordInputProps {
  name: string;
  placeholder: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ name, placeholder }: PasswordInputProps) => {

  const [show, setShow] = useState<boolean>(false)

  return (
    <InputGroup size='md'>
      <Field
        as={Input}
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        id={name}
        name={name}
        placeholder={placeholder} />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

export default PasswordInput