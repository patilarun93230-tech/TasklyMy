import React from 'react';
import { Box, CircularProgress, Skeleton, Grid, Card, CardContent } from '@mui/material';

const LoadingComponent = ({ type = 'spinner', count = 3, fullPage = false }) => {
  if (type === 'spinner') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={fullPage ? '80vh' : '200px'}
        width="100%"
      >
        <CircularProgress size={45} thickness={4} color="primary" />
      </Box>
    );
  }

  // Card Skeltons
  return (
    <Grid container spacing={3}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ border: 'none', boxShadow: 'none' }}>
            <CardContent>
              {/* Category tag skeleton */}
              <Skeleton variant="rectangular" width={70} height={20} sx={{ borderRadius: 1, mb: 1.5 }} />
              
              {/* Title skeleton */}
              <Skeleton variant="text" width="85%" height={32} sx={{ mb: 1 }} />
              
              {/* Description skeleton */}
              <Skeleton variant="text" width="95%" height={20} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
              
              {/* Footer info skeletons */}
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} />
                <Box display="flex" gap={1}>
                  <Skeleton variant="circular" width={28} height={28} />
                  <Skeleton variant="circular" width={28} height={28} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingComponent;
