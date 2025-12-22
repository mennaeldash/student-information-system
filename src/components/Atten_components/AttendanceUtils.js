// Helper function للحسابات الأوتوماتيكية
export const calculateCircleValues = (radius, strokeWidth, percentage) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;
  return { circumference, strokeDashoffset, normalizedRadius };
};
