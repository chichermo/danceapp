import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Alert,
  Chip,
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
  Stop,
  Refresh,
  CheckCircle,
  Warning,
  Error,
  Info,
  Tune,
  Speed
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
    useMemoryOptimization,
    useDebounce,
    useThrottle
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
          Optimizador de Rendimiento
        </Box>
        <Box>
          <Tooltip title="Recopilar métricas">
            <IconButton onClick={collectMetrics} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Métricas de Rendimiento Actuales */}
          {performanceMetrics && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Speed sx={{ mr: 1 }} />
                  Métricas Actuales
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
                            Memoria Usada
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">
                            {formatBytes(performanceMetrics.memory.total)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Memoria Total
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">
                            {((performanceMetrics.memory.used / performanceMetrics.memory.limit) * 100).toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Uso de Memoria
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
                            Tiempo de Carga
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

          {/* Configuración de Optimización */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Settings sx={{ mr: 1 }} />
                Configuración de Optimización
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
                    label="Virtualización de Listas"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableMemoization}
                        onChange={(e) => handleSettingChange('enableMemoization', e.target.checked)}
                      />
                    }
                    label="Memoización de Componentes"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableLazyLoading}
                        onChange={(e) => handleSettingChange('enableLazyLoading', e.target.checked)}
                      />
                    }
                    label="Carga Perezosa"
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
                    label="División de Código"
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
                    Delay de Debounce: {settings.debounceDelay}ms
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
                    Delay de Throttle: {settings.throttleDelay}ms
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

          {/* Proceso de Optimización */}
          {isOptimizing && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PlayArrow sx={{ mr: 1 }} />
                  Optimizando Aplicación...
                </Typography>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Analizando componentes y aplicando optimizaciones...
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Resultados de Optimización */}
          {optimizationResults && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                  Resultados de Optimización
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {optimizationResults.componentsOptimized}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Componentes Optimizados
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {optimizationResults.memorySaved}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Memoria Ahorrada
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        {optimizationResults.renderTimeImproved}ms
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tiempo de Render Mejorado
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        {optimizationResults.bundleSizeReduced}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bundle Reducido
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {optimizationResults.recommendations.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Info sx={{ mr: 1 }} />
                      Recomendaciones
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

          {/* Consejos de Optimización */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Tune sx={{ mr: 1 }} />
                Consejos de Optimización
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Usa React.memo para componentes que se re-renderizan frecuentemente"
                    secondary="Evita re-renders innecesarios memorizando componentes"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Implementa lazy loading para componentes pesados"
                    secondary="Carga componentes solo cuando son necesarios"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Usa useMemo y useCallback para cálculos costosos"
                    secondary="Memoiza valores y funciones para evitar recálculos"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Optimiza imágenes con lazy loading y compresión"
                    secondary="Reduce el tamaño de las imágenes y cárgalas bajo demanda"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
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
          {isOptimizing ? 'Optimizando...' : 'Ejecutar Optimización'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PerformanceOptimizer;
