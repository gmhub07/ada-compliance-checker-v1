import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  IconButton,
  Tooltip,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <VStack spacing={6} mb={8}>
      <HStack justify="space-between" w="full" position="relative">
        <Box flex="1" />
        <VStack spacing={4} flex="2">
          <Heading
            size="2xl"
            bgGradient={useColorModeValue(
              "linear(to-r, blue.400, purple.500, pink.500)",
              "linear(to-r, blue.300, purple.400, pink.400)"
            )}
            bgClip="text"
            textAlign="center"
            fontWeight="extrabold"
          >
            🚀 ADA Compliance Checker
          </Heading>
          <Text
            fontSize="lg"
            color={textColor}
            textAlign="center"
            maxW="2xl"
          >
            Professional-grade HTML ADA Compliance Checker and comprehensive reporting
          </Text>
        </VStack>
        <Box flex="1" display="flex" justify="flex-end">
          <Tooltip label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              icon={<Icon as={colorMode === 'light' ? FiMoon : FiSun} />}
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme="gray"
              size="lg"
              aria-label="Toggle color mode"
              borderRadius="full"
              _hover={{
                bg: hoverBg,
                transform: 'rotate(180deg)',
              }}
              transition="all 0.3s"
            />
          </Tooltip>
        </Box>
      </HStack>
    </VStack>
  );
};

export default Header;
