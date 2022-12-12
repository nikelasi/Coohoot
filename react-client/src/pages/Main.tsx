import { Box, Heading, Text, Link, Button } from "@chakra-ui/react"
import OwlPage from "../features/layout/OwlPage.layout"

import { Link as RouterLink } from "react-router-dom"

import { IoMdArrowRoundForward } from "react-icons/io"

const Main: React.FC = () => {
  return (
    <OwlPage
      ml={{
        base: "12",
        md: "32"
      }}
      gap="8"
      justifyContent="center">
        <Box>
          <Heading
            fontSize="5xl">
            Welcome to <Text as="span" color="brand">coohoot</Text>!
          </Heading>
          <Text
            fontSize="2xl">
            <Text as="span" color="brand.accent">create</Text> and&nbsp;
            <Text as="span" color="brand.accent">take</Text>
            &nbsp;quizzes on the web
          </Text>
        </Box>
        <Box fontSize="2xl">
          Want to take a quiz?<br/>
          <Button rightIcon={<IoMdArrowRoundForward />}>
            <Link as={RouterLink} to="/quizzes" variant="no-underline">Browse Now</Link>
          </Button>
        </Box>
        <Box>
          Want to create quizzes instead?<br/>
          <Link as={RouterLink} to="/register" color="brand.accent">Register</Link> or&nbsp;
          <Link as={RouterLink} to="/login" color="brand.accent">Login</Link> now
        </Box>
    </OwlPage>
  )
}

export default Main