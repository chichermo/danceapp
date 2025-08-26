import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Grid,
  Paper
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Security,
  Notifications,
  Palette,
  Language,
  Logout,
  AdminPanelSettings,
  School,
  PersonPin
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService, { User } from '../services/AuthService';

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ open, onClose, onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Estados para edición
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    preferences: {
      theme: 'light' as 'light' | 'dark',
      language: 'es',
      notifications: true
    }
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (open) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setEditData({
          name: currentUser.name,
          email: currentUser.email,
          preferences: { ...currentUser.preferences }
        });
      }
    }
  }, [open]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.updateProfile(editData);
      
      if (result.success) {
        setSuccess('Perfil actualizado exitosamente');
        setIsEditing(false);
        // Actualizar usuario local
        const updatedUser = authService.getCurrentUser();
        setUser(updatedUser);
      } else {
        setError(result.error || 'Error al actualizar perfil');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        setSuccess('Contraseña cambiada exitosamente');
        setShowChangePassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(result.error || 'Error al cambiar contraseña');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    onLogout?.();
    onClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'teacher': return 'warning';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings />;
      case 'teacher': return <School />;
      case 'student': return <PersonPin />;
      default: return <Person />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={user.avatar} sx={{ mr: 2, width: 48, height: 48 }}>
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Chip
              icon={getRoleIcon(user.role)}
              label={user.role}
              color={getRoleColor(user.role)}
              size="small"
            />
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <Cancel />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Alertas */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Información del Perfil */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Información Personal</Typography>
                    <Button
                      startIcon={isEditing ? <Save /> : <Edit />}
                      onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                      disabled={loading}
                      variant={isEditing ? 'contained' : 'outlined'}
                    >
                      {isEditing ? 'Guardar' : 'Editar'}
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Rol"
                      value={user.role}
                      disabled
                      InputProps={{
                        startAdornment: getRoleIcon(user.role)
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Preferencias */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Palette sx={{ mr: 1 }} />
                    Preferencias
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editData.preferences.notifications}
                          onChange={(e) => setEditData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, notifications: e.target.checked }
                          }))}
                        />
                      }
                      label="Notificaciones"
                    />

                    <TextField
                      select
                      fullWidth
                      label="Tema"
                      value={editData.preferences.theme}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, theme: e.target.value as 'light' | 'dark' }
                      }))}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                    </TextField>

                    <TextField
                      select
                      fullWidth
                      label="Idioma"
                      value={editData.preferences.language}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, language: e.target.value }
                      }))}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </TextField>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Información de la Cuenta */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ mr: 1 }} />
                    Seguridad
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email verificado"
                        secondary="Tu email está verificado"
                      />
                      <Chip label="Verificado" color="success" size="small" />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <Security />
                      </ListItemIcon>
                      <ListItemText
                        primary="Último inicio de sesión"
                        secondary={user.lastLogin.toLocaleString()}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary="Miembro desde"
                        secondary={user.createdAt.toLocaleDateString()}
                      />
                    </ListItem>
                  </List>

                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowChangePassword(true)}
                      startIcon={<Security />}
                    >
                      Cambiar Contraseña
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleLogout}
                      startIcon={<Logout />}
                    >
                      Cerrar Sesión
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Dialog para cambiar contraseña */}
      <Dialog open={showChangePassword} onClose={() => setShowChangePassword(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Contraseña actual"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Nueva contraseña"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Confirmar nueva contraseña"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
              helperText={
                passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''
                  ? 'Las contraseñas no coinciden'
                  : ''
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChangePassword(false)}>Cancelar</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
          >
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </Dialog>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfile;
