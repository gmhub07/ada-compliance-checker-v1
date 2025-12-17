import { useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/toast';
import { checkAccessibility } from '../api';
import { calculateStats } from '../utils/violationHelpers';

export const useAccessibilityChecker = () => {
  const [loading, setLoading] = useState(false);
  const [violations, setViolations] = useState([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, warnings: 0, passed: null });
  const toast = useToast();

  const runCheck = useCallback(async (html) => {
    if (!html.trim()) {
      toast({
        title: "No HTML content",
        description: "Please paste some HTML code to check.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    
    try {
      const data = await checkAccessibility(html);
      
      // Debug: Log the full API response
      console.log('Full API Response:', data);
      
      // Validate the response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from API');
      }
      
      const violations = Array.isArray(data.violations) ? data.violations : [];
      console.log('Violations array:', violations);
      
      // Log each violation to see its structure
      violations.forEach((violation, index) => {
        console.log(`Violation ${index}:`, violation);
      });
      
      setViolations(violations);
      
      // Calculate stats using the utility function
      const newStats = calculateStats(violations);
      console.log('Calculated stats:', newStats);
      console.log('Violations length:', violations.length);
      console.log('Passed value:', newStats.passed);
      setStats(newStats);

      // Only show success message if API specifically returns {"violations": []}
      if (data.hasOwnProperty('violations') && Array.isArray(data.violations) && data.violations.length === 0) {
        toast({
          title: "🎉 Perfect! No violations found",
          description: "Your HTML meets all accessibility standards!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else if (violations.length > 0) {
        toast({
          title: `${violations.length} accessibility issues found`,
          description: `${newStats.critical} critical, ${newStats.warnings} warnings`,
          status: "info",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Accessibility check error:', error);
      toast({
        title: "Error checking accessibility",
        description: error.message || "Unknown error occurred. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setViolations([]);
      setStats({ total: 0, critical: 0, warnings: 0, passed: null });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearResults = useCallback(() => {
    setViolations([]);
    setStats({ total: 0, critical: 0, warnings: 0, passed: null });
  }, []);

  return {
    loading,
    violations,
    stats,
    runCheck,
    clearResults,
  };
};
