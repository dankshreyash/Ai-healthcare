/**
 * Interaction History page.
 * Displays a searchable, filterable list of all past interactions.
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { fetchInteractions } from '../redux/interactionSlice';
import InteractionForm from '../components/forms/InteractionForm';

export default function HistoryPage() {
  const dispatch = useDispatch();
  const { interactions, loading, error } = useSelector((state) => state.interactions);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      dispatch(fetchInteractions({ search: searchTerm }));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchInteractions({ search: searchTerm }));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'In-Person': return 'primary';
      case 'Virtual': return 'secondary';
      case 'Phone Call': return 'info';
      case 'Email': return 'success';
      case 'Conference': return 'warning';
      default: return 'default';
    }
  };

  const handleEditClick = (interaction) => {
    setSelectedInteraction(interaction);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedInteraction(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Interaction History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your past meetings and track upcoming follow-ups.
        </Typography>
      </Box>

      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search by doctor, hospital, product, or notes... (Press Enter)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Card>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Failed to load interactions: {error}
        </Typography>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hospital/Specialty</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Products</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Follow-up</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && interactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : interactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No interactions found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              interactions.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{row.interaction_date}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.doctor_name}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.hospital || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.specialty || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.interaction_type} size="small" color={getTypeColor(row.interaction_type)} variant="outlined" />
                  </TableCell>
                  <TableCell>{row.products_discussed || '—'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.follow_up_date || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.follow_up_action}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Interaction">
                      <IconButton onClick={() => handleEditClick(row)} color="primary" size="small">
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Interaction Modal */}
      <Dialog 
        open={editModalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Interaction</DialogTitle>
        <DialogContent dividers>
          {selectedInteraction && (
            <InteractionForm 
              initialData={selectedInteraction} 
              onSuccess={handleCloseModal} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
