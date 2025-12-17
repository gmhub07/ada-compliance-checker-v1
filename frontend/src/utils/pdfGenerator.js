import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateAccessibilityReport = async (html, violations, stats) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - (2 * margin);
  
  let yPosition = margin;
  
  // Helper function to add text with word wrapping
  const addWrappedText = (text, x, y, maxWidth, fontSize = 12) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * (fontSize * 0.4);
  };
  
  // Helper function to check if we need a new page
  const checkNewPage = (requiredHeight) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to create a simple colored box
  const createBox = (x, y, width, height, fillColor, strokeColor) => {
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.setDrawColor(strokeColor[0], strokeColor[1], strokeColor[2]);
    doc.rect(x, y, width, height, 'F');
    doc.rect(x, y, width, height, 'S');
  };
  
  // Header with blue background
  const headerHeight = 30;
  checkNewPage(headerHeight);
  
  createBox(margin, yPosition, contentWidth, headerHeight, [59, 130, 246], [37, 99, 235]);
  
  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ADA Compliance Report', pageWidth / 2, yPosition + 18, { align: 'center' });
  
  yPosition += headerHeight + 12; // Reduced from 15 to 12
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })} at ${new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15; // Reduced from 20 to 15
  
  // Executive Summary
  const summaryHeight = 45;
  checkNewPage(summaryHeight);
  
  createBox(margin, yPosition, contentWidth, summaryHeight, [248, 250, 252], [226, 232, 240]);
  
  // Summary title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Executive Summary', margin + 15, yPosition + 15);
  
  // Summary content
  const summaryText = violations.length === 0 
    ? 'Your HTML code meets all accessibility standards! No violations found.'
    : `${violations.length} accessibility issues detected. ${stats.critical} critical, ${stats.warnings} warnings.`;
  
  yPosition += 25;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  addWrappedText(summaryText, margin + 15, yPosition, contentWidth - 30, 14);
  
  yPosition += summaryHeight + 15; // Reduced from 20 to 15
  
  // Statistics Section
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Accessibility Statistics', margin, yPosition);
  yPosition += 12; // Reduced from 15 to 12
  
  // Stats table with proper styling
  const tableHeight = 50;
  checkNewPage(tableHeight);
  
  // Table headers
  const colWidth = contentWidth / 4;
  const headerHeight2 = 20;
  
  // Header row
  createBox(margin, yPosition, colWidth, headerHeight2, [59, 130, 246], [37, 99, 235]);
  createBox(margin + colWidth, yPosition, colWidth, headerHeight2, [239, 68, 68], [220, 38, 38]);
  createBox(margin + 2 * colWidth, yPosition, colWidth, headerHeight2, [245, 158, 11], [217, 119, 6]);
  createBox(margin + 3 * colWidth, yPosition, colWidth, headerHeight2, [34, 197, 94], [22, 163, 74]);
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Issues', margin + colWidth/2, yPosition + 12, { align: 'center' });
  doc.text('Critical', margin + colWidth + colWidth/2, yPosition + 12, { align: 'center' });
  doc.text('Warnings', margin + 2 * colWidth + colWidth/2, yPosition + 12, { align: 'center' });
  doc.text('Status', margin + 3 * colWidth + colWidth/2, yPosition + 12, { align: 'center' });
  
  // Data row
  yPosition += headerHeight2;
  createBox(margin, yPosition, colWidth, headerHeight2, [255, 255, 255], [226, 232, 240]);
  createBox(margin + colWidth, yPosition, colWidth, headerHeight2, [255, 255, 255], [226, 232, 240]);
  createBox(margin + 2 * colWidth, yPosition, colWidth, headerHeight2, [255, 255, 255], [226, 232, 240]);
  createBox(margin + 3 * colWidth, yPosition, colWidth, headerHeight2, [255, 255, 255], [226, 232, 240]);
  
  // Data text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(stats.total.toString(), margin + colWidth/2, yPosition + 12, { align: 'center' });
  doc.text(stats.critical.toString(), margin + colWidth + colWidth/2, yPosition + 12, { align: 'center' });
  doc.text(stats.warnings.toString(), margin + 2 * colWidth + colWidth/2, yPosition + 12, { align: 'center' });
  doc.text(stats.passed ? 'PASS' : 'FAIL', margin + 3 * colWidth + colWidth/2, yPosition + 12, { align: 'center' });
  
  yPosition += headerHeight2 + 20; // Reduced from 25 to 20
  
  // HTML Code Section
  if (html.trim()) {
    // Calculate proper height for complete code display
    const htmlLines = html.split('\n');
    const lineHeight = 4; // Reduced line height for better fit
    const totalCodeHeight = htmlLines.length * lineHeight + 20; // Add padding
    
    // Check if we need a new page for the complete code section
    checkNewPage(totalCodeHeight + 30); // Add space for heading + content
    
    // Heading and code on same page
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Submitted HTML Code', margin, yPosition);
    yPosition += 15;
    
    // Create code box with proper height
    createBox(margin, yPosition, contentWidth, totalCodeHeight, [249, 250, 251], [209, 213, 219]);
    
    yPosition += 10;
    doc.setFontSize(8); // Smaller font to fit more content
    doc.setFont('helvetica', 'normal'); // Consistent font family
    doc.setTextColor(55, 65, 81);
    
    // Display all HTML lines without truncation
    htmlLines.forEach((line, index) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Add line numbers and wrap long lines properly
      const lineNumber = (index + 1).toString().padStart(3, ' ');
      
      // Wrap long lines to fit within margins (accounting for line numbers and padding)
      const maxLineWidth = contentWidth - 20; // Leave margin inside the box
      const wrappedLines = doc.splitTextToSize(line, maxLineWidth);
      
      // Display line number and first part of line
      doc.text(`${lineNumber}: ${wrappedLines[0]}`, margin + 5, yPosition);
      yPosition += lineHeight;
      
      // If line was wrapped, display remaining parts
      for (let i = 1; i < wrappedLines.length; i++) {
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        // Indent wrapped lines for better readability
        doc.text(`     ${wrappedLines[i]}`, margin + 5, yPosition);
        yPosition += lineHeight;
      }
    });
    
    yPosition += 15;
  }
  
  // Violations Section
  if (violations.length > 0) {
    // Always start violations on a new page for better visual separation
    doc.addPage();
    yPosition = margin;
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Accessibility Violations', margin, yPosition);
    yPosition += 12; // Reduced from 15 to 12
    
    violations.forEach((violation, index) => {
      if (!violation || !violation.ruleId || !violation.message) return;
      
      const violationHeight = 70; // Increased from 65 to 70 for better spacing
      checkNewPage(violationHeight);
      
      // Determine severity and colors
      const isCritical = violation.ruleId.includes('DOC_LANG') || 
                        violation.ruleId.includes('IMG_ALT') || 
                        violation.ruleId.includes('LINK_GENERIC');
      
      const severityColor = isCritical ? [239, 68, 68] : [245, 158, 11];
      const severityBorderColor = isCritical ? [220, 38, 38] : [217, 119, 6];
      const severityLabel = isCritical ? 'CRITICAL' : 'WARNING';
      
      // Create violation box with better styling
      createBox(margin, yPosition, contentWidth, violationHeight, [255, 255, 255], severityBorderColor);
      
      // Severity badge
      doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
      doc.rect(margin + 10, yPosition + 8, 30, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(severityLabel, margin + 25, yPosition + 18, { align: 'center' });
      
      // Issue title
      yPosition += 8;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
      doc.text(`Issue ${index + 1}: ${violation.ruleId}`, margin + 50, yPosition);
      
      yPosition += 10; // Increased from 8 to 10 for better spacing
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 65, 81);
      addWrappedText(violation.message, margin + 50, yPosition, contentWidth - 60, 11);
      
      yPosition += 18; // Increased from 15 to 18 for better spacing
      if (violation.element) {
        doc.setFontSize(9);
        doc.setFont('courier', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(`Element: ${violation.element}`, margin + 50, yPosition);
      }
      
      yPosition += 10; // Increased from 8 to 10 for better spacing
    });
  } else {
    // No violations message - also start on new page for consistency
    doc.addPage();
    yPosition = margin;
    
    const noViolationsHeight = 40;
    checkNewPage(noViolationsHeight);
    
    createBox(margin, yPosition, contentWidth, noViolationsHeight, [34, 197, 94], [22, 163, 74]);
    
    yPosition += 12;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('No Accessibility Violations Found!', margin + 15, yPosition);
    
    yPosition += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    doc.text('Your HTML code meets all accessibility standards.', margin + 15, yPosition);
    
    yPosition += 20; // Reduced from 25 to 20
  }
  
  // Footer
  checkNewPage(30);
  
  // Footer separator
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(107, 114, 128);
  doc.text('Generated by ADA Compliance Checker', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text('For professional accessibility auditing, consult with certified accessibility experts.', pageWidth / 2, yPosition, { align: 'center' });
  
  // Save the PDF
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  doc.save(`ADA-Compliance-Report-${timestamp}.pdf`);
};

// Alternative function that captures the current page as a screenshot
export const generateScreenshotReport = async () => {
  try {
    // Capture the main content area
    const element = document.querySelector('[data-testid="main-content"]') || document.body;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit the image
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    
    // Center the image
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;
    
    doc.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    doc.save(`ada-compliance-screenshot-${timestamp}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating screenshot report:', error);
    return false;
  }
};
