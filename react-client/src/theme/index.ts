import { extendTheme } from "@chakra-ui/react"

import colors from "./foundations/colors"
import semanticTokens from "./foundations/semanticTokens"
import config from "./config"

import Button from "./components/button"
import Link from "./components/link"

const theme = extendTheme({
  config,
  semanticTokens,
  colors,
  components: {
    Button,
    Link
  }
})

export default theme