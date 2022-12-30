import { Flex } from "@chakra-ui/react"
import api from "../../api"
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
      <Flex
        flexGrow="1">
        { isLoading ? 'loading...' : items.map((item: any) => (
          <div key={item.title}>quiz</div>
        )) }
      </Flex>
      <Flex
        alignSelf="flex-end">
        <Paginator />
      </Flex>
    </Flex>
  )
}

export default QuizDiscovery