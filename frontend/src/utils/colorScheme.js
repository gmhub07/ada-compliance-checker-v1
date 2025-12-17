import { useColorModeValue } from '@chakra-ui/react';

export const useColorScheme = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const gray50 = useColorModeValue('gray.50', 'gray.700');
  const gray100 = useColorModeValue('gray.100', 'gray.600');
  const gray200 = useColorModeValue('gray.200', 'gray.500');
  const green50 = useColorModeValue('green.50', 'green.900');
  const green200 = useColorModeValue('green.200', 'green.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');
  
  // Additional color values for JSX elements
  const blue500_300 = useColorModeValue('blue.500', 'blue.300');
  const blue400_300 = useColorModeValue('blue.400', 'blue.300');
  const purple500_300 = useColorModeValue('purple.500', 'purple.300');
  const red500_300 = useColorModeValue('red.500', 'red.300');
  const red400_300 = useColorModeValue('red.400', 'red.300');
  const yellow400_300 = useColorModeValue('yellow.400', 'yellow.300');
  const pink400_300 = useColorModeValue('pink.400', 'pink.300');
  const gray500_400 = useColorModeValue('gray.500', 'gray.400');
  const gray800_white = useColorModeValue('gray.800', 'white');
  const gray500_300 = useColorModeValue('gray.500', 'gray.300');
  const gray600_200 = useColorModeValue('gray.600', 'gray.200');
  const gray500_400_alt = useColorModeValue('gray.500', 'gray.400');

  return {
    bgGradient,
    cardBg,
    borderColor,
    textColor,
    gray50,
    gray100,
    gray200,
    green50,
    green200,
    hoverBg,
    placeholderColor,
    blue500_300,
    blue400_300,
    purple500_300,
    red500_300,
    red400_300,
    yellow400_300,
    pink400_300,
    gray500_400,
    gray800_white,
    gray500_300,
    gray600_200,
    gray500_400_alt,
  };
};
