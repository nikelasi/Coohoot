import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { Formik, Field } from "formik"
import { useState } from "react"
import api from "../../api"
import useToast from "../layout/useToast"
import PasswordInput from "./PasswordInput.component"
import * as Yup from 'yup'
import { useNavigate } from "react-router-dom"

const ResetPasswordSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
})

interface ResetPasswordProps {
  token: string;
  username: string;
}

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({ token, username }: ResetPasswordProps) => {

  const toast = useToast()
  const navigate = useNavigate()

  return (
    <Formik
      validationSchema={ResetPasswordSchema}
      initialValues={{
        username,
        password: "",
        confirmPassword: ""
      }}
      onSubmit={async (values, formikHelpers) => {
        const { password } = values
        let { success, errors } = await api.auth.resetPassword(token, password)

        if (success) {
          toast.success("Password reset successful", "You can now login with your new password")
          navigate("/login")
          return
        } 

        if (errors) {
          errors = errors as Record<string, Array<string>>
          Object.keys(errors).forEach(key => {
            errors[key] = errors[key][0]
          })
          formikHelpers.setErrors(errors)
          return
        }

        toast.error("Token has expired", "Please request a new password reset")
        
      }}>
      {({ handleSubmit, errors, touched, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Flex
            direction="column"
            gap="4"
            w={{
              base: "90vw",
              md: "50vw",
            }}>
              <FormControl isDisabled>
                <FormLabel>Username</FormLabel>
                <Field
                  as={Input}
                  id="username"
                  name="username"
                  type="text" />
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!errors.password && touched.password}
                isDisabled={isSubmitting}>
                <FormLabel>New Password</FormLabel>
                <PasswordInput
                  name="password"
                  placeholder="Enter new password..." />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!errors.confirmPassword && touched.confirmPassword}
                isDisabled={isSubmitting}>
                <FormLabel>Confirm New Password</FormLabel>
                <PasswordInput
                  name="confirmPassword"
                  placeholder="Confirm new password..." />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>
              <Button
                isLoading={isSubmitting}
                loadingText="Resetting..."
                type="submit">
                Reset Password
              </Button>
          </Flex>
        </form>
      )}
    </Formik>
  )
}

export default ResetPasswordForm