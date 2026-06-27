import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  useTheme,
  Collapse,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import LoadingComponent from '../components/LoadingComponent';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import FilterComponent from '../components/FilterComponent';
import PaginationComponent from '../components/PaginationComponent';
import ConfirmationModal from '../components/ConfirmationModal';

// Chart.js imports
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Icons
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Task & Stats State
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Search, Filter, Sort and Pagination State
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Collapsible Filters
  const [showFilters, setShowFilters] = useState(false);

  // Delete Dialog State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await API.get('/tasks/stats');
      if (response.data && response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching task statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Tasks with filters
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (search.trim()) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.category) params.category = filters.category;

      const response = await API.get('/tasks', { params });
      if (response.data && response.data.success) {
        setTasks(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalTasks(response.data.pagination.totalTasks);
      }
    } catch (error) {
      toast.error('Failed to load tasks.');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, filters, sortBy, sortOrder]);

  // Execute queries on change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, tasks]); // Update statistics when tasks modify

  // Status Toggler for Quick Checkbox Action (Zero Refresh updates)
  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const response = await API.put(`/tasks/${task._id}`, { status: newStatus });
      if (response.data && response.data.success) {
        // Update state locally
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === task._id ? response.data.data : t))
        );
        toast.success(`Task status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update task status.');
      console.error(error);
    }
  };

  // Open Delete dialog
  const handleDeleteRequest = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  // Confirm and delete task
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      const response = await API.delete(`/tasks/${taskToDelete}`);
      if (response.data && response.data.success) {
        toast.success('Task deleted successfully.');
        setTasks((prev) => prev.filter((t) => t._id !== taskToDelete));
        // Reset page if we delete the last item of a page
        if (tasks.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
      }
    } catch (error) {
      toast.error('Failed to delete task.');
      console.error(error);
    } finally {
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // Filter Updates
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1); // Reset back to first page
  };

  // Sort Updates
  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setFilters({ status: '', priority: '', category: '' });
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  // Chart Styling Data
  const isDark = theme.palette.mode === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const statusDoughnutData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          stats?.status.Pending || 0,
          stats?.status.InProgress || 0,
          stats?.status.Completed || 0,
        ],
        backgroundColor: [
          'rgba(245, 158, 11, 0.75)', // Amber
          'rgba(59, 130, 246, 0.75)',  // Blue
          'rgba(16, 185, 129, 0.75)',  // Emerald
        ],
        borderColor: isDark ? '#1e293b' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const priorityCategoryBarData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Priority Levels',
        data: [
          stats?.priority.Low || 0,
          stats?.priority.Medium || 0,
          stats?.priority.High || 0,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.75)', // Indigo
        borderRadius: 6,
      },
    ],
  };

  // Metric cards layout
  const metricCards = [
    {
      title: 'Total Tasks',
      value: statsLoading ? '...' : stats?.total || 0,
      icon: <FormatListBulletedIcon sx={{ color: 'primary.main', fontSize: 28 }} />,
      bgColor: 'rgba(79, 70, 229, 0.06)',
    },
    {
      title: 'Completed',
      value: statsLoading ? '...' : stats?.status.Completed || 0,
      icon: <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 28 }} />,
      bgColor: 'rgba(16, 185, 129, 0.06)',
    },
    {
      title: 'In Progress',
      value: statsLoading ? '...' : stats?.status.InProgress || 0,
      icon: <AutorenewIcon sx={{ color: 'info.main', fontSize: 28 }} />,
      bgColor: 'rgba(59, 130, 246, 0.06)',
    },
    {
      title: 'Pending',
      value: statsLoading ? '...' : stats?.status.Pending || 0,
      icon: <HourglassEmptyIcon sx={{ color: 'warning.main', fontSize: 28 }} />,
      bgColor: 'rgba(245, 158, 11, 0.06)',
    },
    {
      title: 'High Priority',
      value: statsLoading ? '...' : stats?.priority.High || 0,
      icon: <PriorityHighIcon sx={{ color: 'error.main', fontSize: 28 }} />,
      bgColor: 'rgba(239, 68, 68, 0.06)',
    },
  ];

  return (
    <Box className="fade-in" sx={{ width: '100%' }}>
      {/* Title Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ fontFamily: 'Outfit' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Analyze, filter, and modify your tasks in real time
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-task')}
          sx={{ py: 1, borderRadius: 2.5 }}
        >
          Add Task
        </Button>
      </Box>

      {/* Summary Cards Grid */}
      <Grid container spacing={3} mb={4}>
        {metricCards.map((card, idx) => (
          <Grid item xs={6} sm={4} md={2.4} key={idx}>
            <Card sx={{ border: 'none', height: '100%' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      backgroundColor: card.bgColor,
                      borderRadius: 3,
                      p: 1.25,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                  {card.title}
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ mt: 0.5, fontFamily: 'Outfit' }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Overview Section */}
      <Grid container spacing={3} mb={4}>
        {/* Status Distribution Doughnut */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: 260, display: 'flex', flexDirection: 'column', p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1.5 }}>
              Task Status Distribution
            </Typography>
            <Box sx={{ flexGrow: 1, position: 'relative', height: '170px', display: 'flex', justifyContent: 'center' }}>
              {statsLoading ? (
                <Box display="flex" alignItems="center" height="100%"><Typography variant="body2">Loading stats...</Typography></Box>
              ) : stats?.total === 0 ? (
                <Box display="flex" alignItems="center" height="100%"><Typography variant="caption" color="text.secondary">No task distribution data available</Typography></Box>
              ) : (
                <Doughnut
                  data={statusDoughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 12,
                          color: textColor,
                          font: { family: 'Inter', size: 11 },
                        },
                      },
                    },
                  }}
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Priority Breakdown Bar */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: 260, display: 'flex', flexDirection: 'column', p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1.5 }}>
              Tasks by Priority Level
            </Typography>
            <Box sx={{ flexGrow: 1, position: 'relative', height: '170px' }}>
              {statsLoading ? (
                <Box display="flex" alignItems="center" height="100%"><Typography variant="body2">Loading stats...</Typography></Box>
              ) : stats?.total === 0 ? (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%"><Typography variant="caption" color="text.secondary">No priority data available</Typography></Box>
              ) : (
                <Bar
                  data={priorityCategoryBarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { family: 'Inter' } },
                      },
                      y: {
                        grid: { color: gridColor },
                        ticks: {
                          color: textColor,
                          font: { family: 'Inter' },
                          stepSize: 1,
                        },
                      },
                    },
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Tasks Control Area */}
      <Card sx={{ mb: 4, p: 2.5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={10} sm={11}>
            <SearchBar value={search} onChange={setSearch} />
          </Grid>
          <Grid item xs={2} sm={1} textAlign="right">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters || filters.status || filters.priority || filters.category ? 'primary' : 'default'}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 1.5 }}
            >
              <TuneIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* Collapsible advanced filters */}
        <Collapse in={showFilters}>
          <Box mt={2}>
            <FilterComponent
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </Box>
        </Collapse>
      </Card>

      {/* Tasks Listing Grid */}
      {loading ? (
        <LoadingComponent type="skeleton" count={6} />
      ) : tasks.length === 0 ? (
        /* Empty State UI */
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 4,
            border: '1px dashed',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight="700" sx={{ fontFamily: 'Outfit' }}>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth="350px">
            {search || filters.status || filters.priority || filters.category
              ? "We couldn't find any tasks matching your filters. Try resetting them."
              : "Your workspace is currently clean! Click the button below to formulate your first task."}
          </Typography>
          {!search && !filters.status && !filters.priority && !filters.category ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-task')}
              sx={{ mt: 1 }}
            >
              Create First Task
            </Button>
          ) : (
            <Button variant="outlined" onClick={handleResetFilters} sx={{ mt: 1 }}>
              Reset Filters
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <TaskCard
                  task={task}
                  onStatusToggle={handleStatusToggle}
                  onDelete={handleDeleteRequest}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination Controls */}
          <PaginationComponent
            page={page}
            count={totalPages}
            limit={limit}
            totalItems={totalTasks}
            onChange={setPage}
          />
        </>
      )}

      {/* Deletion confirmation overlay */}
      <ConfirmationModal
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />
    </Box>
  );
};

export default Dashboard;
