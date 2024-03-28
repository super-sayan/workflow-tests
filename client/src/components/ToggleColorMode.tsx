import {
  Flex,
  Button,
} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

export const ToggleColorMode = () => {
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

      </Flex>
    </Flex>
  )
}
export default ToggleColorMode;