import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GlobalStyles from '@mui/material/GlobalStyles';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  NotificationsNone as NotificationsNoneIcon,
  WbSunny,
  NightlightRound,
  Home as HomeIcon,
  ImportContacts as ImportContactsIcon,
  AccountCircle as AccountCircleIcon,
  AlignVerticalBottom as AlignVerticalBottomIcon,
  CalendarToday as CalendarTodayIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import DrawerContent from '../components/DrawerContent';
import { useThemeContext } from '../services/theme_context.jsx';

const DRAWER_WIDTH = 250;

function ResponsiveDrawer(props) {
  const { window: windowProp } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', id: '', avatar: '' });

  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { mode, setMode, colors } = useThemeContext();

  useEffect(() => {
    setUserInfo({
      name: localStorage.getItem('user_name') || t('menna mohamed'),
      id: localStorage.getItem('user_id') || '2201996',
      avatar: localStorage.getItem('user_avatar') || '',
    });
  }, [i18n.language, t]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => { localStorage.clear(); navigate('/login'); };
  const toggleDarkMode = () => setMode(mode === 'dark' ? 'light' : 'dark');

  const menuItems = [
    { id: 1, key: 'dashboard', icon: <HomeIcon />, to: '/dashboard' },
        { id: 2, key: 'profile', icon: <AccountCircleIcon />, to: '/profile' },
    { id: 3, key: 'courses', icon: <ImportContactsIcon />, to: '/courses' },
    { id: 4, key: 'grades', icon: <AlignVerticalBottomIcon />, to: '/grades' },
    { id: 5, key: 'attendance', icon: <CalendarTodayIcon />, to: '/attendance' },
    { id: 6, key: 'Student Services', icon: <CalendarTodayIcon />, to: '/StudentServices' },
    { id: 7, key: 'settings', icon: <SettingsIcon />, to: '/settings' },
  ];

  const activeMenuItem = menuItems.find(item => location.pathname === item.to);
  const pageTitle = activeMenuItem ? t(activeMenuItem.key) : '';

  const container = windowProp !== undefined ? () => windowProp().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', fontFamily: colors?.fontFamily, minHeight: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <GlobalStyles styles={{
        html: { overflowX: 'hidden' },
        body: { overflowX: 'hidden' },
        '#root': { overflowX: 'hidden' }
      }} />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { xs: '100%', sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: colors?.box,
          color: colors?.secondary,
          fontFamily: colors?.fontFamily,
          border: `1px solid ${colors?.border}`,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '73px',
            // ↓ قلّلنا الجوانب على الموبايل
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* يسار: عنوان الصفحة + زر منيو يظهر فقط على XS لفتح السايدبار */}
          <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', minWidth: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'inline-flex', sm: 'none' }, mr: 0 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              sx={{
                fontWeight: 520,
                fontSize: '1.15rem',
                color: colors?.text,
                letterSpacing: '.2px',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {pageTitle}
            </Typography>
          </Box>

          {/* يمين: التاريخ + الكنترولز */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '.8rem',
                color: colors?.secondary,
                display: { xs: 'none', sm: 'block' },
                maxWidth: { sm: 240, md: 360 },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {new Date().toLocaleDateString(
                i18n.language === 'ar' ? 'ar-EG' : 'en-US',
                { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </Typography>

            <IconButton
              aria-label="change language"
              onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
              size="small"
              sx={{ color: colors?.secondary, mr: 1 }}
            >
              <LanguageIcon />
            </IconButton>

            <IconButton aria-label="notifications" size="small" sx={{ color: colors?.secondary }}>
              <NotificationsNoneIcon />
            </IconButton>

            <IconButton
              aria-label="toggle dark mode"
              onClick={toggleDarkMode}
              size="small"
              sx={{ color: colors?.secondary }}
            >
              {mode === 'dark' ? <WbSunny /> : <NightlightRound />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawers */}
      {/* Mobile drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        <DrawerContent
          userInfo={userInfo}
          themeColors={colors}
          menuItems={menuItems}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
          t={t}
        />
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
        open
      >
        <DrawerContent
          userInfo={userInfo}
          themeColors={colors}
          menuItems={menuItems}
          handleLogout={handleLogout}
          setMobileOpen={setMobileOpen}
          t={t}
        />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          minHeight: 0,
          flexGrow: 1,
          width: { xs: '100%', sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginInlineStart: { sm: `${DRAWER_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          height: 'calc(100vh - 73px)',
          bgcolor: colors?.background,
          color: colors?.text,
          fontFamily: colors?.fontFamily,
          mt: '73px',
          // ↓ قلّلنا الجوانب على الموبايل لزيادة عرض المحتوى
          paddingInline: { xs: '3px', sm: '16px', md: '10px' },
          maxWidth: 'none',
          mx: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = { window: PropTypes.func };
export default ResponsiveDrawer;
