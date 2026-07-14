import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { sendMessage, addUserMessage } from '../../redux/chatSlice';
import ChatMessage from './ChatMessage';

const SUGGESTED_PROMPTS = [
  "I met Dr Sharma today at Apollo Hospital. We discussed our diabetes medicine. Follow up next Tuesday.",
  "Show me all interactions with doctors in Mumbai",
  "Generate follow-up suggestions for my last meeting",
  "Give me a management summary of recent interactions",
];

export default function ChatInterface() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text) => {
    const messageToSend = text || inputValue;
    if (!messageToSend.trim()) return;

    dispatch(addUserMessage(messageToSend));
    setInputValue('');
    
    // We pass null for interactionId initially, the backend can use the latest or we could manage it in state
    dispatch(sendMessage({ message: messageToSend, interactionId: null }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '75vh' }}>
      
      {/* Chat Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
              gap: 3,
            }}
          >
            <Typography variant="h6" align="center">
              Welcome to the AI Chat Assistant!
            </Typography>
            <Typography variant="body2" align="center" sx={{ maxWidth: 400 }}>
              You can log interactions, search history, edit records, or ask for summaries using natural language.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <Chip
                  key={index}
                  label={prompt}
                  onClick={() => handleSend(prompt)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}

        {/* Typing Indicator */}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              AI is thinking...
            </Typography>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mt: 2,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'background.paper',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.default',
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || loading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
            p: 1.5,
          }}
        >
          <SendRoundedIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
