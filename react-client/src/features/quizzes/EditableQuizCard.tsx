import { AspectRatio, Avatar, Card, CardBody, Heading, HStack, Image, Skeleton, VStack, Text, Flex, Link, Box, Icon } from "@chakra-ui/react"
import SkeletonAvatar from "../images/SkeletonAvatar"
import SkeletonImage from "../images/SkeletonImage"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { IoMdCheckmarkCircle, IoMdEyeOff, IoMdGlobe, IoMdLock } from "react-icons/io"
import { MdNote } from "react-icons/md"

interface QuizCardProps {
  quiz: any
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }: QuizCardProps) => {

  const navigate = useNavigate()

  const { id, title, published, thumbnail_url, visibility } = quiz

  return (
    <Card
      onClick={() => {
        navigate(`/quiz/${id}`)
      }}
      _hover={{
        boxShadow: "lg",
        transform: "scale(1.02)",
        transition: "all 0.2s ease-in-out"
      }}
      _active={{
        boxShadow: "xs",
        transform: "scale(0.98)",
        transition: "all 0.2s ease-in-out"
      }}
      transition="all 0.2s ease-in-out"
      cursor="pointer"
      rounded="lg"
      overflow="hidden"
      position="relative"
      bgColor="var(--chakra-colors-chakra-body-bg)">
      <AspectRatio ratio={16 / 9}>
        <SkeletonImage src={thumbnail_url} />
      </AspectRatio>
      <Flex
        flexDir="column"
        pos="absolute"
        inset="2"
        gap="2"
        alignItems="flex-start">
        <HStack
          alignItems="center"
          p="2"
          rounded="md"
          backgroundColor="blackAlpha.800">
          <Icon
            as={published ? IoMdCheckmarkCircle : MdNote}
            fill="brand"
            boxSize="4" />
          <Text fontSize="sm" color="white">
            { published ? "Published" : "Draft" }
          </Text>
        </HStack>
        <HStack
          alignItems="center"
          p="2"
          rounded="md"
          backgroundColor="blackAlpha.800">
          <Icon as={
            visibility === "private" ? IoMdLock :
            visibility === "public" ? IoMdGlobe :
            IoMdEyeOff}
            fill="brand"
            boxSize="4" />
          <Text fontSize="sm" color="white">
            { visibility === "private" ? "Private" :
              visibility === "public" ? "Public" :
              "Unlisted" }
          </Text>
        </HStack>
      </Flex>
      <CardBody p="2">
        <HStack w="full">
          <Heading noOfLines={1} maxW="full" fontSize="md">{title}</Heading>
        </HStack>
      </CardBody>
    </Card>
  )
}

export default QuizCard