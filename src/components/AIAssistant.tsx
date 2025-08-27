import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Psychology,
  Lightbulb,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  Refresh,
  AutoFixHigh,
  Visibility,
  VisibilityOff,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import aiService, { FormationSuggestion, PostureAnalysis, ChoreographyOptimization } from '../services/AIService';

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
  currentFormation?: any;
  dancers?: any[];
  musicTempo?: number;
  musicStyle?: string;
  choreography?: any;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  open,
  onClose,
  currentFormation,
  dancers = [],
  musicTempo,
  musicStyle = 'contemporary',
  choreography
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [suggestions, setSuggestions] = useState<FormationSuggestion[]>([]);
  const [postureAnalysis, setPostureAnalysis] = useState<PostureAnalysis[]>([]);
  const [optimization, setOptimization] = useState<ChoreographyOptimization | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const analyzeCurrentState = useCallback(async () => {
    setLoading(true);
    
    // Simular análisis con delay
    setTimeout(() => {
      // Obtener sugerencias de formaciones
      const formationSuggestions = aiService.suggestFormations({
        dancerCount: dancers.length,
        style: musicStyle,
        difficulty: 'medium'
      });
      setSuggestions(formationSuggestions);

      // Analizar postura
      if (dancers.length > 0) {
        const posture = aiService.analyzePosture(dancers, musicTempo);
        setPostureAnalysis(posture);
      }

      // Optimizar coreografía
      if (choreography) {
        const opt = aiService.optimizeChoreography({
          formations: choreography.formations || [],
          musicTempo: musicTempo || 120,
          style: musicStyle
        });
        setOptimization(opt);
      }

      setLoading(false);
    }, 1500);
  }, [dancers, musicTempo, musicStyle, choreography]);

  useEffect(() => {
    if (open) {
      analyzeCurrentState();
    }
  }, [open, currentFormation, dancers, musicTempo, musicStyle, choreography, analyzeCurrentState]);

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return <Error />;
      case 'medium': return <Warning />;
      case 'low': return <Info />;
      default: return <Info />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const tabs = [
    { label: '💡 Suggestions', icon: <Lightbulb /> },
    { label: '🎭 Posture Analysis', icon: <Psychology /> },
    { label: '⚡ Optimization', icon: <AutoFixHigh /> }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Psychology sx={{ mr: 1, color: 'primary.main' }} />
          AI Assistant
        </Box>
        <Box>
          <Tooltip title="Update analysis">
            <IconButton onClick={analyzeCurrentState} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title={showDetails ? "Hide details" : "Show details"}>
            <IconButton onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              Analyzing choreography...
            </Typography>
          </Box>
        )}

        {/* Tabs de navegación */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {tabs.map((tab, index) => (
              <Button
                key={index}
                variant={activeTab === index ? 'contained' : 'outlined'}
                startIcon={tab.icon}
                onClick={() => setActiveTab(index)}
                sx={{ 
                  minWidth: 'auto',
                  px: 2,
                  py: 1
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>
        </Box>

        <AnimatePresence mode="wait">
          {/* Tab 1: Sugerencias de Formaciones */}
          {activeTab === 0 && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Lightbulb sx={{ mr: 1 }} />
                Formation Suggestions
              </Typography>
              
              {suggestions.length > 0 ? (
                <Grid container spacing={2}>
                  {suggestions.map((suggestion, index) => (
                    <Grid item xs={12} md={6} key={suggestion.id}>
                      <Card sx={{ 
                        height: '100%',
                        border: '1px solid',
                        borderColor: 'primary.light',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" color="primary">
                              {suggestion.name}
                            </Typography>
                            <Chip
                              label={`${Math.round(suggestion.confidence * 100)}%`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {suggestion.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip
                              label={suggestion.difficulty}
                              size="small"
                              color={suggestion.difficulty === 'easy' ? 'success' : 
                                     suggestion.difficulty === 'medium' ? 'warning' : 'error'}
                            />
                            <Chip
                              label={suggestion.style}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Dancers: {suggestion.dancers.length}
                          </Typography>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            startIcon={<Star />}
                          >
                            Apply Suggestion
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  No suggestions available at this time.
                </Alert>
              )}
            </motion.div>
          )}

          {/* Tab 2: Análisis de Postura */}
          {activeTab === 1 && (
            <motion.div
              key="posture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Psychology sx={{ mr: 1 }} />
                Posture Analysis
              </Typography>
              
              {postureAnalysis.length > 0 ? (
                <List>
                  {postureAnalysis.map((analysis, index) => (
                    <Accordion key={analysis.dancerId} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            Dancer {analysis.dancerId}
                          </Typography>
                          <Chip
                            label={`${analysis.overallScore}/100`}
                            color={getScoreColor(analysis.overallScore)}
                            sx={{ mr: 2 }}
                          />
                          <LinearProgress
                            variant="determinate"
                            value={analysis.overallScore}
                            color={getScoreColor(analysis.overallScore)}
                            sx={{ width: 100, mr: 2 }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {analysis.issues.length > 0 ? (
                          <List dense>
                            {analysis.issues.map((issue, issueIndex) => (
                              <ListItem key={issueIndex}>
                                <ListItemIcon>
                                  {getSeverityIcon(issue.severity)}
                                </ListItemIcon>
                                <ListItemText
                                  primary={issue.description}
                                  secondary={issue.suggestion}
                                />
                                <Chip
                                  label={issue.severity}
                                  size="small"
                                  color={getSeverityColor(issue.severity)}
                                />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Alert severity="success">
                            Excellent posture! No problems detected.
                          </Alert>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  No dancers to analyze at this time.
                </Alert>
              )}
            </motion.div>
          )}

          {/* Tab 3: Optimización */}
          {activeTab === 2 && (
            <motion.div
              key="optimization"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <AutoFixHigh sx={{ mr: 1 }} />
                Choreography Optimization
              </Typography>
              
              {optimization ? (
                <Box>
                  <Alert 
                    severity="success" 
                    sx={{ mb: 2 }}
                    icon={<TrendingUp />}
                  >
                    Estimated improvement: +{optimization.overallImprovement}%
                  </Alert>
                  
                  <List>
                    {optimization.suggestions.map((suggestion, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={suggestion.description}
                          secondary={suggestion.implementation}
                        />
                        <Chip
                          label={suggestion.impact}
                          size="small"
                          color={suggestion.impact === 'high' ? 'error' : 
                                 suggestion.impact === 'medium' ? 'warning' : 'success'}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Alert severity="info">
                  No choreography to optimize at this time.
                </Alert>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button 
          onClick={analyzeCurrentState} 
          variant="contained"
          disabled={loading}
          startIcon={<Refresh />}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIAssistant;
