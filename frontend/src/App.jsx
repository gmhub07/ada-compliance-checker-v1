import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Textarea,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Container,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Progress,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { 
  FiUpload, 
  FiFileText, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiDownload,
  FiSettings,
  FiRefreshCw,
  FiEye,
  FiCode,
} from 'react-icons/fi';
import HtmlPreview from './components/HtmlPreview';
import Stats from './components/Stats';
import Header from './components/Header';
import Footer from './components/Footer';
import { generateAccessibilityReport } from './utils/pdfGenerator';
import { useFileHandler } from './hooks/useFileHandler';
import { useAccessibilityChecker } from './hooks/useAccessibilityChecker';
import { useColorScheme } from './utils/colorScheme';
import { getViolationIcon, getViolationColor, getViolationStatus } from './utils/violationHelpers';

export default function App() {
  const [html, setHtml] = useState('');
  const [highlightSelector, setHighlightSelector] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // Custom hooks
  const { fileInputRef, handleFileUpload, triggerFileUpload } = useFileHandler(setHtml);
  const { loading, violations, stats, runCheck, clearResults } = useAccessibilityChecker();
  const colors = useColorScheme();
  
  // Debug logging
  console.log('App component state:', { html, loading, violations, stats });





  const clearForm = useCallback(() => {
    setHtml('');
    clearResults();
    setHighlightSelector(null);
  }, [clearResults]);

  const handleHighlightSelector = useCallback((selector) => {
    setHighlightSelector(selector);
  }, []);

  const handleDownloadReport = useCallback(async () => {
    if (!html.trim()) {
      toast({
        title: "No HTML content",
        description: "Please paste some HTML code to generate a report.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setGeneratingPDF(true);
    try {
      await generateAccessibilityReport(html, violations, stats);
      toast({
        title: "Report generated successfully!",
        description: "Your PDF report has been downloaded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error generating report",
        description: "Could not generate the PDF report. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setGeneratingPDF(false);
    }
  }, [html, violations, stats, toast]);





  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runCheck(html);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        clearForm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [runCheck, html, clearForm]);

  return (
    <Box
      minH="100vh"
      bgGradient={colors.bgGradient}
      py={8}
      px={4}
    >
      <Container maxW="7xl" data-testid="main-content">
        {/* Header */}
        <Header />

        {/* Stats Cards */}
        <Stats 
          stats={stats} 
          loading={loading} 
          cardBg={colors.cardBg} 
          borderColor={colors.borderColor} 
          textColor={colors.textColor} 
        />

        {/* Main Content */}
        <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
          {/* Left Panel - Input & Results */}
          <Box
            flex="1"
            bg={colors.cardBg}
            p={8}
            borderRadius="2xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor={colors.borderColor}
            position="relative"
            overflow="hidden"
            _hover={{
              transform: 'scale(1.01)',
              boxShadow: '3xl',
            }}
            transition="all 0.3s"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top={-4}
              right={-4}
              w="200px"
              h="200px"
              bgGradient="linear(to-br, blue.200, purple.200)"
              borderRadius="full"
              opacity="0.1"
              filter="blur(40px)"
              animation="pulse 4s ease-in-out infinite"
            />
            
            <VStack spacing={6} align="stretch">
              {/* Input Section */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Heading size="lg" color={colors.textColor} display="flex" alignItems="center" gap={2}>
                    <Icon as={FiCode} color={colors.blue500_300} />
                    HTML Code
                    {violations.length > 0 && (
                      <Badge
                        colorScheme="red"
                        variant="solid"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                        position="relative"
                        _after={{
                          content: '""',
                          position: 'absolute',
                          top: '-2px',
                          right: '-2px',
                          width: '8px',
                          height: '8px',
                          bg: colors.red400_300,
                          borderRadius: 'full',
                          animation: 'pulse 2s infinite',
                        }}
                      >
                        {violations.length}
                      </Badge>
                    )}
                  </Heading>
                  <HStack>
                    <Tooltip label="Clear all content">
                      <IconButton
                        icon={<FiRefreshCw />}
                        onClick={clearForm}
                        variant="ghost"
                        colorScheme="gray"
                        aria-label="Clear form"
                      />
                    </Tooltip>
                    <Tooltip label="Settings">
                      <IconButton
                        icon={<FiSettings />}
                        onClick={onOpen}
                        variant="ghost"
                        colorScheme="gray"
                        aria-label="Settings"
                      />
                    </Tooltip>
                  </HStack>
                </HStack>
                
                <Textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  height="300px"
                  fontFamily="monospace"
                  fontSize="sm"
                  placeholder="Paste your HTML code here... ✨"
                  bg={colors.gray50}
                  border="2px solid"
                  borderColor={colors.borderColor}
                  borderRadius="xl"
                  _focus={{
                    borderColor: colors.blue500_300,
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                  }}
                  _placeholder={{
                    color: colors.placeholderColor,
                    animation: 'typing 3s steps(40, end) infinite',
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <HStack spacing={4} justify="center">
                <Button
                  onClick={() => runCheck(html)}
                  colorScheme="blue"
                  size="lg"
                  px={8}
                  py={6}
                  borderRadius="xl"
                  boxShadow="lg"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                    _before: {
                      left: '100%',
                    },
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                  isLoading={loading}
                  loadingText="Analyzing..."
                  leftIcon={<Icon as={FiCheckCircle} />}
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s',
                  }}
                >
                  {loading ? 'Analyzing Code...' : 'Check HTML'}
                </Button>
                
                <Tooltip label="Upload HTML file (.html/.htm) - Max 5MB">
                  <Button
                    variant="outline"
                    size="lg"
                    px={6}
                    py={6}
                    borderRadius="xl"
                    borderColor={colors.borderColor}
                    color={colors.textColor}
                    _hover={{
                      bg: colors.gray100,
                      transform: 'translateY(-2px)',
                    }}
                    leftIcon={<Icon as={FiUpload} />}
                    onClick={triggerFileUpload}
                  >
                    Upload File
                  </Button>
                </Tooltip>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </HStack>



              {/* Progress Bar */}
              {loading && (
                <Box>
                  <Text mb={2} color={colors.textColor} fontWeight="medium">
                    Analyzing your HTML...
                  </Text>
                  <Progress
                    size="lg"
                    colorScheme="blue"
                    borderRadius="full"
                    isIndeterminate
                  />
                </Box>
              )}

              {/* Success State - Only show after running a check and getting no violations */}
              {violations.length === 0 && !loading && html.trim() && stats.total === 0 && stats.passed === 1 && (
                <Alert
                  status="success"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  height="200px"
                  borderRadius="xl"
                  bg={colors.green50}
                  border="1px solid"
                  borderColor={colors.green200}
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  <AlertIcon boxSize="40px" />
                  <AlertTitle mt={4} mb={1} fontSize="lg">
                    🎉 Perfect HTML Code!
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    Your HTML code meets all common accessibility standards. Great job on building inclusive web content!
                  </AlertDescription>
                  
                  {/* Confetti effect */}
                  <Box
                    position="absolute"
                    top="10%"
                    left="20%"
                    w="8px"
                    h="8px"
                    bg={colors.yellow400_300}
                    borderRadius="full"
                    animation="confetti 3s ease-in-out infinite"
                  />
                  <Box
                    position="absolute"
                    top="20%"
                    right="30%"
                    w="6px"
                    h="6px"
                    bg={colors.pink400_300}
                    borderRadius="full"
                    animation="confetti 3s ease-in-out infinite 0.5s"
                  />
                  <Box
                    position="absolute"
                    bottom="20%"
                    left="10%"
                    w="10px"
                    h="10px"
                    bg={colors.blue400_300}
                    borderRadius="full"
                    animation="confetti 3s ease-in-out infinite 1s"
                  />
                </Alert>
              )}
            </VStack>
          </Box>

          {/* Right Panel - Preview */}
          <Box
            flex="1"
            bg={colors.cardBg}
            p={8}
            borderRadius="2xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor={colors.borderColor}
            position="relative"
            overflow="hidden"
            _hover={{
              transform: 'scale(1.01)',
              boxShadow: '3xl',
            }}
            transition="all 0.3s"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              bottom={-4}
              left={-4}
              w="200px"
              h="200px"
              bgGradient="linear(to-tr, purple.200, pink.200)"
              borderRadius="full"
              opacity="0.1"
              filter="blur(40px)"
              animation="pulse 4s ease-in-out infinite reverse"
            />

            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Heading size="lg" color={colors.textColor} display="flex" alignItems="center" gap={2}>
                  <Icon as={FiEye} color={colors.purple500_300} />
                  Live Preview
                </Heading>
                <Badge
                  colorScheme="purple"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  Real-time
                </Badge>
              </HStack>

              <Box
                minH="400px"
                h="400px"
                bg="white"
                borderRadius="xl"
                border="2px solid"
                borderColor={colors.borderColor}
                overflow="hidden"
                position="relative"
              >
                {html.trim() ? (
                  <Box
                    h="full"
                    position="relative"
                    _hover={{
                      transform: 'scale(1.005)',
                    }}
                    transition="all 0.2s"
                  >
                    <HtmlPreview html={html} highlightedSelector={highlightSelector} />
                  </Box>
                ) : (
                  <VStack
                    justify="center"
                    align="center"
                    h="full"
                    spacing={4}
                    color="gray.400"
                  >
                    <Icon as={FiFileText} boxSize={16} />
                    <Text fontSize="lg" fontWeight="medium">
                      No HTML to preview
                    </Text>
                    <Text fontSize="sm" textAlign="center">
                      Paste your HTML code to see a live preview here
                    </Text>
                  </VStack>
                )}
              </Box>

              {/* Preview Controls */}
              <HStack justify="space-between">
                {/* <Text fontSize="sm" color="gray.500">
                  {html.trim() ? 'Click violations to highlight elements' : 'Ready for input'}
                </Text> */}
              </HStack>
            </VStack>
          </Box>
        </Flex>

        {/* Dedicated Accessibility Violations Section */}
        {violations.length > 0 && (
          <Box
            mt={8}
            bg={colors.cardBg}
            p={8}
            borderRadius="2xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor={colors.borderColor}
            position="relative"
            overflow="hidden"
            _hover={{
              transform: 'scale(1.01)',
              boxShadow: '3xl',
            }}
            transition="all 0.3s"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top={-4}
              right={-4}
              w="200px"
              h="200px"
              bgGradient="linear(to-br, red.200, orange.200)"
              borderRadius="full"
              opacity="0.1"
              filter="blur(40px)"
              animation="pulse 4s ease-in-out infinite"
            />

            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Heading size="lg" color={colors.textColor} display="flex" alignItems="center" gap={2}>
                  <Icon as={FiAlertTriangle} color={colors.red500_300} />
                  Accessibility Violations
                </Heading>
                <HStack spacing={4}>
                  <Badge
                    colorScheme="red"
                    variant="subtle"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="md"
                    fontWeight="bold"
                  >
                    {violations.length} ISSUES
                  </Badge>
                  {violations.length > 0 && (
                    <Tooltip label="Download PDF report">
                      <IconButton
                        icon={<FiDownload />}
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                        aria-label="Download PDF report"
                        onClick={handleDownloadReport}
                        isLoading={generatingPDF}
                        _hover={{
                          bg: 'red.50',
                          transform: 'scale(1.05)',
                        }}
                        transition="all 0.2s"
                      />
                    </Tooltip>
                  )}
                </HStack>
              </HStack>

              <List spacing={4}>
                {violations.map((violation, index) => {
                  // Skip invalid violations
                  if (!violation || !violation.ruleId || !violation.message) {
                    return null;
                  }
                  
                  return (
                    <ListItem
                      key={`${violation.ruleId}-${index}`}
                      bg={colors.gray50}
                      p={6}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={colors.borderColor}
                      cursor="pointer"
                      onClick={() => violation.selector && handleHighlightSelector(violation.selector)}
                      _hover={{
                        bg: colors.gray100,
                        transform: 'translateX(4px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s"
                      position="relative"
                      overflow="hidden"
                    >
                      {/* Violation Type Indicator */}
                      <Box
                        position="absolute"
                        left={0}
                        top={0}
                        bottom={0}
                        w="4px"
                        bg={getViolationColor(violation.ruleId)}
                        borderRadius="full"
                      />
                      
                      <HStack spacing={4} align="start">
                        <Icon
                          as={getViolationIcon(violation.ruleId)}
                          color={getViolationColor(violation.ruleId)}
                          boxSize={6}
                          mt={0.5}
                        />
                        <VStack align="start" spacing={2} flex="1">
                          <HStack justify="space-between" w="full">
                            <Badge
                              colorScheme={getViolationStatus(violation.ruleId)}
                              variant="subtle"
                              fontSize="sm"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontWeight="medium"
                            >
                              {violation.ruleId}
                            </Badge>
                          </HStack>
                          <Text
                            fontWeight="medium"
                            color={colors.gray800_white}
                            fontSize="md"
                            lineHeight="1.5"
                          >
                            {violation.message}
                          </Text>
                          <Text
                            fontSize="sm"
                            color={colors.gray500_300}
                            fontFamily="monospace"
                            bg={colors.gray100}
                            px={3}
                            py={2}
                            borderRadius="md"
                          >
                            <strong>Element:</strong> {violation.element}
                          </Text>
                          <Text
                            fontSize="sm"
                            color={colors.gray500_300}
                            fontFamily="monospace"
                            bg={colors.gray100}
                            px={3}
                            py={2}
                            borderRadius="md"
                          >
                            <strong>Details:</strong> {violation.message}
                          </Text>
                          <Text
                            fontSize="sm"
                            color={colors.gray500_300}
                            fontFamily="monospace"
                            bg={colors.gray100}
                            px={3}
                            py={2}
                            borderRadius="md"
                          >
                            <strong>Rule:</strong> {violation.ruleId}
                          </Text>
                          {/* Display any other fields that might be in the API response */}
                          {Object.keys(violation).filter(key => 
                            !['ruleId', 'message', 'selector', 'element', 'codeSnippet'].includes(key)
                          ).map(key => (
                            <Text
                              key={key}
                              fontSize="sm"
                              color={colors.gray500_400_alt}
                              fontFamily="monospace"
                              bg={colors.gray100}
                              px={3}
                              py={2}
                              borderRadius="md"
                            >
                              <strong>{key}:</strong> {String(violation[key])}
                            </Text>
                          ))}
                        </VStack>
                      </HStack>
                    </ListItem>
                  );
                })}
              </List>
            </VStack>
          </Box>
        )}

        {/* Footer */}
        <Footer borderColor={colors.borderColor} textColor={colors.textColor} />
      </Container>

      {/* Settings Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Settings panel coming soon...</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}