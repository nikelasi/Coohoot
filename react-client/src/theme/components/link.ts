import { ComponentStyleConfig } from "@chakra-ui/react";

const Link: ComponentStyleConfig = {
  variants: {
    "no-underline": {
      styles: {
        textDecoration: "none"
      }
    }
  }
}

export default Link