import { FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

export const getViolationIcon = (ruleId) => {
  if (ruleId.includes('DOC_LANG') || ruleId.includes('IMG_ALT') || ruleId.includes('LINK_GENERIC')) return FiXCircle;
  if (ruleId.includes('COLOR_CONTRAST') || ruleId.includes('HEADING_ORDER')) return FiAlertTriangle;
  return FiInfo;
};

export const getViolationColor = (ruleId) => {
  if (ruleId.includes('DOC_LANG') || ruleId.includes('IMG_ALT') || ruleId.includes('LINK_GENERIC')) return 'red';
  if (ruleId.includes('COLOR_CONTRAST') || ruleId.includes('HEADING_ORDER')) return 'orange';
  return 'gray';
};

export const getViolationStatus = (ruleId) => {
  if (ruleId.includes('DOC_LANG') || ruleId.includes('IMG_ALT') || ruleId.includes('LINK_GENERIC')) return 'error';
  if (ruleId.includes('COLOR_CONTRAST') || ruleId.includes('HEADING_ORDER')) return 'warning';
  return 'gray';
};

export const calculateStats = (violations) => {
  const critical = violations.filter(v => 
    v && v.ruleId && (
      v.ruleId.includes('DOC_LANG') || 
      v.ruleId.includes('IMG_ALT') || 
      v.ruleId.includes('LINK_GENERIC')
    )
  ).length;
  
  const warnings = violations.filter(v => 
    v && v.ruleId && (
      v.ruleId.includes('COLOR_CONTRAST') || 
      v.ruleId.includes('HEADING_ORDER')
    )
  ).length;
  
  const passed = violations.length === 0 ? 1 : 0;
  
  return {
    total: violations.length,
    critical,
    warnings,
    passed
  };
};
