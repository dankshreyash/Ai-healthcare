/**
 * Top AppBar component.
 * Shows page title, hamburger menu on mobile, and user area.
 */

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from './Sidebar';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/log': 'Log Interaction',
  '/history': 'Interaction History',
  '/chat': 'AI Chat Assistant',
};

export default function TopBar({ onMenuToggle }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pageTitle = PAGE_TITLES[location.pathname] || 'HealthCRM';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onMenuToggle}
            sx={{ mr: 1.5, color: 'text.primary' }}
            aria-label="open navigation menu"
          >
            <MenuRoundedIcon />
          </IconButton>
        )}

        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" sx={{ fontSize: '1.25rem' }}>
            {pageTitle}
          </Typography>
        </Box>

        {/* User avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              Sales Representative
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              Pharma Division
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.light',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <PersonRoundedIcon sx={{ fontSize: 20 }} />
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
