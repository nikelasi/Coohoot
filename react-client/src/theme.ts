import { extendTheme, ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false,

  disableTransitionOnChange: false,
}

const semanticTokens = {
  colors: {
    brand: {
      default: '#136CD7'
    },
    'brand.accent': {
      default: '#1059B1',
      _dark: "#1880FF"
    },
    'brand.highlight': {
      default: '#C9E2FF',
      _dark: '#002046'
    }
  }
}

const theme = extendTheme({
  config,
  semanticTokens
})

export default theme