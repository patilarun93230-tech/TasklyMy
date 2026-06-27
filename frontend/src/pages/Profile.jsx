import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const Profile = () => {
  const { user } = useAuth();
  const [taskCount, setTaskCount] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        const response = await API.get('/tasks/stats');
        if (response.data && response.data.success) {
          setTaskCount({
            total: response.data.data.total,
            completed: response.data.data.status.Completed,
          });
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error);
      }
    };
    fetchProfileStats();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Container maxWidth="md" className="fade-in" sx={{ py: 2 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="800" sx={{ fontFamily: 'Outfit' }}>
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          View your profile details and overall performance statistics
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: 'none', height: '100%', p: 2 }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" py={2}>
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    fontSize: '36px',
                    fontWeight: 700,
                    mb: 2,
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.25)',
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Typography variant="h5" fontWeight="700" sx={{ fontFamily: 'Outfit' }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Workspace Member
                </Typography>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Box display="flex" flexDirection="column" gap={2} textAlign="left">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <EmailIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email Address</Typography>
                    <Typography variant="body2" fontWeight="500">{user?.email}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <CalendarMonthIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Member Since</Typography>
                    <Typography variant="body2" fontWeight="500">{formatDate(user?.createdAt)}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: 'none', height: '100%', p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="700" mb={3} sx={{ fontFamily: 'Outfit' }}>
                Performance Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 2.5, backgroundColor: 'action.hover', borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">Total Created</Typography>
                    <Typography variant="h3" fontWeight="800" color="primary.main" sx={{ mt: 1, fontFamily: 'Outfit' }}>
                      {taskCount.total}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 2.5, backgroundColor: 'action.hover', borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">Completed</Typography>
                    <Typography variant="h3" fontWeight="800" color="success.main" sx={{ mt: 1, fontFamily: 'Outfit' }}>
                      {taskCount.completed}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      p: 2.5, 
                      backgroundColor: 'rgba(79, 70, 229, 0.04)', 
                      borderRadius: 3, 
                      textAlign: 'center', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1.5
                    }}
                  >
                    <TaskAltIcon color="primary" />
                    <Typography variant="body2" fontWeight="600" color="text.primary">
                      Completion Rate: {taskCount.total > 0 ? Math.round((taskCount.completed / taskCount.total) * 100) : 0}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
