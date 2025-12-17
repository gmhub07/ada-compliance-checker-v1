import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

const Footer = ({ borderColor, textColor }) => {
  return (
    <VStack spacing={4} mt={12} textAlign="center">
      <Divider borderColor={borderColor} />
      <Text color={textColor} fontSize="sm">
        Built with ❤️ for inclusive web development | ADA Compliance Checker
      </Text>
      <HStack spacing={6} fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
        <Text>Real-Time HTML Preview</Text>
        <Text>•</Text>
        <Text>ADA Compliance</Text>
      </HStack>
    </VStack>
  );
};

export default Footer;
