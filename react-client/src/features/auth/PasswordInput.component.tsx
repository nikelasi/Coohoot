import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useEffect, useState } from "react"

interface PasswordInputProps {
  setOuterValue: (value: string) => void;
  placeholder: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ setOuterValue, placeholder }: PasswordInputProps) => {

  const [show, setShow] = useState<boolean>(false)
  const [value, setValue] = useState<string>("")

  useEffect(() => {
    setOuterValue(value);
  }, [value])

  return (
    <InputGroup size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => setValue(e.target.value)}
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