import { Flex, Heading, Icon, Input, InputGroup, InputLeftElement, SimpleGrid, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { useSearchParams } from 'react-router-dom'
import api from '../../api'
import QuizDiscovery from '../../features/discovery/QuizDiscovery'
import SessionDiscovery from '../../features/discovery/SessionDiscovery'
import usePaginator from '../../features/discovery/usePaginator'
import Page from "../../features/layout/Page.layout"
import QuizCard from '../../features/quizzes/QuizCard'

const Discover: React.FC = () => {

  const [searchParam, setSearchParam] = useState<string>("")

  const { Paginator, items, isLoading } = usePaginator({
    paginatorApi: api.quizzes.getAllPaginated(),
    searchParam
  })

  return (
    <Page
      w="full"
      p="8"
      gap="4">
      <Heading>
        Discovery
        <Text
          fontSize="lg">
          Explore and take quizzes created by people
        </Text>
      </Heading>
      {/* Quiz Discovery */}
      <InputGroup>
        <InputLeftElement
          children={<Icon as={IoMdSearch} boxSize="6" color="gray.300" />} />
        <Input
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          variant="filled"
          colorScheme="highlight"
          w="full"
          placeholder="Search quizzes..." />
      </InputGroup>
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
            { items.length !== 0
            ? <SimpleGrid
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
            : "No quizzes found" }
          </Flex>
        }
        <Flex
          alignSelf="flex-end">
          <Paginator />
        </Flex>
      </Flex>
    </Page>
  )
}

export default Discover