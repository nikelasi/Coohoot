import { Button, Flex, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, VStack, Image, HStack, Avatar, AspectRatio } from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ImageDropzone, { DropzoneState } from "../images/ImageDropzone.component"
import Modal, { ModalProps } from "../layout/Modal.layout"
import ReactCrop, { Crop, centerCrop, PixelCrop, convertToPixelCrop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import cropImage from "../images/cropImage"
import useToast from "../layout/useToast"
import SkeletonImage from "../images/SkeletonImage"
import api from "../../api"

type Props = ModalProps & {
  updateImage: (url: string) => void

}

const AddImageModal: React.FC<Props> = (props: Props) => {

  const { onClose } = props
  const { updateImage, ...modalProps } = props

  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewMode, setPreviewMode] = useState<"preview" | "crop">("crop")
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState<boolean>(false)
  const [updating, setUpdating] = useState<boolean>(false)

  const imageRef = useRef<HTMLImageElement>(null)

  const toast = useToast()

  const onDropzoneChange = (dropzoneState: DropzoneState) => {
    const { acceptedFiles } = dropzoneState
    if (acceptedFiles.length > 0) {
      setCrop(undefined)
      setSelectedFile(acceptedFiles[0])
    } else {
      setSelectedFile(null)
    }
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
      setPreviewMode("preview")
    } else {
      setPreviewMode("crop")
      setCroppedUrl(null)
    }
  }

  const resetModal = () => {
    setSelectedFile(null)
    setCroppedUrl(null)
    setPreviewMode("crop")
  }

  const setThumbnail = async () => {
    
    setUpdating(true)
    let imgUrl: string | null;
    if (croppedUrl) {
      imgUrl = croppedUrl
    } else {
      imgUrl = await cropImage(
        imageRef.current as HTMLImageElement,
        selectedFile as File,
        completedCrop as PixelCrop
      ) as string
    }
    
    setUpdating(false)
    const url = await api.quizzes.uploadImage(imgUrl as string);
    if (url) {
      updateImage(url)
      onClose()
      toast.success("Success", "Image set successfully.")
    } else {
      toast.error("Error", "Failed to set image")
    }
  }

  const onImageLoad = () => {
    let { naturalWidth: width, naturalHeight: height } = imageRef.current!
    
    const crop = centerCrop(
      {
        unit: "%",
        width: 100,
        height: 100
      },
      width,
      height
    )

    setCrop(crop)
  }

  return (
    <Modal {...modalProps}
      onCloseComplete={() => {
        resetModal()
        onClose()
      }}>
      <ModalHeader>Add/Change Question Image</ModalHeader>
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
            Preview and crop the image for the question
          </Text>
          <Button
            onClick={() => setSelectedFile(null)}
            size="xs">
            Clear upload
          </Button>
        </Flex>
        : <Text
          fontSize="sm">
          Upload a image for the question.
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
              isLoading={updating}
              loadingText="Setting..."
              onClick={setThumbnail}
              size="sm">
              Set image
            </Button>
            <Button
              isDisabled={updating}
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
            disabled={updating}
            crop={crop}
            keepSelection={true}
            minWidth={20}
            minHeight={20}
            onChange={(_, c) => setCrop(c)}
            onComplete={(c, _) => {setCompletedCrop(c); console.log(c)}}>
            <img ref={imageRef} onLoad={onImageLoad} src={imageUrl || ""} />
          </ReactCrop>

          {/* Preview */}
          <Flex
            alignSelf="center"
            display={previewMode === "preview" ? "flex" : "none"}
            maxH="60"
            objectFit="contain"
            rounded="lg"
            overflow="hidden"
            boxShadow="md">
            <SkeletonImage
              imageProps={{
                maxH: "60",
                objectFit: "contain"
              }}
              skeletonProps={{
                maxH: "60",
                objectFit: "contain"
              }}
              src={croppedUrl || ""} />
          </Flex>

        </VStack> }
      </ModalBody>
      <ModalFooter />
    </Modal>
  )
}

export default AddImageModal