
const riskScoring = {
  TAB_SWITCH: { weight: 10, label: 'Tab Switch / Hidden' },
  FULLSCREEN_EXIT: { weight: 15, label: 'Fullscreen Exit' },
  COPY_PASTE: { weight: 8, label: 'Copy / Paste Attempt' },
  MOUSE_LEFT: { weight: 5, label: 'Mouse Left Window' },
  DEV_TOOLS: { weight: 20, label: 'Developer Tools Open' },
  MULTIPLE_FACES: { weight: 25, label: 'Multiple Faces Detected' },
  NO_FACE: { weight: 15, label: 'Face Not Detected' },
  DEVICE_CHANGE: { weight: 50, label: 'Device Changed' }
};

export const calculateRiskScore = (violations) => {
  let totalScore = 0;
  const breakdown = {};

  violations.forEach(v => {
    const risk = riskScoring[v.type] || { weight: 5, label: 'Unknown Violation' };
    totalScore += risk.weight;
    breakdown[risk.label] = (breakdown[risk.label] || 0) + 1;
  });

  let riskLevel = 'LOW';
  if (totalScore > 30) riskLevel = 'MEDIUM';
  if (totalScore > 70) riskLevel = 'HIGH';
  if (totalScore > 100) riskLevel = 'CRITICAL';

  return { totalScore, riskLevel, breakdown };
};

export const RISK_THRESHOLDS = {
  WARNING: 30,
  AUTO_SUBMIT: 100
};
