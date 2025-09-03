import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import {
  Palette,
  Close,
  LightMode,
  DarkMode,
  MusicNote,
  DirectionsRun,
  ColorLens,
  Gradient
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { danceColors, gradients } from '../theme/customTheme';

interface ThemeSelectorProps {
  open: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ open, onClose }) => {
  const { theme, danceStyle, toggleTheme, setDanceStyle, customGradient, setCustomGradient } = useTheme();
  const [selectedGradient, setSelectedGradient] = useState(customGradient);

  const danceStyles = [
    { key: 'contemporary', name: 'Contemporary', icon: '🎭', color: danceColors.contemporary.main },
    { key: 'hiphop', name: 'Hip Hop', icon: '🎵', color: danceColors.hiphop.main },
    { key: 'ballet', name: 'Ballet', icon: '🩰', color: danceColors.ballet.main },
    { key: 'jazz', name: 'Jazz', icon: '🎷', color: danceColors.jazz.main },
    { key: 'urban', name: 'Urban', icon: '🏙️', color: danceColors.urban.main },
    { key: 'latin', name: 'Latin', icon: '💃', color: danceColors.latin.main },
  ];

  const gradientOptions = [
    { name: 'Dance', value: gradients.dance, preview: 'linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 100%)' },
    { name: 'Primary', value: gradients.primary, preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Secondary', value: gradients.secondary, preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Success', value: gradients.success, preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Warning', value: gradients.warning, preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Sunset', value: gradients.sunset, preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Ocean', value: gradients.ocean, preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Forest', value: gradients.forest, preview: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  ];

  const handleApplyGradient = () => {
    setCustomGradient(selectedGradient);
  };

  const handleReset = () => {
    setDanceStyle('contemporary');
    setSelectedGradient(gradients.dance);
    setCustomGradient(gradients.dance);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Palette sx={{ mr: 1, color: 'primary.main' }} />
          Customize Theme
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Theme Mode */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                {theme === 'light' ? <LightMode /> : <DarkMode />}
                <Typography sx={{ ml: 1 }}>Theme Mode</Typography>
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    color="primary"
                  />
                }
                label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {theme === 'dark' 
                  ? 'Dark mode reduces eye strain in low-light environments'
                  : 'Light mode is ideal for well-lit environments'
                }
              </Typography>
            </CardContent>
          </Card>

          {/* Dance Style */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <DirectionsRun sx={{ mr: 1 }} />
                Dance Style
              </Typography>
              
              <Grid container spacing={2}>
                {danceStyles.map((style) => (
                  <Grid item xs={12} sm={6} md={4} key={style.key}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: danceStyle === style.key ? 2 : 1,
                          borderColor: danceStyle === style.key ? style.color : 'divider',
                          '&:hover': {
                            boxShadow: 3,
                          }
                        }}
                        onClick={() => setDanceStyle(style.key as keyof typeof danceColors)}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="h4" sx={{ mb: 1 }}>
                            {style.icon}
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {style.name}
                          </Typography>
                          <Box
                            sx={{
                              width: 40,
                              height: 4,
                              backgroundColor: style.color,
                              borderRadius: 2,
                              mx: 'auto',
                              mt: 1
                            }}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Custom Gradients */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Gradient sx={{ mr: 1 }} />
                Gradients
              </Typography>
              
              <Grid container spacing={2}>
                {gradientOptions.map((gradient) => (
                  <Grid item xs={12} sm={6} md={3} key={gradient.name}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedGradient === gradient.value ? 2 : 1,
                          borderColor: selectedGradient === gradient.value ? 'primary.main' : 'divider',
                          '&:hover': {
                            boxShadow: 3,
                          }
                        }}
                        onClick={() => setSelectedGradient(gradient.value)}
                      >
                        <CardContent sx={{ p: 1 }}>
                          <Box
                            sx={{
                              height: 80,
                              background: gradient.preview,
                              borderRadius: 2,
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                            }}
                          >
                            {gradient.name}
                          </Box>
                          <Typography variant="body2" textAlign="center">
                            {gradient.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <ColorLens sx={{ mr: 1 }} />
                Preview
              </Typography>
              
              <Box
                sx={{
                  height: 120,
                  background: selectedGradient,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: 2
                }}
              >
                Theme Preview
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<MusicNote />}
                  label={`Style: ${danceStyles.find(s => s.key === danceStyle)?.name}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={theme === 'light' ? <LightMode /> : <DarkMode />}
                  label={`Mode: ${theme === 'light' ? 'Light' : 'Dark'}`}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleReset} variant="outlined">
          Reset
        </Button>
        <Button onClick={handleApplyGradient} variant="contained">
          Apply Gradient
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemeSelector;
