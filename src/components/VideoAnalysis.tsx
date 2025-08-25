import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Slider,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  Speed,
  ZoomIn,
  ZoomOut,
  Brush,
  Undo,
  Redo,
  Save,
  Share,
  CameraAlt,
  Videocam,
  VideocamOff,
  SlowMotionVideo,
  Timeline,
  Flag,
  Edit,
  Delete,
  Add,
  Visibility,
  VisibilityOff,
  GridOn,
  GridOff,
  VideoLibrary
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

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

interface DrawingTool {
  type: 'brush' | 'arrow' | 'circle' | 'rectangle' | 'line';
  color: string;
  size: number;
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
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [selectedTool, setSelectedTool] = useState<DrawingTool>({
    type: 'brush',
    color: '#FF6B9D',
    size: 3
  });
  const [markers, setMarkers] = useState<AnalysisMarker[]>([]);
  const [showMarkerDialog, setShowMarkerDialog] = useState(false);
  const [editingMarker, setEditingMarker] = useState<AnalysisMarker | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<HTMLCanvasElement>(null);
  
  const [drawingHistory, setDrawingHistory] = useState<string[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<string>('');

  // Simulación de video (en una implementación real sería un archivo real)
  const mockVideoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';

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

  const handleDrawingStart = (e: React.MouseEvent) => {
    if (!drawingRef.current || !showDrawingTools) return;
    
    const canvas = drawingRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = selectedTool.color;
    ctx.lineWidth = selectedTool.size;
    ctx.lineCap = 'round';
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const moveX = moveEvent.clientX - rect.left;
      const moveY = moveEvent.clientY - rect.top;
      ctx.lineTo(moveX, moveY);
      ctx.stroke();
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Guardar el dibujo actual
      const currentPath = canvas.toDataURL();
      setDrawingHistory(prev => [...prev, currentPath]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const undoDrawing = () => {
    if (drawingHistory.length > 0) {
      setDrawingHistory(prev => prev.slice(0, -1));
    }
  };

  const clearDrawing = () => {
    setDrawingHistory([]);
    if (drawingRef.current) {
      const ctx = drawingRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, drawingRef.current.width, drawingRef.current.height);
      }
    }
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
      {/* Header con Controles Principales */}
      <Paper sx={{ 
        p: 2, 
        mb: 2,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            🎥 Análisis de Video - Coach's Eye Style
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={isRecording ? 'Grabando...' : 'Listo'}
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

        {/* Controles de Grabación y Reproducción */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Button
            variant={isRecording ? 'contained' : 'outlined'}
            color={isRecording ? 'error' : 'primary'}
            startIcon={isRecording ? <VideocamOff /> : <Videocam />}
            onClick={isRecording ? stopRecording : startRecording}
            sx={{ color: isRecording ? 'white' : 'white' }}
          >
            {isRecording ? 'Detener' : 'Grabar'}
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

        {/* Controles de Velocidad y Zoom */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Velocidad:</Typography>
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
          <Tab label="✏️ Telestración" />
          <Tab label="📍 Marcadores" />
          <Tab label="📊 Análisis" />
        </Tabs>
      </Box>

      {/* Contenido según Tab */}
             {currentTab === 0 && (
         <Box>
           <Typography variant="h6" sx={{ mb: 2 }}>Reproducción de Video</Typography>
           
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
                 📁 Subir Video para Análisis
               </Button>
             </label>
             <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
               Formatos soportados: MP4, MOV, AVI, MKV (máx. 500MB)
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
               poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' dy='.3em' fill='%23999'%3E🎥 Sube un video para comenzar el análisis%3C/text%3E%3C/svg%3E"
             />
             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
               📝 Una vez cargado el video, podrás usar todas las herramientas de análisis
             </Typography>
           </Paper>
         </Box>
       )}

      {currentTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Herramientas de Telestración</Typography>
          
          {/* Controles de Dibujo */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="subtitle2">Herramientas:</Typography>
              {['brush', 'arrow', 'circle', 'rectangle', 'line'].map((tool) => (
                <IconButton
                  key={tool}
                  onClick={() => setSelectedTool(prev => ({ ...prev, type: tool as any }))}
                  color={selectedTool.type === tool ? 'primary' : 'default'}
                  size="small"
                >
                  {tool === 'brush' && <Brush />}
                  {tool === 'arrow' && <Edit />}
                  {tool === 'circle' && <Add />}
                  {tool === 'rectangle' && <Add />}
                  {tool === 'line' && <Timeline />}
                </IconButton>
              ))}
              
              <TextField
                type="color"
                value={selectedTool.color}
                onChange={(e) => setSelectedTool(prev => ({ ...prev, color: e.target.value }))}
                size="small"
                sx={{ width: 60 }}
              />
              
              <TextField
                type="number"
                label="Tamaño"
                value={selectedTool.size}
                onChange={(e) => setSelectedTool(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                size="small"
                sx={{ width: 80 }}
                inputProps={{ min: 1, max: 20 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<Undo />}
                onClick={undoDrawing}
                disabled={drawingHistory.length === 0}
                size="small"
              >
                Deshacer
              </Button>
              <Button
                startIcon={<Delete />}
                onClick={clearDrawing}
                color="error"
                size="small"
              >
                Limpiar
              </Button>
              <FormControlLabel
                control={
                  <Switch
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                  />
                }
                label="Mostrar Cuadrícula"
              />
            </Box>
          </Paper>

          {/* Canvas de Dibujo */}
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <canvas
              ref={drawingRef}
              width={800}
              height={600}
              onMouseDown={handleDrawingStart}
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'crosshair',
                background: showGrid ? 
                  'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)' : 
                  'white',
                backgroundSize: '20px 20px'
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Haz clic y arrastra para dibujar sobre el video
            </Typography>
          </Paper>
        </Box>
      )}

      {currentTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Marcadores de Análisis</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Marca momentos importantes para análisis técnico
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
              Agregar Marcador
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
          <Typography variant="h6" sx={{ mb: 2 }}>Análisis Técnico</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>📊 Estadísticas</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>🎯</ListItemIcon>
                      <ListItemText 
                        primary="Marcadores Técnicos" 
                        secondary={`${markers.filter(m => m.type === 'technique').length} marcadores`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>🎭</ListItemIcon>
                      <ListItemText 
                        primary="Formaciones" 
                        secondary={`${markers.filter(m => m.type === 'formation').length} marcadores`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>⚠️</ListItemIcon>
                      <ListItemText 
                        primary="Correcciones" 
                        secondary={`${markers.filter(m => m.type === 'correction').length} marcadores`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>💡 Recomendaciones</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>⭐</ListItemIcon>
                      <ListItemText 
                        primary="Mejorar sincronización" 
                        secondary="Practicar transiciones entre formaciones"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>⭐</ListItemIcon>
                      <ListItemText 
                        primary="Técnica de brazos" 
                        secondary="Mantener brazos más estirados en la posición 2"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Dialog para Agregar/Editar Marcador */}
      <Dialog open={showMarkerDialog} onClose={() => setShowMarkerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMarker ? 'Editar Marcador' : 'Nuevo Marcador'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
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
                label="Tipo"
                value={editingMarker?.type || 'technique'}
                onChange={(e) => setEditingMarker(prev => prev ? { ...prev, type: e.target.value as any } : null)}
              >
                <option value="technique">🎯 Técnica</option>
                <option value="formation">🎭 Formación</option>
                <option value="correction">⚠️ Corrección</option>
                <option value="highlight">⭐ Destacado</option>
              </TextField>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tiempo (segundos)"
                type="number"
                value={editingMarker?.time || currentTime}
                onChange={(e) => setEditingMarker(prev => prev ? { ...prev, time: parseFloat(e.target.value) } : null)}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMarkerDialog(false)}>Cancelar</Button>
          <Button 
            onClick={() => {
              if (editingMarker) {
                // Actualizar marcador existente
                setMarkers(prev => prev.map(m => m.id === editingMarker.id ? editingMarker : m));
                setEditingMarker(null);
              } else {
                // Agregar nuevo marcador
                addMarker({
                  time: currentTime,
                  type: 'technique',
                  description: 'Nuevo marcador',
                  color: '#FF6B9D'
                });
              }
              setShowMarkerDialog(false);
            }}
            variant="contained"
          >
            {editingMarker ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoAnalysis;
