import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const ConfirmationModal = ({
  open,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  onConfirm,
  onClose,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  color = 'error',
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          padding: 8
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box 
          sx={{ 
            backgroundColor: color === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            borderRadius: '50%',
            p: 0.75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <WarningAmberRoundedIcon color={color} />
        </Box>
        <Typography variant="h6" component="span" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={color} variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
