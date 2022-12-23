import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Link, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import useToast from "../layout/useToast"
import { useAuth } from "./AuthContext"
import PasswordInput from "./PasswordInput.component"
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import ForgotPasswordModal from "./ForgotPasswordModal"

const LoginSchema = Yup.object().shape({
  userIdentification: Yup.string()
    .required('Required'),
  password: Yup.string()
    .required('Required')
})

interface LoginFormProps {
  redirect?: string
}

const LoginForm: React.FC<LoginFormProps> = ({ redirect }: LoginFormProps) => {

  const toast = useToast()
  const auth = useAuth()
  const navigate = useNavigate()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Formik
      validationSchema={LoginSchema}
      initialValues={{
        userIdentification: "",
        password: ""
      }}
      onSubmit={async (values, formikHelpers) => {
        const { userIdentification, password } = values
        setSubmitting(true)
        const { success, message } = await auth.login(userIdentification, password)
        setSubmitting(false)
        if (success) {
          if (redirect) navigate(redirect)
          toast.success(`Login successful`, `Welcome back, ${userIdentification}`)
        } else {
          toast.error("Login failed", message)
        }
      }}>
      {({ handleSubmit, errors, touched }) => (
        <>
          <form onSubmit={handleSubmit}>
            <Flex
              direction="column"
              gap="4">
              <FormControl isRequired isInvalid={!!errors.userIdentification && touched.userIdentification}>
                <FormLabel>Username / Email</FormLabel>
                <Field
                  as={Input}
                  id="userIdentification"
                  name="userIdentification"
                  placeholder="Enter your username or email..." />
                <FormErrorMessage>{errors.userIdentification}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.password && touched.password}>
                <FormLabel>Password</FormLabel>
                <PasswordInput
                  name="password"
                  placeholder="Enter your password..." />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <Button
                isLoading={submitting}
                loadingText="Logging in..."
                type="submit">
                Login
              </Button>
              <Text>
                forgot password? click&nbsp;
                <Link onClick={onOpen} color="brand.accent">here</Link>.
              </Text>
            </Flex>
          </form>
          <ForgotPasswordModal isOpen={isOpen} onClose={onClose} />
        </>
      )}
    </Formik>
  )
}

export default LoginForm