/**
 * Main layout wrapper.
 * Combines Sidebar + TopBar + main content area.
 */

import { useState } from 'react';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import TopBar from './TopBar';

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <TopBar onMenuToggle={() => setMobileOpen((prev) => !prev)} />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Toolbar spacer to push content below AppBar */}
        <Toolbar />

        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: 1400,
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
