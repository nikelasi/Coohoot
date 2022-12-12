import { Box, FlexProps, Circle, Flex } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

import HappyOwlOnBranch from '../../assets/svg/HappyOwlOnBranch.svg'

const OwlPage: React.FC<PropsWithChildren<FlexProps>> = (props: PropsWithChildren<FlexProps>) => {
  const { children, ...flexProps } = props;
  return (
    <Flex>

      {/* Graphic */}
      <Box
        display={{
          base: 'none',
          md: 'block'
        }}
        w="42%"
        position="relative"
        >
        <Box
          minH="100vh"
          w="100vw"
          position="absolute"
          top="-16"
          bottom="0"
          overflow="hidden"
          zIndex="-1"
          >
          <Circle
            size="80vw"
            bgColor="brand.highlight"
            position="absolute"
            top="-20vw"
            left="-40vw"
            border="1rem solid"
            borderColor="brand.accent"
            />
          <HappyOwlOnBranch
            boxSize="35vw"
            position="absolute"
            left="-4"
            top="32"
            />
        </Box>
      </Box>

      {/* Content */}
      <Flex
        w="58%"
        h="calc(100vh - 4rem)"
        direction="column"
        overflow="auto"
        display={{
          base: 'none',
          md: 'flex'
        }}
        {...flexProps}>
        { children }
      </Flex>

      {/* Mobile */}

      <Flex
        w="100%"
        direction="column"
        overflow="auto"
        pt="8"
        display={{
          base: 'flex',
          md: 'none'
        }}
        {...flexProps}>
        { children }
      </Flex>

    </Flex>
  )
}

export default OwlPage