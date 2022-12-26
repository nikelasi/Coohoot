import { Button, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import { Field, Formik } from "formik";
import Modal from "../layout/Modal.layout"
import useToast from "../layout/useToast";
import * as Yup from "yup";
import PasswordInput from "../auth/PasswordInput.component";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const DeleteUserSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
})

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserModal: React.FC<ModalProps> = ({ isOpen, onClose }: ModalProps) => {

  const toast = useToast()
  const { deleteUser } = useAuth()
  const navigate = useNavigate()

  return (
    <Formik
      validationSchema={DeleteUserSchema}
      initialValues={{
        password: ""
      }}
      onSubmit={async (values, formikHelpers) => {
        const { password } = values
        const success = await deleteUser(password)
        if (success) {
          toast.success("Delete Account", "Your account has been deleted. It's sad to see you go :(")
          navigate("/")
          onClose()
        } else {
          formikHelpers.setFieldError("password", "Incorrect password")
        }
      }}>
      {({ handleSubmit, errors, touched, isSubmitting }) => (
        <Modal
          onClose={onClose}
          isOpen={isOpen}>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Delete Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="4">
              <Text>Are you sure you want to delete your account?</Text>
              <FormControl
                isRequired
                isInvalid={!!errors.password && touched.password}
                isDisabled={isSubmitting}>
                <FormLabel>Enter your password to confirm</FormLabel>
                <PasswordInput
                  name="password"
                  placeholder="Enter your password..."/>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter
              display="flex"
              gap="2">
              <Button
                isLoading={isSubmitting}
                loadingText="Deleting..."
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

export default DeleteUserModal