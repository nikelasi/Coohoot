import { Flex } from "@chakra-ui/react"
import usePaginator from "./usePaginator"

const TemplateDiscovery: React.FC = () => {

  const { Paginator } = usePaginator({
    maxPages: 1
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
        No templates found
      </Flex>
      <Flex
        alignSelf="flex-end">
        <Paginator />
      </Flex>
    </Flex>
  )
}

export default TemplateDiscovery