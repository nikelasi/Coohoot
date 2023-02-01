import { AspectRatio, Avatar, Card, CardBody, Heading, HStack, Image, Skeleton, VStack, Text, Flex, Link } from "@chakra-ui/react"
import SkeletonAvatar from "../images/SkeletonAvatar"
import SkeletonImage from "../images/SkeletonImage"
import { Link as RouterLink, useNavigate } from "react-router-dom"

interface QuizCardProps {
  quiz: any
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }: QuizCardProps) => {

  const navigate = useNavigate()

  const { id, title, description, owner, thumbnail_url } = quiz
  const { pfp_url, username } = owner

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
      <CardBody p="2">
        <HStack w="full">
          <SkeletonAvatar src={pfp_url} size="8" />
          <Flex flexDir="column" flexGrow="1">
            <Heading noOfLines={1} maxW="full" fontSize="md">{title}</Heading>
            <Text noOfLines={1} maxW="full" fontSize="sm" onClick={e => e.stopPropagation()}>
              by <Link color="brand.accent" as={RouterLink} to={`/user/${username}`}>{username}</Link>
            </Text>
          </Flex>
        </HStack>
      </CardBody>
    </Card>
  )
}

export default QuizCard