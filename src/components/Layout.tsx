import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  MusicNote as ChoreographyIcon,
  People as StudentsIcon,
  FitnessCenter as CoachesIcon,
  Class as ClassesIcon,
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon />, badge: null },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon />, badge: 3 },
    { path: '/choreography', label: 'Choreographies', icon: <ChoreographyIcon />, badge: 5 },
    { path: '/students', label: 'Students', icon: <StudentsIcon />, badge: 12 },
    { path: '/coaches', label: 'Coaches', icon: <CoachesIcon />, badge: null },
    { path: '/classes', label: 'Classes', icon: <ClassesIcon />, badge: 8 },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setAccountMenuOpen(true);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
    setAccountMenuOpen(false);
  };

  const getPageTitle = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Heliopsis Dance Academy';
  };

  const drawerWidth = 220;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
        color: 'white',
        p: 2,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -15,
          right: -15,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 1.5,
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          🎭
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>
          Heliopsis
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
          Dance Academy
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, p: 1.5, overflow: 'auto' }}>
        <List>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.path}
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1,
                  px: 1.5,
                  background: isActive ? 'rgba(255, 107, 157, 0.2)' : 'transparent',
                  border: isActive ? '2px solid #FF6B9D' : '1px solid rgba(255,255,255,0.1)',
                  '&:hover': {
                    background: isActive ? 'rgba(255, 107, 157, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  },
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? '#FF6B9D' : 'rgba(255,255,255,0.8)',
                  minWidth: 35,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#FF6B9D' : 'white',
                      fontSize: '0.9rem',
                    }
                  }}
                />
                {item.badge && (
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: '#FF6B9D',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                      }
                    }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Drawer footer */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <ListItem 
          button 
          onClick={handleAccountMenuOpen}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 1.5,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: 35 }}>
            <AccountIcon />
          </ListItemIcon>
          <ListItemText 
            primary="My Account"
            sx={{ 
              '& .MuiTypography-root': { 
                color: 'white',
                fontWeight: 500,
                fontSize: '0.9rem',
              } 
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <HomeIcon sx={{ mr: 1, fontSize: { xs: 24, sm: 28 }, flexShrink: 0 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getPageTitle()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 0.5, sm: 1 },
            flexShrink: 0,
          }}>
            <IconButton color="inherit" sx={{ position: 'relative' }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <SettingsIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleAccountMenuOpen}
              sx={{
                background: 'rgba(255,255,255,0.1)',
                '&:hover': { background: 'rgba(255,255,255,0.2)' },
              }}
            >
              <AccountIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? drawerOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              color: 'white',
              zIndex: theme.zIndex.drawer,
              overflow: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
        }}>
          {children}
        </Box>
      </Box>

      {/* Account menu */}
      <Menu
        anchorEl={anchorEl}
        open={accountMenuOpen}
        onClose={handleAccountMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            mt: 1,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }}
      >
        <MenuItem onClick={handleAccountMenuClose}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleAccountMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleAccountMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;
