import { Button, Flex, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, VStack, Image, HStack, Avatar } from "@chakra-ui/react"
import { useEffect, useMemo, useRef, useState } from "react"
import ImageDropzone, { DropzoneState } from "../images/ImageDropzone.component"
import Modal, { ModalProps } from "../layout/Modal.layout"
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import cropImage from "../images/cropImage"
import { useAuth } from "../auth/AuthContext"
import api from "../../api"
import useToast from "../layout/useToast"

const UpdatePFPModal: React.FC<ModalProps> = (props: ModalProps) => {

  const { onClose } = props

  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewMode, setPreviewMode] = useState<"preview" | "crop">("crop")
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState<boolean>(false)
  const [updatingPFP, setUpdatingPFP] = useState<boolean>(false)

  const imageRef = useRef<HTMLImageElement | null>(null)

  const toast = useToast()
  const { user } = useAuth()
  const { username, email } = user || {}

  const onDropzoneChange = (dropzoneState: DropzoneState) => {
    const { acceptedFiles } = dropzoneState
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    } else {
      setSelectedFile(null)
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    let { naturalWidth: width, naturalHeight: height } = e.currentTarget
    imageRef.current = e.currentTarget

    let lowestDimen = {}
    if (width < height) {
      lowestDimen = { width: 100 }
    } else {
      lowestDimen = { height: 100 }
    }
    
    const crop = centerCrop(
      makeAspectCrop({
          unit: '%',
          ...lowestDimen
        },
        1,
        width,
        height
      ),
      width,
      height
    )

    setCrop(crop)
  }

  const imageUrl = useMemo(() => {
    if (selectedFile) {
      setPreviewMode("crop")
      return URL.createObjectURL(selectedFile)
    }
    return null
  }, [selectedFile])

  const switchMode = async () => {
    if (previewMode === "crop") {
      setPreviewLoading(true)
      const url = await cropImage(
        imageRef.current as HTMLImageElement,
        selectedFile as File,
        completedCrop as PixelCrop
      )
      setPreviewLoading(false)
      setCroppedUrl(url as string)
    } else {
      setPreviewMode("crop")
      setCroppedUrl(null)
    }
  }

  const resetModal = () => {
    setSelectedFile(null)
    setCroppedUrl(null)
  }

  const setProfilePhoto = async () => {
    
    setUpdatingPFP(true)
    let imgUrl: string;
    if (croppedUrl) {
      imgUrl = croppedUrl
    } else {
      imgUrl = await cropImage(
        imageRef.current as HTMLImageElement,
        selectedFile as File,
        completedCrop as PixelCrop
      ) as string
    }
    
    const { success } = await api.users.updatePfp(imgUrl)
    setUpdatingPFP(false)
    if (success) {
      toast.success("Success", "Profile photo updated.")
      resetModal()
      onClose()
    } else {
      toast.error("Error", "Could not update profile photo.")
      resetModal()
    }
  }

  useEffect(() => {
    if (croppedUrl) setPreviewMode("preview")
  }, [croppedUrl])

  return (
    <Modal {...props}
      onCloseComplete={() => {
        resetModal()
        onClose()
      }}>
      <ModalHeader>Change Profile Photo</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        display="flex"
        flexDirection="column"
        gap="4">

        { selectedFile
        ? <Flex
          gap="1"
          justifyContent="space-between"
          alignItems="flex-start"
          flexDirection={{
            base: 'column',
            md: 'row'
          }}>
          <Text
            fontSize="sm">
            Preview and crop your new profile photo.
          </Text>
          <Button
            onClick={() => setSelectedFile(null)}
            size="xs">
            Clear upload
          </Button>
        </Flex>
        : <Text
          fontSize="sm">
          Upload a new profile photo for your account.
        </Text> }

        {/* File Drop Zone */}
        { selectedFile === null && <ImageDropzone dropzoneProps={{
          onDropzoneChange
        }} /> }

        {/* Preview & Crop */}
        { selectedFile &&
        <VStack
          gap="2"
          alignItems="stretch">

          {/* Toolbar */}
          <HStack>
            <Button
              isLoading={updatingPFP}
              loadingText="Setting..."
              onClick={setProfilePhoto}
              size="sm">
              Set as profile photo
            </Button>
            <Button
              onClick={switchMode}
              isLoading={previewLoading}
              loadingText={"Previewing..."}
              size="sm">
              { previewMode === "preview" ? "Crop" : "Preview"}
            </Button>
          </HStack>

          {/* Cropper */}
          <ReactCrop
            style={{
              display: previewMode === "preview" ? "none" : "inline-block",
              alignSelf: "center",
              borderRadius: "0.3rem"
            }}
            circularCrop
            aspect={1}
            crop={crop}
            keepSelection={true}
            minWidth={20}
            minHeight={20}
            onChange={(_, c) => setCrop(c)}
            onComplete={(c, _) => setCompletedCrop(c)}>
            <img onLoad={onImageLoad} src={imageUrl || ""} />
          </ReactCrop>

          {/* Profile Card */}
          <HStack
            display={previewMode === "preview" ? "flex" : "none"}
            bgColor="highlight"
            p="4"
            borderRadius="lg"
            gap="2"
            alignItems="center">
            <Avatar
              ignoreFallback={true}
              borderRadius="100%"
              border="3px solid"
              boxSize="16"
              color="brand"
              src={croppedUrl || ""} />
            <VStack
              alignItems="flex-start"
              overflow="auto">
              <Text
                lineHeight="8"
                color="brand.accent"
                fontSize="3xl"
                noOfLines={1}
                maxWidth={{
                  base: "100%",
                  md: "25vw"
                }}>
                {username}
              </Text>
              <Text
                marginTop="0px"
                marginBlockStart="0"
                color="brand"
                fontSize="md"
                noOfLines={1}
                maxWidth={{
                  base: "100%",
                  md: "25vw"
                }}>
                {email}
              </Text>
            </VStack>
          </HStack>

        </VStack> }
      </ModalBody>
      <ModalFooter />
    </Modal>
  )
}

export default UpdatePFPModal