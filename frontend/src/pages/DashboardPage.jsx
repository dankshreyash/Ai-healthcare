/**
 * Dashboard page.
 * Shows key metrics, recent interactions, and upcoming follow-ups connected to backend.
 */

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  alpha,
  CircularProgress,
  Chip
} from '@mui/material';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import { fetchInteractions } from '../redux/interactionSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { interactions, total, loading } = useSelector((state) => state.interactions);

  useEffect(() => {
    // Only fetch if we haven't loaded them yet to avoid unnecessary re-fetches on navigation, 
    // or we can fetch every time to stay fresh. Let's fetch every time for fresh dashboard data.
    dispatch(fetchInteractions({ limit: 100 }));
  }, [dispatch]);

  const stats = useMemo(() => {
    const uniqueDoctors = new Set(interactions.map(i => i.doctor_name)).size;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let thisMonthCount = 0;
    let pendingFollowUps = 0;

    interactions.forEach(interaction => {
      if (interaction.interaction_date) {
        const iDate = new Date(interaction.interaction_date);
        if (iDate.getMonth() === currentMonth && iDate.getFullYear() === currentYear) {
          thisMonthCount++;
        }
      }
      
      if (interaction.follow_up_date) {
        const fDate = new Date(interaction.follow_up_date);
        if (fDate >= today) {
          pendingFollowUps++;
        }
      }
    });

    return {
      totalInteractions: total,
      uniqueDoctors,
      pendingFollowUps,
      thisMonthCount
    };
  }, [interactions, total]);

  const STAT_CARDS = [
    {
      label: 'Total Interactions',
      value: loading ? <CircularProgress size={24} /> : stats.totalInteractions,
      icon: <EventNoteRoundedIcon />,
      color: '#1565C0',
      bgGradient: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
    },
    {
      label: 'Doctors Contacted',
      value: loading ? <CircularProgress size={24} /> : stats.uniqueDoctors,
      icon: <PeopleRoundedIcon />,
      color: '#00897B',
      bgGradient: 'linear-gradient(135deg, #00897B 0%, #4DB6AC 100%)',
    },
    {
      label: 'Pending Follow-ups',
      value: loading ? <CircularProgress size={24} /> : stats.pendingFollowUps,
      icon: <ScheduleRoundedIcon />,
      color: '#F57C00',
      bgGradient: 'linear-gradient(135deg, #F57C00 0%, #FFB74D 100%)',
    },
    {
      label: 'This Month',
      value: loading ? <CircularProgress size={24} /> : stats.thisMonthCount,
      icon: <TrendingUpRoundedIcon />,
      color: '#7B1FA2',
      bgGradient: 'linear-gradient(135deg, #7B1FA2 0%, #BA68C8 100%)',
    },
  ];

  const recentInteractions = [...interactions].slice(0, 5);
  
  const upcomingFollowUps = [...interactions]
    .filter(i => i.follow_up_date && new Date(i.follow_up_date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.follow_up_date) - new Date(b.follow_up_date))
    .slice(0, 5);

  return (
    <Box>
      {/* Welcome banner */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)',
          color: 'white',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <CardContent sx={{ p: 3.5, position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 0.5 }}>
            Welcome back!
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500 }}>
            Manage your healthcare professional interactions, track follow-ups,
            and let AI assist you in building stronger relationships.
          </Typography>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {STAT_CARDS.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Avatar sx={{ background: stat.bgGradient, width: 44, height: 44, boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}` }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 800, mb: 0.25 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent interactions + Follow-ups */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5, height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Recent Interactions
              </Typography>
              {loading && interactions.length === 0 ? (
                <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
              ) : recentInteractions.length > 0 ? (
                <List disablePadding>
                  {recentInteractions.map((interaction, i) => (
                    <React.Fragment key={interaction.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            <LocalHospitalRoundedIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="600">
                              {interaction.doctor_name}
                            </Typography>
                          }
                          secondary={
                            <Box mt={0.5}>
                              <Typography component="span" variant="body2" color="text.primary" display="block">
                                {interaction.hospital} • {interaction.interaction_date}
                              </Typography>
                              <Typography component="span" variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                "{interaction.summary || interaction.discussion_notes || 'No notes available.'}"
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip label={interaction.interaction_type} size="small" variant="outlined" color="primary" sx={{ ml: 2, mt: 1 }} />
                      </ListItem>
                      {i < recentInteractions.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent interactions found.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5, height: '100%' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Upcoming Follow-ups
              </Typography>
              {loading && interactions.length === 0 ? (
                <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
              ) : upcomingFollowUps.length > 0 ? (
                <List disablePadding>
                  {upcomingFollowUps.map((interaction, i) => (
                    <React.Fragment key={interaction.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.light' }}>
                            <ScheduleRoundedIcon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="600" color="secondary.dark">
                              {interaction.follow_up_date}
                            </Typography>
                          }
                          secondary={
                            <Box mt={0.5}>
                              <Typography component="span" variant="body2" color="text.primary" display="block" fontWeight={500}>
                                {interaction.doctor_name}
                              </Typography>
                              <Typography component="span" variant="body2" color="text.secondary" display="block">
                                Action: {interaction.follow_up_action}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {i < upcomingFollowUps.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No upcoming follow-ups scheduled.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
