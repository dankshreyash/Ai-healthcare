/**
 * AI Chat page.
 * Renders the full chatbot UI for natural language interactions.
 */

import { Box, Card, CardContent, Typography } from '@mui/material';
import ChatInterface from '../components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          AI Chat Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Log interactions, search history, and generate summaries using natural language.
        </Typography>
      </Box>

      <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <ChatInterface />
        </CardContent>
      </Card>
    </Box>
  );
}
