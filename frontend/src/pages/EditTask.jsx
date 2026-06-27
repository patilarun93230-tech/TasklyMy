import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import TaskForm from '../components/TaskForm';
import LoadingComponent from '../components/LoadingComponent';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch task on mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await API.get(`/tasks/${id}`);
        if (response.data && response.data.success) {
          setTask(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to load task details.');
        console.error(error);
        navigate('/');
      } finally {
        setFetching(false);
      }
    };

    fetchTask();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await API.put(`/tasks/${id}`, formData);
      if (response.data && response.data.success) {
        toast.success('Task updated successfully!');
        navigate('/');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update task.';
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (fetching) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <LoadingComponent type="spinner" />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="fade-in" sx={{ py: 2 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="800" sx={{ fontFamily: 'Outfit' }}>
          Edit Task
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Update the task details below to keep your workspace current
        </Typography>
      </Box>

      <Card sx={{ border: 'none', p: { xs: 1, sm: 3 } }}>
        <CardContent>
          <TaskForm
            initialValues={task}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Update Task"
            loading={loading}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditTask;
