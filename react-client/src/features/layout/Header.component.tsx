import { Box, Flex, Image, Link } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

import HeaderLogo from '../../assets/svg/HeaderLogo.svg'

const Header: React.FC = () => {
  return (
    <Flex
      h="12"
      px="4"
      borderBottom="2px solid #e2e8f0"
      alignItems="center"
      justifyContent="space-between"
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