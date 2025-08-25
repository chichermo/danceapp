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
    { path: '/calendar', label: 'Calendario', icon: <CalendarIcon />, badge: 3 },
    { path: '/choreography', label: 'Coreografías', icon: <ChoreographyIcon />, badge: 5 },
    { path: '/students', label: 'Estudiantes', icon: <StudentsIcon />, badge: 12 },
    { path: '/coaches', label: 'Coaches', icon: <CoachesIcon />, badge: null },
    { path: '/classes', label: 'Clases', icon: <ClassesIcon />, badge: 8 },
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

  const drawerWidth = 280;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del drawer */}
      <Box sx={{
        background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
        color: 'white',
        p: 3,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Elementos decorativos */}
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            background: 'rgba(255,255,255,0.2)',
            border: '3px solid rgba(255,255,255,0.3)',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          🎭
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Heliopsis
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Dance Academy
        </Typography>
      </Box>

      {/* Navegación */}
      <Box sx={{ flex: 1, p: 2 }}>
        <List>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.path}
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 3,
                  mb: 1,
                  background: isActive ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
                  border: isActive ? '2px solid #FF6B9D' : 'none',
                  '&:hover': {
                    background: isActive ? 'rgba(255, 107, 157, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? '#FF6B9D' : 'rgba(255,255,255,0.7)',
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#FF6B9D' : 'rgba(255,255,255,0.9)',
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
                      }
                    }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer del drawer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <ListItem button onClick={handleAccountMenuOpen}>
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <AccountIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Mi Cuenta"
            sx={{ '& .MuiTypography-root': { color: 'rgba(255,255,255,0.9)' } }}
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
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {getPageTitle()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" sx={{ position: 'relative' }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
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
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>

      {/* Menú de cuenta */}
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
          Perfil
        </MenuItem>
        <MenuItem onClick={handleAccountMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleAccountMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;
