import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { SnackbarProvider } from "notistack";

import App from './App.jsx';

import 'flowbite/dist/flowbite.css';

// MUI + RTL + ThemeContext
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useTranslation } from 'react-i18next';
import i18n from './i18n.js';

import { ThemeProviderContext, useThemeContext } from './services/theme_context.jsx';

// ✅ QueryClient moved to module scope — singleton, not recreated on every render
const queryClient = new QueryClient();

// مكون ملف عادي لتغليف التطبيق بالثيم والمراجعة حسب اللغة
function MainWrapper() {
  const { i18n } = useTranslation();

  // ضبط الكاش حسب اتجاه اللغة (RTL أو LTR)
  const cache = createCache({
    key: i18n.language === 'ar' ? 'mui-rtl' : 'mui-ltr',
    stylisPlugins: i18n.language === 'ar' ? [prefixer, rtlPlugin] : [],
  });

  return (
    <CacheProvider value={cache}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <App />
        </SnackbarProvider>
      </QueryClientProvider>
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
