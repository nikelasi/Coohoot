import { Button, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import { Field, Formik } from "formik";
import Modal from "../layout/Modal.layout"
import useToast from "../layout/useToast";
import * as Yup from "yup";
import PasswordInput from "../auth/PasswordInput.component";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Current password is required"),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required')
    .matches(/^(?=.*\d)(?=.*[@$!%*#?&]).*$/, 'Password must contain at least one special character and one number'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
})

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ModalProps> = ({ isOpen, onClose }: ModalProps) => {

  const toast = useToast()

  return (
    <Formik
      validationSchema={ChangePasswordSchema}
      initialValues={{
        oldPassword: "",
        password: "",
        confirmPassword: ""
      }}
      onSubmit={async (values, formikHelpers) => {
        const { oldPassword, password } = values
        const { success, errors } = await api.users.changePassword(oldPassword, password)
        if (success) {
          toast.success("Success", "Password changed successfully")
          formikHelpers.resetForm()
          onClose()
          return
        }
        if (errors) {
          formikHelpers.setFieldError("password", errors.new_password[0])
          return
        }
        toast.error("Incorrect password", "Please try again")
        formikHelpers.setFieldError("oldPassword", "Incorrect Password")
      }}>
      {({ handleSubmit, errors, touched, isSubmitting }) => (
        <Modal
          onClose={onClose}
          isOpen={isOpen}>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="4">
              <Text>Enter your current password and the new password</Text>
              <FormControl
                isRequired
                isInvalid={!!errors.oldPassword && touched.oldPassword}
                isDisabled={isSubmitting}>
                <FormLabel>Current Password</FormLabel>
                <PasswordInput
                  name="oldPassword"
                  placeholder="Enter your password..."/>
                <FormErrorMessage>{errors.oldPassword}</FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!errors.password && touched.password}
                isDisabled={isSubmitting}>
                <FormLabel>New Password</FormLabel>
                <PasswordInput
                  name="password"
                  placeholder="Enter your new password..."/>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!errors.confirmPassword && touched.confirmPassword}
                isDisabled={isSubmitting}>
                <FormLabel>New Password</FormLabel>
                <PasswordInput
                  name="confirmPassword"
                  placeholder="Confirm your new password..."/>
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter
              display="flex"
              gap="2">
              <Button
                isLoading={isSubmitting}
                loadingText="Changing..."
                type="submit"
                colorScheme="red">
                Confirm
              </Button>
              <Button
                onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </Formik>
  )
}

export default ChangePasswordModal