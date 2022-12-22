import { FlexProps, Flex } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const Page: React.FC<PropsWithChildren<FlexProps>> = (props: PropsWithChildren<FlexProps>) => {
  const { children, ...flexProps } = props;
  return (
    <Flex
      h="calc(100vh - 4rem)"
      w="100vw"
      direction="column"
      {...flexProps}>
      { children }
    </Flex>
  )
}

export default Page