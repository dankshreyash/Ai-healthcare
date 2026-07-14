/**
 * Log Interaction page.
 * Uses the structured InteractionForm.
 */

import { Box, Card, CardContent, Typography } from '@mui/material';
import InteractionForm from '../components/forms/InteractionForm';

export default function LogInteractionPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Log Interaction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Record a new meeting or interaction with a healthcare professional.
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <InteractionForm />
        </CardContent>
      </Card>
    </Box>
  );
}
