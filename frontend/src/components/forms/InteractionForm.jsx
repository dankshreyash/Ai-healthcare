import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import toast from 'react-hot-toast';
import { createInteraction, updateInteraction } from '../../redux/interactionSlice';

const INTERACTION_TYPES = [
  'In-Person',
  'Virtual',
  'Phone Call',
  'Email',
  'Conference',
  'Other',
];

export default function InteractionForm({ initialData = null, onSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.interactions);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData || {
      doctor_name: '',
      hospital: '',
      specialty: '',
      interaction_date: new Date().toISOString().split('T')[0],
      interaction_type: 'In-Person',
      discussion_notes: '',
      products_discussed: '',
      follow_up_date: '',
      follow_up_action: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // Clean up empty string dates to null to avoid backend validation errors if expecting Date or None
      const payload = {
        ...data,
        follow_up_date: data.follow_up_date || null,
      };

      if (initialData && initialData.id) {
        await dispatch(updateInteraction({ id: initialData.id, data: payload })).unwrap();
        toast.success('Interaction updated successfully!');
      } else {
        await dispatch(createInteraction(payload)).unwrap();
        toast.success('Interaction logged successfully!');
      }
      
      reset();
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/history'); // Redirect to history after logging
      }
    } catch (error) {
      toast.error(error || 'Failed to save interaction');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="doctor_name"
            control={control}
            rules={{ required: 'Doctor Name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Doctor Name"
                error={!!errors.doctor_name}
                helperText={errors.doctor_name?.message}
                placeholder="Dr. Sharma"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="hospital"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Hospital"
                placeholder="Apollo Hospital"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="specialty"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Specialty"
                placeholder="Cardiology"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="interaction_type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Interaction Type"
              >
                {INTERACTION_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="interaction_date"
            control={control}
            rules={{ required: 'Interaction Date is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                fullWidth
                type="date"
                label="Interaction Date"
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.interaction_date}
                helperText={errors.interaction_date?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="products_discussed"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Products Discussed"
                placeholder="Medicine A, Medicine B"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="discussion_notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                label="Discussion Notes"
                placeholder="Discussed patient outcomes and provided samples..."
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary', fontSize: '1rem' }}>
            Follow-up Actions
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="follow_up_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                fullWidth
                type="date"
                label="Follow-up Date"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={8}>
          <Controller
            name="follow_up_action"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Follow-up Action"
                placeholder="Send clinical trial documents"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Saving...' : 'Save Interaction'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
