import { AspectRatio, Avatar, Card, CardBody, Heading, HStack, Image, Skeleton, VStack, Text, Flex } from "@chakra-ui/react"

interface QuizCardProps {
  quiz: any
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }: QuizCardProps) => {

  const { title, description, thumbnail_url } = quiz

  return (
    <Card
      rounded="lg"
      overflow="hidden"
      position="relative"
      bgColor="background">
      <AspectRatio ratio={16 / 9}>
        <Image fallback={<Skeleton />} src={thumbnail_url} />
      </AspectRatio>
      <CardBody p="2">
        <HStack w="full">
          <Avatar boxSize="8" />
          <Flex flexDir="column" flexGrow="1">
            <Heading noOfLines={1} maxW="full" fontSize="md">{title}</Heading>
            <Text noOfLines={1} maxW="full" fontSize="sm">by User</Text>
          </Flex>
        </HStack>
      </CardBody>
    </Card>
  )
}

export default QuizCard