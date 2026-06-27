import React from 'react';
import { Box, Pagination, Typography } from '@mui/material';

const PaginationComponent = ({ page, count, onChange, totalItems, limit }) => {
  // If only one page exists and we have no tasks, do not show pagination
  if (count <= 1 && totalItems === 0) return null;

  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      sx={{ mt: 4, mb: 2, width: '100%' }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {totalItems} tasks
      </Typography>
      {count > 1 && (
        <Pagination
          count={count}
          page={page}
          onChange={(e, val) => onChange(val)}
          color="primary"
          shape="rounded"
          size="medium"
        />
      )}
    </Box>
  );
};

export default PaginationComponent;
