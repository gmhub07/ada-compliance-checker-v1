import React from 'react';
import {
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';

const Stats = ({ stats, loading, cardBg, borderColor, textColor }) => {
  // Debug logging
  console.log('Stats component received:', { stats, loading });
  
  return (
    <HStack spacing={6} mb={8} justify="center" wrap="wrap">
      <Stat
        bg={cardBg}
        p={6}
        borderRadius="xl"
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
        minW="200px"
        textAlign="center"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: '2xl',
        }}
        transition="all 0.3s"
      >
        <StatLabel color={textColor}>Total Issues</StatLabel>
        <StatNumber color={stats.total > 0 ? 'red.500' : stats.total === 0 && !loading ? 'green.500' : useColorModeValue('gray.500', 'gray.400')} fontSize="3xl">
          {loading ? <Spinner size="lg" /> : stats.total === 0 && !loading ? '-' : stats.total}
        </StatNumber>
        <StatHelpText>
          {loading ? (
            <>
              <StatArrow type={stats.total > 0 ? 'decrease' : 'increase'} />
              {stats.total > 0 ? 'Issues found' : 'All clear!'}
            </>
          ) : (
            'Ready to check'
          )}
        </StatHelpText>
      </Stat>

      <Stat
        bg={cardBg}
        p={6}
        borderRadius="xl"
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
        minW="200px"
        textAlign="center"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: '2xl',
        }}
        transition="all 0.3s"
      >
        <StatLabel color={textColor}>Critical</StatLabel>
        <StatNumber color={stats.critical > 0 ? 'red.500' : useColorModeValue('gray.500', 'gray.400')} fontSize="3xl">
          {loading ? <Spinner size="sm" /> : stats.critical === 0 && !loading ? '-' : stats.critical}
        </StatNumber>
        <StatHelpText color={stats.critical > 0 ? 'red.500' : useColorModeValue('gray.500', 'gray.400')}>
          {loading ? 'Must fix immediately' : 'Ready to check'}
        </StatHelpText>
      </Stat>

      <Stat
        bg={cardBg}
        p={6}
        borderRadius="xl"
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
        minW="200px"
        textAlign="center"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: '2xl',
        }}
        transition="all 0.3s"
      >
        <StatLabel color={textColor}>Warnings</StatLabel>
        <StatNumber color={stats.warnings > 0 ? 'orange.500' : useColorModeValue('gray.500', 'gray.400')} fontSize="3xl">
          {loading ? <Spinner size="sm" /> : stats.warnings === 0 && !loading ? '-' : stats.warnings}
        </StatNumber>
        <StatHelpText color={stats.warnings > 0 ? 'orange.500' : useColorModeValue('gray.500', 'gray.400')}>
          {loading ? 'Should address soon' : 'Ready to check'}
        </StatHelpText>
      </Stat>

      <Stat
        bg={cardBg}
        p={6}
        borderRadius="xl"
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
        minW="200px"
        textAlign="center"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: '2xl',
        }}
        transition="all 0.3s"
      >
        <StatLabel color={textColor}>Status</StatLabel>
        <StatNumber 
          color={
            loading 
              ? useColorModeValue('gray.500', 'gray.400') 
              : stats.passed === null
                ? useColorModeValue('gray.500', 'gray.400')
                : stats.passed 
                  ? 'green.500' 
                  : 'red.500'
          } 
          fontSize="3xl"
        >
          {loading ? (
            <Spinner size="sm" />
          ) : stats.passed === null ? (
            '-'
          ) : stats.passed ? (
            'PASS'
          ) : (
            'FAIL'
          )}
        </StatNumber>
        <StatHelpText>
          {loading 
            ? 'Analyzing...' 
            : stats.passed === null
              ? 'Ready to check' 
              : stats.passed 
                ? 'Compliant' 
                : 'Needs work'
          }
        </StatHelpText>
      </Stat>
    </HStack>
  );
};

export default Stats;
