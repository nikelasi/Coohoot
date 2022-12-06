import { Box, Button, Flex, Icon, Image, Link, useColorMode } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

import HeaderLogo from '../../assets/svg/HeaderLogo.svg'
import { IoMdSunny, IoMdMoon } from 'react-icons/io'

const Header: React.FC = () => {

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex
      h="16"
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

      {/* Right */}
      <Flex
        gap="4">
        {/* Links */}
        <Button variant="link">
          <Link as={RouterLink} to="/register">
            Register
          </Link>
        </Button>
        <Button>
          <Link as={RouterLink} to="/login" variant="no-underline">
            Login
          </Link>
        </Button>

        {/* Buttons */}
        <Button
          onClick={toggleColorMode}
          variant="ghost">
          <Icon as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />
        </Button>
      </Flex>
    </Flex>
  )
}

export default Header