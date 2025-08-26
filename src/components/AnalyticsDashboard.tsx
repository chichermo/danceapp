import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  TrendingDown,
  People,
  Timer,
  Speed,
  Memory,
  Error,
  Download,
  Refresh,
  Assessment,
  Insights,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import analyticsService from '../services/AnalyticsService';

interface AnalyticsDashboardProps {
  open: boolean;
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ open, onClose }) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (open) {
      loadAnalyticsData();
    }
  }, [open]);

  const loadAnalyticsData = () => {
    setLoading(true);
    
    setTimeout(() => {
      const usageAnalytics = analyticsService.getUsageAnalytics();
      const performanceMetrics = analyticsService.getPerformanceMetrics();
      const recentEvents = analyticsService.getRecentEvents(20);
      const report = analyticsService.generateReport();

      setAnalyticsData(report);
      setPerformanceData(performanceMetrics);
      setRecentEvents(recentEvents);
      setLoading(false);
    }, 1500);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPerformanceColor = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value < threshold : value > threshold;
    return isGood ? 'success' : 'warning';
  };

  const tabs = [
    { label: '📊 Resumen', icon: <Assessment /> },
    { label: '⚡ Rendimiento', icon: <Speed /> },
    { label: '👥 Usuarios', icon: <People /> },
    { label: '📈 Eventos', icon: <Analytics /> }
  ];

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>📊 Dashboard de Analytics</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Analytics sx={{ mr: 1, color: 'primary.main' }} />
          Dashboard de Analytics
        </Box>
        <Box>
          <Tooltip title="Actualizar datos">
            <IconButton onClick={loadAnalyticsData} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exportar datos">
            <IconButton onClick={() => {
              const data = analyticsService.exportAnalytics();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }} color="primary">
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Tabs de navegación */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {tabs.map((tab, index) => (
                <Button
                  key={index}
                  variant={activeTab === index ? 'contained' : 'outlined'}
                  startIcon={tab.icon}
                  onClick={() => setActiveTab(index)}
                  sx={{ minWidth: 'auto', px: 2, py: 1 }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Tab 1: Resumen */}
          {activeTab === 0 && analyticsData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {/* Métricas principales */}
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <People sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">Usuarios Totales</Typography>
                      </Box>
                      <Typography variant="h4" color="primary">
                        {formatNumber(analyticsData.summary.totalUsers)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(analyticsData.summary.activeUsers)} activos
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Timer sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="h6">Duración Promedio</Typography>
                      </Box>
                      <Typography variant="h4" color="success.main">
                        {formatTime(analyticsData.summary.sessionDuration)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Por sesión
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Speed sx={{ mr: 1, color: 'warning.main' }} />
                        <Typography variant="h6">Tiempo de Carga</Typography>
                      </Box>
                      <Typography variant="h4" color="warning.main">
                        {formatTime(analyticsData.performanceSummary.averageLoadTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Promedio
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrendingUp sx={{ mr: 1, color: 'info.main' }} />
                        <Typography variant="h6">Retención</Typography>
                      </Box>
                      <Typography variant="h4" color="info.main">
                        {analyticsData.summary.userRetention.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        De usuarios
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Top Features */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Insights sx={{ mr: 1 }} />
                        Funcionalidades Más Usadas
                      </Typography>
                      <List>
                        {analyticsData.topFeatures.map((feature: any, index: number) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={feature.feature}
                              secondary={`${feature.usage} usos`}
                            />
                            <Chip
                              label={`#${index + 1}`}
                              color="primary"
                              size="small"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Recomendaciones */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Warning sx={{ mr: 1 }} />
                        Recomendaciones
                      </Typography>
                      {analyticsData.recommendations.length > 0 ? (
                        <List>
                          {analyticsData.recommendations.map((recommendation: string, index: number) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CheckCircle color="success" />
                              </ListItemIcon>
                              <ListItemText
                                primary={recommendation}
                                primaryTypographyProps={{ fontSize: '0.875rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Alert severity="success">
                          ¡Todo se ve bien! No hay recomendaciones en este momento.
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Tab 2: Rendimiento */}
          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Speed sx={{ mr: 1 }} />
                        Tiempo de Carga
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {formatTime(analyticsData?.performanceSummary.averageLoadTime || 0)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (analyticsData?.performanceSummary.averageLoadTime || 0) / 50)}
                        color={getPerformanceColor(analyticsData?.performanceSummary.averageLoadTime || 0, 3000)}
                        sx={{ mt: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Objetivo: &lt; 3s
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Memory sx={{ mr: 1 }} />
                        Uso de Memoria
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {formatBytes(analyticsData?.performanceSummary.averageMemoryUsage || 0)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (analyticsData?.performanceSummary.averageMemoryUsage || 0) / 100000000)}
                        color={getPerformanceColor(analyticsData?.performanceSummary.averageMemoryUsage || 0, 50000000, true)}
                        sx={{ mt: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Objetivo: &lt; 50MB
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Error sx={{ mr: 1 }} />
                        Tasa de Errores
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {analyticsData?.performanceSummary.errorRate.toFixed(2) || 0}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={analyticsData?.performanceSummary.errorRate || 0}
                        color={getPerformanceColor(analyticsData?.performanceSummary.errorRate || 0, 5, true)}
                        sx={{ mt: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Objetivo: &lt; 5%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Métricas de Rendimiento Recientes
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Tiempo de Carga</TableCell>
                              <TableCell>Memoria</TableCell>
                              <TableCell>Errores</TableCell>
                              <TableCell>Timestamp</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {performanceData.slice(-10).map((metric, index) => (
                              <TableRow key={index}>
                                <TableCell>{formatTime(metric.pageLoadTime)}</TableCell>
                                <TableCell>{formatBytes(metric.memoryUsage)}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={`${metric.errorRate.toFixed(1)}%`}
                                    size="small"
                                    color={metric.errorRate > 5 ? 'error' : 'success'}
                                  />
                                </TableCell>
                                <TableCell>
                                  {new Date(metric.pageLoadTime).toLocaleTimeString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Tab 3: Usuarios */}
          {activeTab === 2 && analyticsData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Estadísticas de Usuarios
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Usuarios Totales"
                            secondary={formatNumber(analyticsData.summary.totalUsers)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Usuarios Activos (24h)"
                            secondary={formatNumber(analyticsData.summary.activeUsers)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Retención de Usuarios"
                            secondary={`${analyticsData.summary.userRetention.toFixed(1)}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Duración Promedio de Sesión"
                            secondary={formatTime(analyticsData.summary.sessionDuration)}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Actividad por Funcionalidad
                      </Typography>
                      <List>
                        {Object.entries(analyticsData.summary.featureUsage).map(([feature, usage]: [string, any]) => (
                          <ListItem key={feature}>
                            <ListItemText
                              primary={feature}
                              secondary={`${usage} usos`}
                            />
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(100, (usage / Math.max(...Object.values(analyticsData.summary.featureUsage).map(v => Number(v) || 0))) * 100)}
                              sx={{ width: 100 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Tab 4: Eventos */}
          {activeTab === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Eventos Recientes
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Acción</TableCell>
                          <TableCell>Componente</TableCell>
                          <TableCell>Usuario</TableCell>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Detalles</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentEvents.map((event, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Chip
                                label={event.action}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{event.component}</TableCell>
                            <TableCell>{event.userId}</TableCell>
                            <TableCell>
                              {event.timestamp.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {Object.keys(event.metadata).length > 0 ? 
                                `${Object.keys(event.metadata).length} propiedades` : 
                                'Sin detalles'
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        <Button 
          onClick={loadAnalyticsData} 
          variant="contained"
          startIcon={<Refresh />}
        >
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalyticsDashboard;
