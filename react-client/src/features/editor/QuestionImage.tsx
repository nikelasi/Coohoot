import { Flex, Text, Button, Icon, useDisclosure, Image} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { IoMdCloudUpload, IoMdImage } from "react-icons/io"
import SkeletonImage from "../images/SkeletonImage";
import AddImageModal from "./AddImageModal";

interface QuestionImageProps {
  initialImage: string | null;
  updateImage: (image: string | null) => void;
}

const QuestionImage: React.FC<QuestionImageProps> = ({ initialImage = null, updateImage }: QuestionImageProps) => {

  const [image, setImage] = useState<string | null>(initialImage)

  const { onClose: onAIClose, onOpen: onAIOpen, isOpen: isAIOpen } = useDisclosure()

  useEffect(() => {
    updateImage(image)
  }, [image])

  return (
    <Flex
      rounded="md"
      flexDir="column"
      p="4"
      gap="3"
      background="highlight">

      <AddImageModal onClose={onAIClose} isOpen={isAIOpen} updateImage={setImage} />

      <Text fontSize="xl">Image (Optional)</Text>
      { image === null
      ? <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        h="60"
        gap="4"
        border="2px dashed"
        borderColor="gray.300"
        rounded="md">
        <Icon as={IoMdImage} color="brand" boxSize="16" />
        <Button
          onClick={onAIOpen}
          leftIcon={<IoMdCloudUpload />}>
          Add Image
        </Button>
      </Flex>
      : <Flex
        alignSelf="center"
        maxH="60"
        rounded="md"
        overflow="hidden"
        cursor="pointer"
        onClick={onAIOpen}
        position="relative"
        boxShadow="md"
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
        <SkeletonImage
          src={image}
          imageProps={{
            maxH: "60",
            objectFit: "contain"
          }}
          skeletonProps={{
            maxH: "60",
            objectFit: "contain"
          }} />
      </Flex> }
    </Flex>
  )
}

export default QuestionImage