import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import TaskForm from '../components/TaskForm';

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await API.post('/tasks', formData);
      if (response.data && response.data.success) {
        toast.success('Task created successfully!');
        navigate('/');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create task.';
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" className="fade-in" sx={{ py: 2 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="800" sx={{ fontFamily: 'Outfit' }}>
          Create New Task
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Create and assign a task to organize your workspace
        </Typography>
      </Box>

      <Card sx={{ border: 'none', p: { xs: 1, sm: 3 } }}>
        <CardContent>
          <TaskForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            submitLabel="Create Task" 
            loading={loading}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateTask;
