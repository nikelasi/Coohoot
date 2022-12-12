import { Box, FlexProps, Circle, Flex } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

import OwlOnBranch from '../../assets/svg/OwlOnBranch.svg'

const OwlPage: React.FC<PropsWithChildren<FlexProps>> = (props: PropsWithChildren<FlexProps>) => {
  const { children, ...flexProps } = props;
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
            bgColor="brand.highlight"
            position="absolute"
            top="-20vw"
            left="-40vw"
            border="1rem solid"
            borderColor="brand.accent"
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
      <Flex w="58%" h="calc(100vh - 4rem)" direction="column" {...flexProps}>
        { children }
      </Flex>

    </Flex>
  )
}

export default OwlPage