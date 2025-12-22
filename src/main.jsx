import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';


import App from './App.jsx';

import 'flowbite/dist/flowbite.css';

// MUI + RTL + ThemeContext
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

import { ThemeProvider } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import i18n from './i18n.js';

import { ThemeProviderContext, useThemeContext } from './services/theme_context.jsx';

// مكون ملف عادي لتغليف التطبيق بالثيم والمراجعة حسب اللغة
function MainWrapper() {
  const { i18n } = useTranslation();

  // ضبط الكاش حسب اتجاه اللغة (RTL أو LTR)
  const cache = createCache({
    key: i18n.language === 'ar' ? 'mui-rtl' : 'mui-ltr',
    stylisPlugins: i18n.language === 'ar' ? [prefixer, rtlPlugin] : [],
  });

  // استخدام الثيم Context
  const { theme } = useThemeContext();

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CacheProvider>
    
  );
}

// نغلف التطبيق بالـ ThemeProviderContext عشان يتوفر الثيم في كل مكان
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProviderContext direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <MainWrapper />
    </ThemeProviderContext>
  </StrictMode>
);
