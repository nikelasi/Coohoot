import { Button, Flex, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, VStack, Image, HStack, Avatar, AspectRatio } from "@chakra-ui/react"
import { useEffect, useMemo, useRef, useState } from "react"
import ImageDropzone, { DropzoneState } from "../images/ImageDropzone.component"
import Modal, { ModalProps } from "../layout/Modal.layout"
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import cropImage from "../images/cropImage"
import useToast from "../layout/useToast"
import SkeletonImage from "../images/SkeletonImage"

type Props = ModalProps & {
  setNewThumbnail: (url: string) => void
}

const ChangeThumbnailModal: React.FC<Props> = (props: Props) => {

  const { onClose } = props
  const { setNewThumbnail, ...modalProps } = props

  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewMode, setPreviewMode] = useState<"preview" | "crop">("crop")
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState<boolean>(false)
  const [updating, setUpdating] = useState<boolean>(false)

  const imageRef = useRef<HTMLImageElement | null>(null)

  const toast = useToast()

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
        16 / 9,
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

  const setThumbnail = async () => {
    
    setUpdating(true)
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
    
    setNewThumbnail(imgUrl)
    setUpdating(false)
    onClose()
    toast.success("Success", "Thumbnail set successfully.")
  }

  useEffect(() => {
    if (croppedUrl) setPreviewMode("preview")
  }, [croppedUrl])

  return (
    <Modal {...modalProps}
      onCloseComplete={() => {
        resetModal()
        onClose()
      }}>
      <ModalHeader>Change Quiz Thumbnail</ModalHeader>
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
            Preview and crop the thumbnail for your quiz.
          </Text>
          <Button
            onClick={() => setSelectedFile(null)}
            size="xs">
            Clear upload
          </Button>
        </Flex>
        : <Text
          fontSize="sm">
          Upload a thumbnail for your quiz.
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
              Set as thumbnail
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
            aspect={16 / 9}
            crop={crop}
            keepSelection={true}
            minWidth={20}
            minHeight={20}
            onChange={(_, c) => setCrop(c)}
            onComplete={(c, _) => setCompletedCrop(c)}>
            <img onLoad={onImageLoad} src={imageUrl || ""} />
          </ReactCrop>

          {/* Preview */}
          <AspectRatio
            display={previewMode === "preview" ? "flex" : "none"}
            ratio={16 / 9}
            w="full"
            rounded="lg"
            overflow="hidden"
            boxShadow="md">
            <SkeletonImage src={croppedUrl || ""} />
          </AspectRatio>

        </VStack> }
      </ModalBody>
      <ModalFooter />
    </Modal>
  )
}

export default ChangeThumbnailModal