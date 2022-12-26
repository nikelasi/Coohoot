import { Button, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import Modal, { ModalProps } from "../layout/Modal.layout"
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import api from "../../api"
import useToast from "../layout/useToast"

const ForgotPasswordSchema = Yup.object().shape({
  userIdentification: Yup.string()
    .required('Required')
})

const ForgotPasswordModal: React.FC<ModalProps> = (props: ModalProps) => {

  const toast = useToast()
  const { onClose } = props

  return (
    <Formik
      validationSchema={ForgotPasswordSchema}
      initialValues={{
        userIdentification: ""
      }}
      onSubmit={async (values, formikHelpers) => {
        const { userIdentification } = values
        const success = await api.auth.forgotPassword(userIdentification)
        if (success) {
          formikHelpers.setValues({
            userIdentification: ""
          })
          onClose()
          toast.success("Forgot Password", "Email sent! Please check your inbox for a link to reset your password.")
        } else {
          formikHelpers.setFieldError("userIdentification", "Invalid email or username")
        }
      }}>
      {({ handleSubmit, errors, touched, isSubmitting, resetForm }) => (
        <Modal {...props}
          onCloseComplete={resetForm}>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Forgot Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="4">
              <Text>Enter your email address or username and we'll send you a link to reset your password.</Text>
                <FormControl
                  isRequired
                  isInvalid={!!errors.userIdentification && touched.userIdentification}
                  isDisabled={isSubmitting}>
                  <FormLabel>Email / Username</FormLabel>
                  <Field
                    as={Input}
                    id="userIdentification"
                    name="userIdentification"
                    placeholder="Enter your email or username..." />
                  <FormErrorMessage>{errors.userIdentification}</FormErrorMessage>
                </FormControl>
            </ModalBody>
            <ModalFooter
              display="flex"
              gap="2">
              <Button
                isLoading={isSubmitting}
                loadingText="Submitting..."
                variant="ghost"
                type="submit">
                Submit
              </Button>
              <Button
                onClick={onClose}
                colorScheme="red">
                Close
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </Formik>
  )
}

export default ForgotPasswordModal