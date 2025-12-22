import { createTheme } from '@mui/material/styles';

const theme = (direction) =>
  createTheme({
    direction, // 'rtl' أو 'ltr'
    typography: {
      fontFamily: "'Cairo', sans-serif", // خط عربي جميل (اختياري)
    },
  });

export default theme;
