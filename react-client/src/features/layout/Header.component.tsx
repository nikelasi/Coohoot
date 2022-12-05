import { Box, Flex, Image, Link } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

import HeaderLogo from '../../assets/svg/HeaderLogo.svg'

const Header: React.FC = () => {
  return (
    <Flex
      h="12"
      px="4"
      alignItems="center"
      justifyContent="space-between"
      backdropFilter="blur(8px)"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      >

      {/* Logo */}
      <Box fontSize="2xl" fontWeight="bold">
        <Link as={RouterLink} to="/">
          <HeaderLogo boxSize="24" />
        </Link>
      </Box>

      {/* Links */}
      <Box />
    </Flex>
  )
}

export default Header