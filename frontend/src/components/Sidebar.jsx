import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardCustomizeOutlinedIcon />, path: '/' },
    { text: 'Create Task', icon: <AddCircleOutlineOutlinedIcon />, path: '/create-task' },
    { text: 'My Profile', icon: <PersonOutlineOutlinedIcon />, path: '/profile' },
  ];

  const handleNav = (path) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <Typography 
        variant="overline" 
        color="text.secondary" 
        sx={{ px: 3, fontWeight: 700, letterSpacing: '1px', opacity: 0.8 }}
      >
        Menu
      </Typography>
      <List sx={{ px: 1.5, mt: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: 2.5,
                  backgroundColor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  py: 1.25,
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(79, 70, 229, 0.12)' : 'rgba(0, 0, 0, 0.03)',
                    color: isActive ? 'primary.main' : 'text.primary',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? 'primary.main' : 'text.secondary',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: isActive ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            top: '64px', 
            height: 'calc(100% - 64px)' 
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
