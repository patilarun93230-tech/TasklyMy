import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const FilterComponent = ({
  filters,
  onFilterChange,
  onReset,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const handleSelectChange = (field) => (event) => {
    onFilterChange(field, event.target.value);
  };

  return (
    <Box sx={{ mt: 2, mb: 1, width: '100%' }}>
      <Grid container spacing={2} alignItems="center">
        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filters.status}
              label="Status"
              onChange={handleSelectChange('status')}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Priority Filter */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              value={filters.priority}
              label="Priority"
              onChange={handleSelectChange('priority')}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filters.category}
              label="Category"
              onChange={handleSelectChange('category')}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Study">Study</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort By Field */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => onSortChange(e.target.value, sortOrder)}
            >
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort Order */}
        <Grid item xs={6} sm={3} md={1.2}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-order-label">Order</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              label="Order"
              onChange={(e) => onSortChange(sortBy, e.target.value)}
            >
              <MenuItem value="desc">Desc</MenuItem>
              <MenuItem value="asc">Asc</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Button */}
        <Grid item xs={6} sm={3} md={1.2}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={onReset}
            startIcon={<RestartAltIcon />}
            size="medium"
            sx={{ height: 40, borderRadius: 2.5 }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterComponent;
