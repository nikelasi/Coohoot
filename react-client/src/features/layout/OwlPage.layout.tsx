import { Box, FlexProps, Circle, Flex, IconProps } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { PropsWithChildren } from "react"

import HappyOwlOnBranch from '../../assets/svg/HappyOwlOnBranch.svg'
import CopOwlOnBranch from '../../assets/svg/CopOwlOnBranch.svg'
import OwlOnBranch from '../../assets/svg/OwlOnBranch.svg'

interface OwlOptionProps {
  owlType?: string;
}

// combine FlexProps with OwlProps
type Props = PropsWithChildren<OwlOptionProps & FlexProps>

const OwlPage: React.FC<Props> = (props: Props) => {
  const { children, ...flexProps } = props;
  const owlType = props.owlType || 'happy';

  let Owl;
  switch (owlType) {
    case "normal":
      Owl = <OwlOnBranch
              boxSize="35vw"
              position="absolute"
              left="-4"
              top="32" />;
      break;
    case "cop":
      Owl = <CopOwlOnBranch
              boxSize="35vw"
              position="absolute"
              left="-8"
              top="32" />;
      break;
    default:
      Owl = <HappyOwlOnBranch
              boxSize="35vw"
              position="absolute"
              left="-4"
              top="32" />;
      break;
  }
  

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
          {Owl}
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