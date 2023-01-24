import { Button, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, HStack, Image, VStack, useDisclosure, Avatar, AspectRatio, FormControl, FormLabel, tokenToCSSVar, Input, FormErrorMessage, Textarea, Select } from "@chakra-ui/react"
import { IoMdAddCircle } from "react-icons/io";
import Modal, { ModalProps } from "../layout/Modal.layout"
import { Field, Formik } from "formik"
import * as Yup from "yup"
import SkeletonImage from "../images/SkeletonImage";
import { useState } from "react";
import ChangeThumbnailModal from "./ChangeThumbnailModal";
import api from "../../api";
import useToast from "../layout/useToast";

const CreateQuizSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too Short!")
    .required("Required"),
  description: Yup.string()
    .nullable(),
  visibility: Yup.string()
    .required("Required")
    .oneOf(["public", "private", "unlisted"], "Invalid visibility"),
})


const CreateQuizModal: React.FC<ModalProps> = (props: ModalProps) => {

  const { onClose } = props

  const toast = useToast();

  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const { isOpen: isCTOpen, onOpen: onCTOpen, onClose: onCTClose } = useDisclosure()

  return (
    <Formik
      validationSchema={CreateQuizSchema}
      initialValues={{
        title: "",
        description: "",
        visibility: "public",
      }}
      onSubmit={async (values, formikHelpers) => {
        const { title, description, visibility } = values

        const quiz = api.quizzes.create(title, description, visibility, imageUrl);
        if (!quiz) {
          toast.error("Error", "Failed to create quiz")
          return
        }
        formikHelpers.resetForm()
        onClose()
        toast.success("Success", "Quiz created successfully")
      }}>
      {({ handleSubmit, errors, touched, isSubmitting, setFieldValue, values, resetForm }) => (
        <Modal {...props}
          onCloseComplete={resetForm}>

          <ChangeThumbnailModal isOpen={isCTOpen} onClose={onCTClose} setNewThumbnail={setImageUrl} />  

          <form onSubmit={handleSubmit}>
            <ModalHeader>Create Quiz</ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              gap="4">

              <FormControl>
                <FormLabel>Thumbnail</FormLabel>
                <AspectRatio
                  ratio={16 / 9}
                  w="full"
                  rounded="lg"
                  overflow="hidden"
                  boxShadow="md"
                  cursor="pointer"
                  position="relative"
                  onClick={onCTOpen}
                  _hover={{
                    "&::after": {
                      content: "'change'",
                      position: "absolute",
                      inset: "0 0 0 0",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }
                  }}>
                  <SkeletonImage src={imageUrl || "https://coohoot.nj.sg/cloud/default_quiz.png"} />
                </AspectRatio>
              </FormControl>

              <FormControl
                isRequired
                isInvalid={!!errors.title && touched.title}
                isDisabled={isSubmitting}>
                <FormLabel>Title</FormLabel>
                <Field
                  as={Input}
                  id="title"
                  name="title"
                  placeholder="Title" />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl
                isRequired
                isInvalid={!!errors.visibility && touched.visibility}
                isDisabled={isSubmitting}>
                <FormLabel>Visibility</FormLabel>
                <Select
                  id="visibility"
                  name="visibility"
                  value={values.visibility}
                  onChange={(e) => setFieldValue("visibility", e.target.value)}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                </Select>
                <FormErrorMessage>{errors.visibility}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!errors.description && touched.description}
                isDisabled={isSubmitting}>
                <FormLabel>Description</FormLabel>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Description" />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>
            
            </ModalBody>
            <ModalFooter
              display="flex"
              gap="4">
              <Button
                flexGrow={1}
                leftIcon={<IoMdAddCircle />}
                type="submit">
                Create
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

export default CreateQuizModal