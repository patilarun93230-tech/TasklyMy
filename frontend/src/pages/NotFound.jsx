import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        textAlign="center"
        className="fade-in"
        gap={3}
      >
        <Box 
          sx={{ 
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
            borderRadius: '50%',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: 80, color: 'primary.main' }} />
        </Box>
        <Typography variant="h3" fontWeight="800" sx={{ fontFamily: 'Outfit' }}>
          404 - Lost in Space
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, px: 2 }}>
          The page you requested does not exist or has been moved to another location.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')} 
          sx={{ py: 1.5, px: 4, borderRadius: 2.5 }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
