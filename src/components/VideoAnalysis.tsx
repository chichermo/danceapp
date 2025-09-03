import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  ZoomIn,
  ZoomOut,
  Videocam,
  VideocamOff,
  Edit,
  Delete,
  Add,
  VideoLibrary
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface VideoAnalysisProps {
  choreographyId: string;
  currentTime: number;
  onTimeChange: (time: number) => void;
  onSaveAnalysis: (analysis: any) => void;
}

interface AnalysisMarker {
  id: string;
  time: number;
  type: 'technique' | 'formation' | 'correction' | 'highlight';
  description: string;
  color: string;
  position?: { x: number; y: number };
  drawing?: string; // SVG path data
}



const VideoAnalysis: React.FC<VideoAnalysisProps> = ({
  choreographyId,
  currentTime,
  onTimeChange,
  onSaveAnalysis
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTab, setCurrentTab] = useState(0);
  const [markers, setMarkers] = useState<AnalysisMarker[]>([]);
  const [showMarkerDialog, setShowMarkerDialog] = useState(false);
  const [editingMarker, setEditingMarker] = useState<AnalysisMarker | null>(null);

  const [zoom, setZoom] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(${newZoom})`;
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // En una implementación real, aquí se iniciaría la grabación
    console.log('Iniciando grabación...');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // En una implementación real, aquí se detendría la grabación
    console.log('Deteniendo grabación...');
  };

  const addMarker = (marker: Omit<AnalysisMarker, 'id'>) => {
    const newMarker: AnalysisMarker = {
      ...marker,
      id: Date.now().toString()
    };
    setMarkers(prev => [...prev, newMarker]);
  };

  const deleteMarker = (id: string) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };





  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'technique': return '🎯';
      case 'formation': return '🎭';
      case 'correction': return '⚠️';
      case 'highlight': return '⭐';
      default: return '📍';
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'technique': return '#4ECDC4';
      case 'formation': return '#FF6B9D';
      case 'correction': return '#FFD700';
      case 'highlight': return '#9C27B0';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
              {/* Header with Main Controls */}
      <Paper sx={{ 
        p: 2, 
        mb: 2,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            🎥 Video Analysis - Coach's Eye Style
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={isRecording ? 'Recording...' : 'Ready'}
              color={isRecording ? 'error' : 'default'}
              size="small"
            />
            <Chip 
              label={`${playbackSpeed}x`}
              size="small"
              sx={{ background: 'rgba(255,255,255,0.2)' }}
            />
          </Box>
        </Box>

        {/* Recording and Playback Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Button
            variant={isRecording ? 'contained' : 'outlined'}
            color={isRecording ? 'error' : 'primary'}
            startIcon={isRecording ? <VideocamOff /> : <Videocam />}
            onClick={isRecording ? stopRecording : startRecording}
            sx={{ color: isRecording ? 'white' : 'white' }}
          >
            {isRecording ? 'Stop' : 'Record'}
          </Button>

          <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton sx={{ color: 'white' }}>
            <Stop />
          </IconButton>

          <IconButton sx={{ color: 'white' }}>
            <SkipPrevious />
          </IconButton>

          <IconButton sx={{ color: 'white' }}>
            <SkipNext />
          </IconButton>
        </Box>

        {/* Speed and Zoom Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Speed:</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
                <Button
                  key={speed}
                  size="small"
                  variant={playbackSpeed === speed ? 'contained' : 'outlined'}
                  onClick={() => handleSpeedChange(speed)}
                  sx={{ 
                    minWidth: 'auto', 
                    px: 1,
                    color: playbackSpeed === speed ? 'white' : 'white'
                  }}
                >
                  {speed}x
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Zoom:</Typography>
            <IconButton onClick={() => handleZoomChange(Math.max(0.5, zoom - 0.1))} sx={{ color: 'white' }}>
              <ZoomOut />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center' }}>
              {zoom.toFixed(1)}x
            </Typography>
            <IconButton onClick={() => handleZoomChange(Math.min(3, zoom + 0.1))} sx={{ color: 'white' }}>
              <ZoomIn />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Tabs de Funcionalidades */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ 
            '& .MuiTab-root': { 
              minWidth: 'auto', 
              px: 3,
              textTransform: 'none',
              fontWeight: 'bold'
            }
          }}
        >
          <Tab label="🎥 Video" />
          <Tab label="✏️ Telestracion" />
          <Tab label="📍 Markers" />
          <Tab label="📊 Analysis" />
        </Tabs>
      </Box>

      {/* Contenido según Tab */}
             {currentTab === 0 && (
         <Box>
           <Typography variant="h6" sx={{ mb: 2 }}>Video Playback</Typography>
           
           {/* Sección de subida de video */}
           <Paper sx={{ p: 3, mb: 3, textAlign: 'center', borderStyle: 'dashed', borderColor: '#ccc' }}>
             <input
               accept="video/*"
               style={{ display: 'none' }}
               id="video-analysis-upload"
               type="file"
               onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                   const url = URL.createObjectURL(file);
                   if (videoRef.current) {
                     videoRef.current.src = url;
                   }
                   console.log('🎥 Video de análisis cargado:', file.name);
                 }
               }}
             />
             <label htmlFor="video-analysis-upload">
               <Button
                 variant="outlined"
                 component="span"
                 startIcon={<VideoLibrary />}
                 sx={{ 
                   borderStyle: 'dashed',
                   borderWidth: 2,
                   py: 2,
                   px: 4,
                   fontSize: '1.1rem'
                 }}
               >
                 📁 Upload Video for Analysis
               </Button>
             </label>
             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
               Supported formats: MP4, MOV, AVI, MKV (max 500MB)
             </Typography>
           </Paper>

           {/* Reproductor de video */}
           <Paper sx={{ p: 2, textAlign: 'center' }}>
             <video
               ref={videoRef}
               style={{ 
                 width: '100%', 
                 maxWidth: '800px',
                 borderRadius: '8px',
                 border: '2px solid #e0e0e0'
               }}
               controls
               onPlay={() => setIsPlaying(true)}
               onPause={() => setIsPlaying(false)}
               poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' dy='.3em' fill='%23999'%3E🎥 Upload a video to start analysis%3C/text%3E%3C/svg%3E"
             />
             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
               📝 Once the video is loaded, you can use all analysis tools
             </Typography>
           </Paper>
         </Box>
       )}



      {currentTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Analysis Markers</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Mark important moments for technical analysis
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowMarkerDialog(true)}
              sx={{
                background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #E55A8A, #43B5B0)'
                }
              }}
            >
              Add Marker
            </Button>
          </Box>

          {/* Lista de Marcadores */}
          <Grid container spacing={2}>
            {markers.map((marker) => (
              <Grid item xs={12} sm={6} md={4} key={marker.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderLeft: `4px solid ${getMarkerColor(marker.type)}`,
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <span style={{ fontSize: '20px' }}>{getMarkerIcon(marker.type)}</span>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {marker.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setEditingMarker(marker);
                          setShowMarkerDialog(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => deleteMarker(marker.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {currentTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Technical Analysis</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>📊 Statistics</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>🎯</ListItemIcon>
                      <ListItemText 
                        primary="Technical Markers" 
                        secondary={`${markers.filter(m => m.type === 'technique').length} markers`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>🎭</ListItemIcon>
                      <ListItemText 
                        primary="Formations" 
                        secondary={`${markers.filter(m => m.type === 'formation').length} markers`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>⚠️</ListItemIcon>
                      <ListItemText 
                        primary="Corrections" 
                        secondary={`${markers.filter(m => m.type === 'correction').length} markers`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>💡 Recommendations</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>⭐</ListItemIcon>
                      <ListItemText 
                        primary="Improve synchronization" 
                        secondary="Practice transitions between formations"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>⭐</ListItemIcon>
                      <ListItemText 
                        primary="Arm technique" 
                        secondary="Keep arms more extended in position 2"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Dialog to Add/Edit Marker */}
      <Dialog open={showMarkerDialog} onClose={() => setShowMarkerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMarker ? 'Edit Marker' : 'New Marker'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={editingMarker?.description || ''}
                onChange={(e) => setEditingMarker(prev => prev ? { ...prev, description: e.target.value } : null)}
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={editingMarker?.type || 'technique'}
                onChange={(e) => setEditingMarker(prev => prev ? { ...prev, type: e.target.value as any } : null)}
              >
                <option value="technique">🎯 Technique</option>
                <option value="formation">🎭 Formation</option>
                <option value="correction">⚠️ Correction</option>
                <option value="highlight">⭐ Highlight</option>
              </TextField>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time (seconds)"
                type="number"
                value={editingMarker?.time || currentTime}
                onChange={(e) => setEditingMarker(prev => prev ? { ...prev, time: parseFloat(e.target.value) } : null)}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMarkerDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (editingMarker) {
                // Update existing marker
                setMarkers(prev => prev.map(m => m.id === editingMarker.id ? editingMarker : m));
                setEditingMarker(null);
              } else {
                // Add new marker
                addMarker({
                  time: currentTime,
                  type: 'technique',
                  description: 'New marker',
                  color: '#FF6B9D'
                });
              }
              setShowMarkerDialog(false);
            }}
            variant="contained"
          >
            {editingMarker ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoAnalysis;
