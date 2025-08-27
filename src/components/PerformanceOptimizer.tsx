import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Speed,
  Memory,
  NetworkCheck,
  Settings,
  PlayArrow,
  Pause,
  Refresh,
  CheckCircle,
  Warning,
  Info,
  Tune
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import usePerformanceOptimization from '../hooks/usePerformanceOptimization';

interface PerformanceOptimizerProps {
  open: boolean;
  onClose: () => void;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ open, onClose }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [settings, setSettings] = useState({
    enableVirtualization: true,
    enableMemoization: true,
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableWebWorkers: false,
    debounceDelay: 300,
    throttleDelay: 100,
    maxRenderTime: 16
  });

  const {
    collectPerformanceMetrics,
    cleanupMemory,
    debounce,
    throttle
  } = usePerformanceOptimization(settings);

  // Simular optimización de rendimiento
  const runOptimization = useCallback(async () => {
    setIsOptimizing(true);
    
    // Simular proceso de optimización
    const steps = [
      'Analizando componentes...',
      'Optimizando re-renders...',
      'Aplicando memoización...',
      'Configurando lazy loading...',
      'Optimizando imágenes...',
      'Limpiando memoria...',
      'Finalizando optimización...'
    ];

    const results = {
      componentsOptimized: 0,
      memorySaved: 0,
      renderTimeImproved: 0,
      bundleSizeReduced: 0,
      recommendations: [] as string[]
    };

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular mejoras
      results.componentsOptimized += Math.floor(Math.random() * 5) + 1;
      results.memorySaved += Math.floor(Math.random() * 10) + 5;
      results.renderTimeImproved += Math.floor(Math.random() * 3) + 1;
      results.bundleSizeReduced += Math.floor(Math.random() * 2) + 1;
    }

    // Generar recomendaciones
    if (results.memorySaved < 20) {
      results.recommendations.push('Considera implementar lazy loading para componentes pesados');
    }
    if (results.renderTimeImproved < 5) {
      results.recommendations.push('Optimiza los re-renders con React.memo y useMemo');
    }
    if (results.bundleSizeReduced < 3) {
      results.recommendations.push('Implementa code splitting para reducir el bundle inicial');
    }

    setOptimizationResults(results);
    setIsOptimizing(false);
  }, []);

  // Recopilar métricas de rendimiento
  const collectMetrics = useCallback(() => {
    const metrics = collectPerformanceMetrics();
    setPerformanceMetrics(metrics);
  }, [collectPerformanceMetrics]);

  useEffect(() => {
    if (open) {
      collectMetrics();
    }
  }, [open, collectMetrics]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getPerformanceColor = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value < threshold : value > threshold;
    return isGood ? 'success' : 'warning';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    return `${ms.toFixed(2)}ms`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Speed sx={{ mr: 1, color: 'primary.main' }} />
          Performance Optimizer
        </Box>
        <Box>
          <Tooltip title="Collect Metrics">
            <IconButton onClick={collectMetrics} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Current Performance Metrics */}
          {performanceMetrics && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Speed sx={{ mr: 1 }} />
                  Current Metrics
                </Typography>
                <Grid container spacing={2}>
                  {performanceMetrics.memory && (
                    <>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Memory sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                          <Typography variant="h6">
                            {formatBytes(performanceMetrics.memory.used)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Used Memory
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">
                            {formatBytes(performanceMetrics.memory.total)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Memory
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">
                            {((performanceMetrics.memory.used / performanceMetrics.memory.limit) * 100).toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Memory Usage
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                  {performanceMetrics.timing && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <NetworkCheck sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                          <Typography variant="h6">
                            {formatTime(performanceMetrics.timing.loadTime)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Load Time
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">
                            {formatTime(performanceMetrics.timing.firstContentfulPaint || 0)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            First Contentful Paint
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Optimization Configuration */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Settings sx={{ mr: 1 }} />
                Optimization Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableVirtualization}
                        onChange={(e) => handleSettingChange('enableVirtualization', e.target.checked)}
                      />
                    }
                    label="List Virtualization"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableMemoization}
                        onChange={(e) => handleSettingChange('enableMemoization', e.target.checked)}
                      />
                    }
                    label="Component Memoization"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableLazyLoading}
                        onChange={(e) => handleSettingChange('enableLazyLoading', e.target.checked)}
                      />
                    }
                    label="Lazy Loading"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableCodeSplitting}
                        onChange={(e) => handleSettingChange('enableCodeSplitting', e.target.checked)}
                      />
                    }
                    label="Code Splitting"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableWebWorkers}
                        onChange={(e) => handleSettingChange('enableWebWorkers', e.target.checked)}
                      />
                    }
                    label="Web Workers"
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Debounce Delay: {settings.debounceDelay}ms
                  </Typography>
                  <Slider
                    value={settings.debounceDelay}
                    onChange={(_, value) => handleSettingChange('debounceDelay', value)}
                    min={100}
                    max={1000}
                    step={50}
                    marks={[
                      { value: 100, label: '100ms' },
                      { value: 500, label: '500ms' },
                      { value: 1000, label: '1000ms' }
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Throttle Delay: {settings.throttleDelay}ms
                  </Typography>
                  <Slider
                    value={settings.throttleDelay}
                    onChange={(_, value) => handleSettingChange('throttleDelay', value)}
                    min={50}
                    max={500}
                    step={25}
                    marks={[
                      { value: 50, label: '50ms' },
                      { value: 250, label: '250ms' },
                      { value: 500, label: '500ms' }
                    ]}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Optimization Process */}
          {isOptimizing && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PlayArrow sx={{ mr: 1 }} />
                  Optimizing Application...
                </Typography>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Analyzing components and applying optimizations...
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Optimization Results */}
          {optimizationResults && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                  Optimization Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {optimizationResults.componentsOptimized}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Components Optimized
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {optimizationResults.memorySaved}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Memory Saved
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        {optimizationResults.renderTimeImproved}ms
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Render Time Improved
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        {optimizationResults.bundleSizeReduced}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bundle Reduced
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {optimizationResults.recommendations.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Info sx={{ mr: 1 }} />
                      Recommendations
                    </Typography>
                    <List>
                      {optimizationResults.recommendations.map((recommendation: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={recommendation} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Optimization Tips */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Tune sx={{ mr: 1 }} />
                Optimization Tips
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Use React.memo for components that re-render frequently"
                    secondary="Avoid unnecessary re-renders by memoizing components"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Implement lazy loading for heavy components"
                    secondary="Load components only when they are needed"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Use useMemo and useCallback for expensive calculations"
                    secondary="Memoize values and functions to avoid recalculations"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Optimize images with lazy loading and compression"
                    secondary="Reduce image size and load them on demand"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={runOptimization}
          variant="contained"
          disabled={isOptimizing}
          startIcon={isOptimizing ? <Pause /> : <PlayArrow />}
          sx={{
            background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #E91E63 30%, #0097A7 90%)',
            }
          }}
        >
          {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PerformanceOptimizer;
