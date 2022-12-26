import { Button, Flex, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, Text, VStack, Image } from "@chakra-ui/react"
import { useMemo, useRef, useState } from "react"
import ImageDropzone, { DropzoneState } from "../images/ImageDropzone.component"
import Modal, { ModalProps } from "../layout/Modal.layout"
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import cropImage from "../images/cropImage"

const UpdatePFPModal: React.FC<ModalProps> = (props: ModalProps) => {

  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const imageRef = useRef<HTMLImageElement | null>(null)

  const onDropzoneChange = (dropzoneState: DropzoneState) => {
    const { acceptedFiles } = dropzoneState
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    } else {
      setSelectedFile(null)
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    let { width, height } = e.currentTarget
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
      return URL.createObjectURL(selectedFile)
    }
    return null
  }, [selectedFile])

  return (
    <Modal {...props}>
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

        {/* Preview */}
        { selectedFile &&
        <VStack
          gap="2"
          alignItems="stretch">
          <ReactCrop
            style={{
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
          <Button onClick={async () => {
            const url = await cropImage(imageRef.current as HTMLImageElement, selectedFile, completedCrop as PixelCrop)
            console.log(url)
          }} size="sm">
            Set as profile photo
          </Button>
        </VStack> }
      </ModalBody>
      <ModalFooter />
    </Modal>
  )
}

export default UpdatePFPModal