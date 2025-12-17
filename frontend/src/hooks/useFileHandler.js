import { useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/toast';

export const useFileHandler = (setHtml) => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an HTML file (.html or .htm)",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        setHtml(content);
        toast({
          title: "File uploaded successfully!",
          description: `${file.name} content has been loaded into the editor`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error reading file",
          description: "Could not read the file content. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Could not read the file. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };

    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setHtml, toast]);

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleFileUpload,
    triggerFileUpload,
  };
};
