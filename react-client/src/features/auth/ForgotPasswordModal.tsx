import { Button, FormControl, FormErrorMessage, FormLabel, Input, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text } from "@chakra-ui/react"
import Modal from "../layout/Modal.layout"
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import { useState } from "react"

const ForgotPasswordSchema = Yup.object().shape({
  userIdentification: Yup.string()
    .required('Required')
})

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ModalProps> = ({ isOpen, onClose }: ModalProps) => {

  const [loading, setLoading] = useState<boolean>(false)

  return (
    <Formik
      validationSchema={ForgotPasswordSchema}
      initialValues={{
        userIdentification: ""
      }}
      onSubmit={async (values, formikHelpers) => {
        const { userIdentification } = values
        setLoading(true)
        alert("WIP")
        await new Promise(resolve => setTimeout(resolve, 2000))
        setLoading(false)
      }}>
      {({ handleSubmit, errors, touched }) => (
        <Modal
          onClose={onClose}
          isOpen={isOpen}>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Forgot Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="4">
              <Text>Enter your email address or username and we'll send you a link to reset your password.</Text>
                <FormControl isRequired isInvalid={!!errors.userIdentification && touched.userIdentification}>
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
                isLoading={loading}
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