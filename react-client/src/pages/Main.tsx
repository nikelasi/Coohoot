import { Box, Circle, Flex } from "@chakra-ui/react"

import OwlOnBranch from '../assets/svg/OwlOnBranch.svg'

const Main: React.FC = () => {
  return (
    <Flex>

      {/* Graphic */}
      <Box
        w="42%"
        position="relative"
        >
        <Box
          h="100vh"
          w="100vw"
          position="absolute"
          top="-16"
          overflow="hidden"
          zIndex="-1"
          >
          <Circle
            size="80vw"
            bgColor="#C9E2FF"
            position="absolute"
            top="-20vw"
            left="-40vw"
            border="1rem solid #1059B1"
            />
          <OwlOnBranch
            boxSize="35vw"
            position="absolute"
            left="-4"
            bottom="12"
            />
        </Box>
      </Box>

      {/* Content */}
      <Box w="58%">

      </Box>

    </Flex>
  )
}

export default Main