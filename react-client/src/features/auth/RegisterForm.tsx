import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { Formik, Field } from "formik"
import { useState } from "react"
import api from "../../api"
import useToast from "../layout/useToast"
import PasswordInput from "./PasswordInput.component"
import * as Yup from 'yup'

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
})

const RegisterForm: React.FC = () => {

  const toast = useToast()

  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Formik
      validationSchema={RegisterSchema}
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      }}
      onSubmit={async (values, formikHelpers) => {
        const { username, email, password } = values
        setSubmitting(true)
        const success = await api.auth.register(username, email, password)
        setSubmitting(false)
        if (success) {
          toast.success("Registration successful", "Please check your email to verify your account")
        } else {
          toast.error("Registration failed", "An account with that email already exists")
        }
      }}>
      {({ handleSubmit, errors, touched }) => (
        <form onSubmit={handleSubmit}>
          <Flex
            direction="column"
            gap="4">
              <FormControl isRequired isInvalid={!!errors.username && touched.username}>
                <FormLabel>Username</FormLabel>
                <Field
                  as={Input}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter a username..." />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.email && touched.email}>
                <FormLabel>Email</FormLabel>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email..." />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <Flex
                gap="4"
                direction={{
                  base: "column",
                  md: "row"
                }}>
                <FormControl isRequired isInvalid={!!errors.password && touched.password}>
                  <FormLabel>Password</FormLabel>
                  <PasswordInput
                    name="password"
                    placeholder="Enter password..." />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
                  <FormLabel>Confirm Password</FormLabel>
                  <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm password..." />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
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
      )}
    </Formik>
  )
}

export default RegisterForm