import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const TaskForm = ({ initialValues, onSubmit, onCancel, submitLabel = 'Save Task', loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    category: 'Personal',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form if editing
  useEffect(() => {
    if (initialValues) {
      // Format due date to YYYY-MM-DD for text input type="date"
      let formattedDate = '';
      if (initialValues.dueDate) {
        formattedDate = new Date(initialValues.dueDate).toISOString().split('T')[0];
      }
      
      setFormData({
        title: initialValues.title || '',
        description: initialValues.description || '',
        priority: initialValues.priority || 'Medium',
        status: initialValues.status || 'Pending',
        category: initialValues.category || 'Personal',
        dueDate: formattedDate,
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.title.trim()) {
      tempErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      tempErrors.title = 'Title cannot exceed 100 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // If due date is empty string, we pass null to database
      const payload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      };
      onSubmit(payload);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        {/* Task Title */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            placeholder="e.g. Complete Chemistry Project"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Task Description */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your task objectives..."
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Category Dropdown */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Study">Study</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Priority Dropdown */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={formData.priority}
              label="Priority"
              onChange={handleChange}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Status Dropdown */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Due Date Pick */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Action Controls */}
        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<CancelIcon />}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Saving...' : submitLabel}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskForm;
