import { Flex, SimpleGrid, Skeleton, Spinner } from "@chakra-ui/react"
import api from "../../api"
import QuizCard from "../quizzes/QuizCard"
import usePaginator from "./usePaginator"

const QuizDiscovery: React.FC = () => {

  const { Paginator, items, isLoading } = usePaginator({
    paginatorApi: api.quizzes.getAllPaginated()
  })

  return (
    <Flex
      flexGrow="1"
      direction="column"
      gap="4"
      bgColor="highlight"
      borderRadius="lg"
      p="4">
      <Paginator />
      { isLoading ?
        <Flex
          flexGrow="1"
          alignItems="center"
          justifyContent="center">
          <Spinner size="xl" thickness="5px" color="brand" />
        </Flex> :
        <Flex
          flexGrow="1">
          <SimpleGrid
            w="full"
            alignSelf="flex-start"
            gap="4"
            columns={{
              sm: 2,
              md: 3,
              lg: 4
            }}>
            {items.map((quiz: any) => {
              return <QuizCard
                quiz={quiz}
                key={quiz.id} />
            })}
          </SimpleGrid>
        </Flex>
      }
      <Flex
        alignSelf="flex-end">
        <Paginator />
      </Flex>
    </Flex>
  )
}

export default QuizDiscovery