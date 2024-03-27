// import { Button } from "@chakra-ui/button";
// import { useColorMode } from "@chakra-ui/color-mode";
// import { MoonIcon, SunIcon } from "@chakra-ui/icons";

// const ToggleColorMode = () => {
//   const { colorMode, toggleColorMode } = useColorMode();
//   return (
//     <Button
//       onClick={() => toggleColorMode()}
//       pos="absolute"
//       top="0"
//       right="0"
//       m="1rem"
//     >
//       {colorMode === "dark" ? (
//         <SunIcon color="orange.200" />
//       ) : (
//         <MoonIcon color="blue.700" />
//       )}
//     </Button>
//   );
// };

// export default ToggleColorMode;
//-----------------------------------------
//import { useState } from 'react'
import {
  //useColorMode,
  Flex,
  Button,
} from '@chakra-ui/react'
//import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
//import NextLink from 'next/link'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

export const ToggleColorMode = () => {
  //const { colorMode } = useColorMode()
  //const isDark = colorMode === 'dark'
  //const [display, changeDisplay] = useState('none')
  return (
    <Flex>
      <Flex
        position="fixed"
        top="1rem"
        right="1rem"
        align="center"
      >
        {/* Desktop */}
        <Flex
          display={['none', 'none', 'flex','flex']}
        >
          {/* <NextLink href="/" passHref> 
            <Button
              as="a"
              variant="ghost"
              aria-label="Home"
              my={5}
              w="100%"
            >
              Home
                    </Button>
          </NextLink> */}
          <ChakraLink as={ReactRouterLink} to='/'>
            <Button
               as="a"
               variant="ghost"
               aria-label="Home"
               my={5}
               w="100%"
            >
               Home
            </Button>
          </ChakraLink>

          {/* <NextLink href="/menu" passHref>
            <Button
              as="a"
              variant="ghost"
              aria-label="About"
              my={5}
              w="100%"
            >
              About
                    </Button>
          </NextLink> */}

          <ChakraLink as={ReactRouterLink} to='/menu'>
            <Button
               as="a"
               variant="ghost"
               aria-label="Menu"
               my={5}
               w="100%"
            >
               Menu
            </Button>
          </ChakraLink>


          {/* <NextLink href="/contact" passHref>
            <Button
              as="a"
              variant="ghost"
              aria-label="Contact"
              my={5}
              w="100%"
            >
              Contact
                    </Button>
          </NextLink> */}

          <ChakraLink as={ReactRouterLink} to='/contact'>
            <Button
               as="a"
               variant="ghost"
               aria-label="Contact"
               my={5}
               w="100%"
            >
               Contact
            </Button>
          </ChakraLink>

          {/* <NextLink href="/login" passHref>
            <Button
              as="a"
              variant="ghost"
              aria-label="Login"
              my={5}
              w="100%"
            >
              Login
            </Button>
        </NextLink>*/}
        </Flex> 

          <ChakraLink as={ReactRouterLink} to='/login'>
            <Button
               as="a"
               variant="ghost"
               aria-label="Login"
               my={5}
               w="100%"
            >
               Login
            </Button>
          </ChakraLink>

        {/* Mobile */}
      </Flex>
    </Flex>
  )
}
export default ToggleColorMode;