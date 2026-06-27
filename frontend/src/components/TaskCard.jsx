import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Checkbox,
  Tooltip,
  Divider,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, onDelete, onStatusToggle }) => {
  const navigate = useNavigate();
  const isCompleted = task.status === 'Completed';

  // Helper to format due dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get Priority Badge Color
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'High':
        return { color: '#ef4444', label: 'High', bgColor: 'rgba(239, 68, 68, 0.1)' };
      case 'Medium':
        return { color: '#f59e0b', label: 'Medium', bgColor: 'rgba(245, 158, 11, 0.1)' };
      case 'Low':
      default:
        return { color: '#10b981', label: 'Low', bgColor: 'rgba(16, 185, 129, 0.1)' };
    }
  };

  // Get Status Chip color
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'Completed':
        return { color: 'success', label: 'Completed' };
      case 'In Progress':
        return { color: 'info', label: 'In Progress' };
      case 'Pending':
      default:
        return { color: 'warning', label: 'Pending' };
    }
  };

  // Get Category Chip colors
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work':
        return { bg: '#e0e7ff', text: '#3730a3' }; // Indigo
      case 'Study':
        return { bg: '#ccfbf1', text: '#115e59' }; // Teal
      case 'Personal':
      default:
        return { bg: '#f3e8ff', text: '#6b21a8' }; // Purple
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusProps = getStatusChipProps(task.status);
  const categoryColor = getCategoryColor(task.category);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        opacity: isCompleted ? 0.8 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Category & Status Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Chip
            label={task.category}
            size="small"
            sx={{
              backgroundColor: categoryColor.bg,
              color: categoryColor.text,
              fontWeight: 600,
              fontSize: '11px',
              borderRadius: '6px',
            }}
          />
          <Chip 
            label={statusProps.label} 
            color={statusProps.color} 
            size="small" 
            variant="outlined" 
            sx={{ fontWeight: 600, fontSize: '11px', height: 22 }}
          />
        </Box>

        {/* Checkbox and Title */}
        <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
          <Tooltip title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}>
            <Checkbox
              checked={isCompleted}
              onChange={() => onStatusToggle(task)}
              color="success"
              size="small"
              sx={{ p: 0, mt: 0.5 }}
            />
          </Tooltip>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              lineHeight: 1.3,
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'text.secondary' : 'text.primary',
              wordBreak: 'break-word',
            }}
          >
            {task.title}
          </Typography>
        </Box>

        {/* Task Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            mt: 0.5,
            flexGrow: 1,
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description || <i>No description provided</i>}
        </Typography>

        <Divider sx={{ my: 1.5, opacity: 0.5 }} />

        {/* Footer Area */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
          {/* Priority & Date Information */}
          <Box display="flex" flexDirection="column" gap={0.5}>
            {/* Priority Indicator */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <FlagIcon sx={{ color: priorityConfig.color, fontSize: '14px' }} />
              <Typography variant="caption" sx={{ color: priorityConfig.color, fontWeight: 700 }}>
                {priorityConfig.label}
              </Typography>
            </Box>
            {/* Due Date */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: '12px' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {formatDate(task.dueDate)}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box display="flex">
            <Tooltip title="Edit Task">
              <IconButton 
                size="small" 
                onClick={() => navigate(`/edit-task/${task._id}`)}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)' }
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton 
                size="small" 
                onClick={() => onDelete(task._id)}
                sx={{ 
                  color: 'error.main',
                  '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' }
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
