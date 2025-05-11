import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Chip,
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Send as SendIcon, 
  SmartToy as AIIcon, 
  Person as UserIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

const AITutor = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const messagesEndRef = useRef(null);

  // Load chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`/api/gemini/history/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const formattedMessages = res.data.flatMap(chat => [
          { text: chat.question, sender: 'user' },
          { text: chat.answer, sender: 'ai' }
        ]);
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    };
    
    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:3000/api/ai/ask', 
        { question: input, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const aiMsg = { text: res.data.answer, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error('AI Error:', err);
      setMessages(prev => [...prev, { 
        text: err.response?.data?.error || "Sorry, I couldn't process your request.", 
        sender: 'ai' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 3,
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <Box sx={{
        p: 2,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        display: 'flex',
        alignItems: 'center'
      }}>
        <AIIcon sx={{ mr: 1 }} />
        <Typography variant="h6">AI Learning Assistant</Typography>
      </Box>

      {/* Chat Messages */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        p: 2,
        bgcolor: 'background.default'
      }}>
        <List>
          {messages.map((msg, i) => (
            <React.Fragment key={i}>
              <ListItem sx={{
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                px: 0
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '90%'
                }}>
                  <Avatar sx={{
                    bgcolor: msg.sender === 'user' ? 'secondary.main' : 'primary.main',
                    width: 32,
                    height: 32
                  }}>
                    {msg.sender === 'user' ? <UserIcon fontSize="small" /> : <AIIcon fontSize="small" />}
                  </Avatar>
                  <Box sx={{
                    p: 1.5,
                    borderRadius: msg.sender === 'user' 
                      ? '18px 18px 0 18px' 
                      : '18px 18px 18px 0',
                    bgcolor: msg.sender === 'user' ? 'secondary.light' : 'primary.light',
                    wordBreak: 'break-word',
                    maxWidth: '100%'
                  }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              {i < messages.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <CircularProgress size={24} />
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Box sx={{ 
          p: 2,
          bgcolor: 'warning.light',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LightbulbIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" color="text.secondary">
              Recommended Resources
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {recommendations.map((rec, i) => (
              <Chip
                key={i}
                label={rec.title}
                onClick={() => window.open(rec.url, '_blank')}
                sx={{ cursor: 'pointer' }}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Input Area */}
      <Box sx={{ 
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask your AI tutor anything..."
            disabled={isLoading}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            sx={{ alignSelf: 'flex-end' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AITutor;

