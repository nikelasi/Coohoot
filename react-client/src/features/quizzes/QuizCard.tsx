import { AspectRatio, Avatar, Card, CardBody, Heading, HStack, Image, Skeleton, VStack, Text, Flex, Link } from "@chakra-ui/react"
import SkeletonAvatar from "../images/SkeletonAvatar"
import SkeletonImage from "../images/SkeletonImage"
import { Link as RouterLink } from "react-router-dom"

interface QuizCardProps {
  quiz: any
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }: QuizCardProps) => {

  const { title, description, owner, thumbnail_url } = quiz
  const { pfp_url, username } = owner

  return (
    <Card
      rounded="lg"
      overflow="hidden"
      position="relative"
      bgColor="background">
      <AspectRatio ratio={16 / 9}>
        <SkeletonImage src={thumbnail_url} />
      </AspectRatio>
      <CardBody p="2">
        <HStack w="full">
          <SkeletonAvatar src={pfp_url} size="8" />
          <Flex flexDir="column" flexGrow="1">
            <Heading noOfLines={1} maxW="full" fontSize="md">{title}</Heading>
            <Text noOfLines={1} maxW="full" fontSize="sm">
              by <Link color="brand.accent" as={RouterLink} to={`/user/${username}`}>{username}</Link>
            </Text>
          </Flex>
        </HStack>
      </CardBody>
    </Card>
  )
}

export default QuizCard