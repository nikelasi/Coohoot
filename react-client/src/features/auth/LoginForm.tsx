import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useToast from "../layout/useToast"
import { useAuth } from "./AuthContext"
import PasswordInput from "./PasswordInput.component"
import { Formik, Field } from 'formik'
import * as Yup from 'yup'

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
        const success = await auth.login(userIdentification, password)
        setSubmitting(false)
        if (success) {
          if (redirect) navigate(redirect)
          toast.success(`Login successful`, `Welcome back, ${userIdentification}`)
        } else {
          toast.error("Login failed", "Invalid username or password")
        }
      }}>
      {({ handleSubmit, errors, touched }) => (
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
          </Flex>
        </form>
      )}
    </Formik>
  )
}

export default LoginForm