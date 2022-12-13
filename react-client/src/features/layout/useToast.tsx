import { useToast as useChakraToast } from "@chakra-ui/react"

const useToast = () => {
  const toast = useChakraToast()

  const success = (title: string, description?: string) => {
    toast({
      title,
      description,
      position: "bottom-right",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  const error = (title: string, description?: string) => {
    toast({
      title,
      description,
      position: "bottom-right",
      status: "error",
      duration: 5000,
      isClosable: true,
    })
  }

  const info = (title: string, description?: string) => {
    toast({
      title,
      description,
      position: "bottom-right",
      status: "info",
      duration: 5000,
      isClosable: true,
    })
  }

  return { success, error, info }
}

export default useToast