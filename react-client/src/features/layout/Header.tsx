import { Box, Button, Circle, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Icon, Image, Link, useColorMode, useDisclosure } from "@chakra-ui/react"
import { Link as RouterLink, useLocation, useResolvedPath } from "react-router-dom"

import HeaderLogo from '../../assets/svg/HeaderLogo.svg'
import { IoMdSunny, IoMdMoon, IoMdMenu } from 'react-icons/io'
import { createRef, useEffect } from "react"
import { useAuth } from "../auth/AuthContext"

const Header: React.FC = () => {

  const { user } = useAuth()

  const { colorMode, toggleColorMode } = useColorMode()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef: React.LegacyRef<HTMLButtonElement> = createRef<HTMLButtonElement>()

  const { pathname } = useLocation()

  useEffect(() => {
    onClose()
  }, [pathname])

  return (
    <Flex
      h="16"
      top="0"
      position="sticky"
      zIndex="1"
      px="4"
      alignItems="center"
      justifyContent="space-between"
      backdropFilter="blur(8px)"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)">

      {/* Logo */}
      <Flex
        gap="8"
        alignItems="center"
        fontWeight="bold">
        <Link as={RouterLink} to="/">
          <HeaderLogo boxSize="24" />
        </Link>
        <Flex
          h="7"
          gap="4"
          alignItems="end"
          display={{
            base: "none",
            sm: "flex"
          }}>
          <Link hidden={user === null} as={RouterLink} to="/dashboard" variant="no-underline">
            <Button variant="link">Dashboard</Button>
          </Link>
        </Flex>
      </Flex>

      {/* Right */}
      <Flex
        gap="4">
        {/* Links */}
        <Flex
          gap="4"
          alignItems="center"
          display={{
            base: "none",
            sm: "flex"
          }}>
          {/* Show when not logged in */}
          <Link hidden={user !== null} as={RouterLink} to="/register" display="flex" alignItems="center">
            <Button variant="link">Register</Button>
          </Link>
          <Link hidden={user !== null} as={RouterLink} to="/login" variant="no-underline">
            <Button>Login</Button>
          </Link>
          {/* Show when logged in */}

        </Flex>

        {/* Buttons */}
        
        <Link
          hidden={user === null}
          as={RouterLink}
          to={`/user/${user.username}`}
          variant="no-underline">
          <Circle size="10" border="2px solid" borderColor="brand" overflow="hidden">
            <Image
              h="full"
              w="full"
              src={user.pfp_url} />
          </Circle>
        </Link>
        <Button
          p={{
            base: "0",
            sm: "3"
          }}
          minW="unset"
          onClick={toggleColorMode}
          variant={{
            base: "link",
            sm: "ghost"
          }}>
          <Icon as={colorMode === 'light' ? IoMdMoon : IoMdSunny} boxSize="5" />
        </Button>
        <Button
          p="0"
          minW="unset"
          variant="link"
          ref={btnRef}
          onClick={onOpen}
          display={{
            base: "flex",
            sm: "none"
          }}>
          <Icon as={IoMdMenu} boxSize="6" />
        </Button>
      </Flex>


      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>

          <DrawerBody>
          <Flex
            gap="4"
            direction="column"
            textAlign="left">
            {/* Not logged in */}
            <Link hidden={user !== null} as={RouterLink} onClick={() => onClose()} to="/register" variant="no-underline">
              <Button w="full">Register</Button>
            </Link>
            <Link hidden={user !== null} as={RouterLink} onClick={() => onClose()} to="/login" variant="no-underline">
              <Button w="full">Login</Button>
            </Link>
            {/* Logged in */}
            <Link hidden={user === null} as={RouterLink} onClick={() => onClose()} to="/dashboard" variant="no-underline">
              <Button w="full">Dashboard</Button>
            </Link>
          </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default Header