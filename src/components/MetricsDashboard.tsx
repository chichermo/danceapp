import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Tooltip,
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
  Paper
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Timer,
  People,
  MusicNote,
  Star,
  Assessment,
  Download,
  Refresh,
  Person,
  Group,
  Schedule,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import metricsService, { StudentProgress, ChoreographyStats, SystemMetrics } from '../services/MetricsService';

interface MetricsDashboardProps {
  open: boolean;
  onClose: () => void;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ open, onClose }) => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [choreographyStats, setChoreographyStats] = useState<ChoreographyStats[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadMetrics();
    }
  }, [open]);

  const loadMetrics = () => {
    setLoading(true);
    
    // Simular carga de datos
    setTimeout(() => {
      const system = metricsService.getSystemMetrics();
      const weekly = metricsService.getWeeklyProgressReport();
      
      // Generar datos de ejemplo para estudiantes y coreografías
      const students: StudentProgress[] = [
        {
          studentId: 'student-1',
          studentName: 'Ana García',
          totalPracticeTime: 180,
          choreographiesCompleted: 3,
          averageAccuracy: 87,
          lastPracticeDate: new Date(),
          improvementTrend: 'up'
        },
        {
          studentId: 'student-2',
          studentName: 'Carlos López',
          totalPracticeTime: 240,
          choreographiesCompleted: 4,
          averageAccuracy: 92,
          lastPracticeDate: new Date(),
          improvementTrend: 'stable'
        },
        {
          studentId: 'student-3',
          studentName: 'María Rodríguez',
          totalPracticeTime: 150,
          choreographiesCompleted: 2,
          averageAccuracy: 78,
          lastPracticeDate: new Date(),
          improvementTrend: 'down'
        }
      ];

      const choreographies: ChoreographyStats[] = [
        {
          choreographyId: '1',
          choreographyName: 'Hip Hop Fusion',
          totalPracticeSessions: 15,
          averageCompletionTime: 45,
          mostDifficultFormation: 'Central Formation',
          studentEngagement: 8,
          lastPracticed: new Date()
        },
        {
          choreographyId: '2',
          choreographyName: 'Contemporary Expressive',
          totalPracticeSessions: 12,
          averageCompletionTime: 60,
          mostDifficultFormation: 'Opening',
          studentEngagement: 6,
          lastPracticed: new Date()
        }
      ];

      setSystemMetrics(system);
      setStudentProgress(students);
      setChoreographyStats(choreographies);
      setWeeklyReport(weekly);
      setLoading(false);
    }, 1000);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      default: return <TrendingFlat color="warning" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      default: return 'warning';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatUptime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days}d ${hours % 24}h` : `${hours}h`;
  };

  const exportMetrics = () => {
    const data = metricsService.exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heliopsis-metrics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>📊 Metrics Dashboard</DialogTitle>
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
        📊 Metrics Dashboard
        <Box>
          <Tooltip title="Refresh metrics">
            <IconButton onClick={loadMetrics} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export metrics">
            <IconButton onClick={exportMetrics} color="primary">
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* System Metrics */}
          {systemMetrics && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Assessment sx={{ mr: 1 }} />
                  System Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4" color="primary">
                        {systemMetrics.totalUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Timer sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h4" color="success.main">
                        {formatTime(systemMetrics.totalPracticeTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Practice Time
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <MusicNote sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h4" color="info.main">
                        {systemMetrics.totalChoreographies}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Coreographies
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4" color="warning.main">
                        {formatTime(systemMetrics.averageSessionDuration)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Duration
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Weekly Report */}
          {weeklyReport && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <EmojiEvents sx={{ mr: 1 }} />
                  Weekly Report
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      {weeklyReport.week}
                    </Typography>
                    <Typography variant="h5">
                      {weeklyReport.totalSessions} sessions
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Total Time
                    </Typography>
                    <Typography variant="h5">
                      {formatTime(weeklyReport.totalPracticeTime)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary">
                      Average Accuracy
                    </Typography>
                    <Typography variant="h5">
                      {weeklyReport.averageAccuracy.toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          <Grid container spacing={3}>
            {/* Student Progress */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    Student Progress
                  </Typography>
                  <List>
                    {studentProgress.map((student, index) => (
                      <motion.div
                        key={student.studentId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {student.studentName.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={student.studentName}
                            secondary={
                              <span style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                                {formatTime(student.totalPracticeTime)} • {student.choreographiesCompleted} choreographies
                              </span>
                            }
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, ml: 7 }}>
                            <LinearProgress
                              variant="determinate"
                              value={student.averageAccuracy}
                              sx={{ width: '100%', mr: 1 }}
                            />
                            <span style={{ minWidth: 40, fontSize: '0.875rem' }}>
                              {student.averageAccuracy}%
                            </span>
                            {getTrendIcon(student.improvementTrend)}
                          </Box>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Choreography Statistics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <MusicNote sx={{ mr: 1 }} />
                    Choreography Statistics
                  </Typography>
                  <List>
                    {choreographyStats.map((choreography, index) => (
                      <motion.div
                        key={choreography.choreographyId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem>
                          <ListItemText
                            primary={choreography.choreographyName}
                            secondary={
                              <span style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                                Average time: {formatTime(choreography.averageCompletionTime)}
                              </span>
                            }
                          />
                          <Box sx={{ display: 'flex', gap: 1, mb: 1, ml: 7 }}>
                            <Chip
                              label={`${choreography.totalPracticeSessions} sessions`}
                              size="small"
                              color="primary"
                            />
                            <Chip
                              label={`${choreography.studentEngagement} students`}
                              size="small"
                              color="secondary"
                            />
                          </Box>
                          <Box sx={{ ml: 7, mb: 1 }}>
                            <span style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                              Last practice: {choreography.lastPracticed.toLocaleDateString()}
                            </span>
                          </Box>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetricsDashboard;
