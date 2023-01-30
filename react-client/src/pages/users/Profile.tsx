import { Heading, HStack, Spinner, Image, Text, VStack, Flex, InputGroup, InputLeftElement, Input, Icon, Divider, SimpleGrid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api'
import Page from "../../features/layout/Page.layout"

import CoohootOwl from '../../assets/svg/CoohootOwl.svg'
import NotFound from '../common/NotFound'
import SkeletonAvatar from '../../features/images/SkeletonAvatar'
import { IoMdPerson, IoMdSearch } from 'react-icons/io'
import usePaginator from '../../features/discovery/usePaginator'
import QuizCard from '../../features/quizzes/QuizCard'

interface ProfileHeadingProps {
  desktopOnly?: boolean;
}

const ProfileHeading: React.FC<ProfileHeadingProps> = ({ desktopOnly = false }: ProfileHeadingProps) => {
  return (
    <Heading
      gap="2"
      alignItems="center"
      display={{
        base: !desktopOnly ? "flex" : "none",
        md: desktopOnly ? "flex" : "none"
      }}>
      <IoMdPerson fill="var(--chakra-colors-brand)" />
      Profile
    </Heading>
  )
}

const Profile: React.FC = () => {

  const { username } = useParams()

  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const userObj = await api.users.getByUsername(username || '')
      setUser(userObj)
      setLoading(false)
    })()
  }, [])

  const { Paginator, items, isLoading } = usePaginator({
    paginatorApi: api.quizzes.getOthersPaginated(username || '')
  })

  if (loading) {
    return (
      <Page
        justifyContent="center"
        alignItems="center">
        <VStack>
          <CoohootOwl boxSize="32" />
          <Heading fontSize="2xl">loading...</Heading>
          <Spinner size="xl" />
        </VStack>
      </Page>
    )
  }

  if (!loading && user === null) {
    return <NotFound message="User Not Found" />
  }

  const { pfp_url } = user

  return (
    <Page
      w="full"
      p="4"
      gap="4">

      <ProfileHeading />

      <Flex
        gap="4"
        flexGrow="1"
        flexDirection={{
          base: "column",
          md: "row"
        }}>

        {/* START: Actions & Profile Panel */}
        <Flex
          p="4"
          bgColor="highlight"
          borderRadius="md"
          flexDirection="column"
          gap="6"
          w={{
            base: "100%",
            md: "auto"
          }}>

          <ProfileHeading desktopOnly />

          {/* START: Profile Section */}
          <VStack
            gap="2"
            w="full"
            alignItems="stretch">

            {/* Profile Card */}
            <HStack
              gap="2"
              alignItems="center">
              <SkeletonAvatar
                border="3px solid"
                color="brand"
                size="16"
                src={pfp_url}/>
              <Text
                lineHeight="8"
                color="brand.accent"
                fontSize="3xl"
                noOfLines={1}
                maxWidth={{
                  base: "100%",
                  md: "25vw"
                }}>
                {username}
              </Text>
            </HStack>

          </VStack>
          {/* END: Profile Section */}

        </Flex>
        {/* END: Actions & Profile Panel */}

        <Divider display={{ base: "block", md: "none" }} />

        {/* START: User's Quiz Listing */}
        <Flex
          flexGrow="1"
          flexDirection="column"
          gap="4">
          
          <Heading>
            <Text as="span" color="brand">{username}</Text>'s coohoots
            <Text
              fontSize="lg">
              Quizzes they have made
            </Text>
          </Heading>
          
          <InputGroup>
            <InputLeftElement
              children={<Icon as={IoMdSearch} boxSize="6" color="gray.300" />} />
            <Input
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

        </Flex>
        {/* END: User's Quiz/Session Listing */}
        
      </Flex>
    </Page>
  )
}

export default Profile