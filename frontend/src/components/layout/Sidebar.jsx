/**
 * Navigation sidebar / drawer.
 * Contains links to all 4 main pages with icons and active state highlighting.
 */

import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';

export const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: <DashboardRoundedIcon /> },
  { label: 'Log Interaction', path: '/log', icon: <AddCircleRoundedIcon /> },
  { label: 'Interaction History', path: '/history', icon: <HistoryRoundedIcon /> },
  { label: 'AI Chat', path: '/chat', icon: <SmartToyRoundedIcon /> },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      }}
    >
      {/* Logo / Brand */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
            boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)',
          }}
        >
          <LocalHospitalRoundedIcon sx={{ fontSize: 22 }} />
        </Avatar>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            HealthCRM
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: -0.3 }}
          >
            AI-Powered HCP Module
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.6 }} />

      {/* Navigation links */}
      <List sx={{ px: 1, py: 1.5, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose?.();
              }}
              sx={{
                mb: 0.5,
                py: 1.2,
                '& .MuiListItemIcon-root': {
                  color: isActive ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                  transition: 'color 0.2s',
                },
                '& .MuiListItemText-primary': {
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'primary.main' : 'text.primary',
                  fontSize: '0.9rem',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {isActive && (
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    position: 'absolute',
                    right: 8,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
          Pharma Sales CRM v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile: temporary drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop: permanent drawer */
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
