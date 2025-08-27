import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Avatar,
  Divider,
  Link,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Login,
  PersonAdd,
  Close,
  Google,
  Facebook,
  Apple
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import authService, { LoginCredentials, RegisterData } from '../services/AuthService';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Estados para login
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });

  // Estados para registro
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  // Limpiar estados cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
      setLoginData({ email: '', password: '', rememberMe: false });
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
    }
  }, [open]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login({
        ...loginData,
        rememberMe
      });

      if (result.success) {
        setSuccess('Login successful!');
        setTimeout(() => {
          onLoginSuccess?.();
          onClose();
        }, 1000);
      } else {
        setError(result.error || 'Error logging in');
      }
    } catch (error) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.register(registerData);

      if (result.success) {
        setSuccess('Registration successful! You can now log in.');
        setActiveTab(0);
        setLoginData(prev => ({ ...prev, email: registerData.email }));
      } else {
        setError(result.error || 'Error registering user');
      }
    } catch (error) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setError(null);
    setSuccess(`Logging in with ${provider}...`);
    // Simulate social login
    setTimeout(() => {
      setError('Social login not implemented in this demo');
    }, 1000);
  };

  const handleForgotPassword = () => {
    if (!loginData.email) {
      setError('Please enter your email first');
      return;
    }

    setLoading(true);
    authService.resetPassword(loginData.email).then(result => {
      setLoading(false);
      if (result.success) {
        setSuccess('An email with password reset instructions has been sent');
      } else {
        setError(result.error || 'Error sending email');
      }
    });
  };

  const isLoginValid = loginData.email && loginData.password;
  const isRegisterValid = registerData.name && registerData.email && 
                         registerData.password && registerData.confirmPassword &&
                         registerData.password === registerData.confirmPassword;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <Login />
          </Avatar>
          <Typography variant="h6">
            {activeTab === 0 ? 'Log In' : 'Create Account'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Log In" />
            <Tab label="Create Account" />
          </Tabs>

          {/* Alertas */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulario de Login */}
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label="Recordarme"
                  />
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleForgotPassword}
                    sx={{ textDecoration: 'none' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Formulario de Registro */}
          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirmar contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  error={registerData.password !== registerData.confirmPassword && registerData.confirmPassword !== ''}
                  helperText={
                    registerData.password !== registerData.confirmPassword && registerData.confirmPassword !== ''
                      ? 'Las contraseñas no coinciden'
                      : ''
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </motion.div>
          )}

          {/* Login Social */}
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                O continúa con
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Google />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ flex: 1 }}
              >
                Google
              </Button>
              <Button
                variant="outlined"
                startIcon={<Facebook />}
                onClick={() => handleSocialLogin('Facebook')}
                sx={{ flex: 1 }}
              >
                Facebook
              </Button>
              <Button
                variant="outlined"
                startIcon={<Apple />}
                onClick={() => handleSocialLogin('Apple')}
                sx={{ flex: 1 }}
              >
                Apple
              </Button>
            </Box>
          </Box>

          {/* Credenciales de demo */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Credenciales de Demo:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Admin:</strong> admin@dance.com / admin123<br />
              <strong>Profesor:</strong> teacher@dance.com / teacher123<br />
                              <strong>Student:</strong> student@dance.com / student123
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
                          Cancel
        </Button>
        <Button
          onClick={activeTab === 0 ? handleLogin : handleRegister}
          variant="contained"
          disabled={loading || (activeTab === 0 ? !isLoginValid : !isRegisterValid)}
          startIcon={loading ? <CircularProgress size={20} /> : (activeTab === 0 ? <Login /> : <PersonAdd />)}
          sx={{
            background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #E91E63 30%, #0097A7 90%)',
            }
          }}
        >
                      {loading ? 'Processing...' : (activeTab === 0 ? 'Sign In' : 'Create Account')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
