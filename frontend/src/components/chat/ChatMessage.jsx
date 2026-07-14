import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 2,
        mb: 3,
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? 'primary.main' : isError ? 'error.main' : 'secondary.main',
          width: 36,
          height: 36,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {isUser ? (
          <PersonRoundedIcon sx={{ fontSize: 20 }} />
        ) : (
          <SmartToyRoundedIcon sx={{ fontSize: 20 }} />
        )}
      </Avatar>

      <Paper
        elevation={0}
        sx={{
          maxWidth: '75%',
          p: 2,
          borderRadius: 3,
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          border: isUser ? 'none' : '1px solid',
          borderColor: isError ? 'error.light' : 'divider',
          borderTopRightRadius: isUser ? 4 : 24,
          borderTopLeftRadius: !isUser ? 4 : 24,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            fontFamily: 'Inter',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            '& p': { m: 0 },
            '& p + p': { mt: 1 },
            '& ul, & ol': { mt: 1, mb: 1, pl: 3 },
            '& li': { mb: 0.5 },
            '& strong': { fontWeight: 600 },
          }}
        >
          {isUser ? (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Typography>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </Box>
        
        {/* Render extracted data if available (e.g., after logging) */}
        {!isUser && message.data && message.action !== 'search_interaction' && (
           <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
             <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
               Extracted Data:
             </Typography>
             <Box component="pre" sx={{ m: 0, fontSize: '0.75rem', overflowX: 'auto', color: 'text.secondary', fontFamily: 'monospace' }}>
               {JSON.stringify(message.data, null, 2)}
             </Box>
           </Box>
        )}
      </Paper>
    </Box>
  );
}
