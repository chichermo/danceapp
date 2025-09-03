import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Button,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  Speed,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  type: 'formation' | 'cue' | 'highlight' | 'note';
  color: string;
  description?: string;
}

interface MusicTimelineProps {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onStop: () => void;
  onMarkerAdd: (marker: TimelineMarker) => void;
  onMarkerEdit: (marker: TimelineMarker) => void;
  onMarkerDelete: (markerId: string) => void;
  markers: TimelineMarker[];
  currentFormation?: string;
}

const MusicTimeline: React.FC<MusicTimelineProps> = ({
  duration,
  currentTime,
  isPlaying,
  onTimeChange,
  onPlayPause,
  onStop,
  onMarkerAdd,
  onMarkerEdit,
  onMarkerDelete,
  markers,
  currentFormation
}) => {
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showMarkerDialog, setShowMarkerDialog] = useState(false);
  const [editingMarker, setEditingMarker] = useState<TimelineMarker | null>(null);
  const [newMarker, setNewMarker] = useState<Partial<TimelineMarker>>({
    time: 0,
    label: '',
    type: 'formation',
    color: '#FF6B9D'
  });
  const [showVolume, setShowVolume] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (event: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      onTimeChange(newTime);
    }
  };

  const handleMarkerClick = (marker: TimelineMarker) => {
    onTimeChange(marker.time);
  };

  const handleAddMarker = () => {
    if (newMarker.label && newMarker.time !== undefined) {
      const marker: TimelineMarker = {
        id: Date.now().toString(),
        time: newMarker.time,
        label: newMarker.label,
        type: newMarker.type as any,
        color: newMarker.color || '#FF6B9D',
        description: newMarker.description
      };
      onMarkerAdd(marker);
      setNewMarker({ time: 0, label: '', type: 'formation', color: '#FF6B9D' });
      setShowMarkerDialog(false);
    }
  };

  const handleEditMarker = () => {
    if (editingMarker) {
      onMarkerEdit(editingMarker);
      setEditingMarker(null);
      setShowMarkerDialog(false);
    }
  };

  const handleDeleteMarker = (markerId: string) => {
    onMarkerDelete(markerId);
    if (editingMarker?.id === markerId) {
      setEditingMarker(null);
      setShowMarkerDialog(false);
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'formation': return '🎭';
      case 'cue': return '🎯';
      case 'highlight': return '⭐';
      case 'note': return '📝';
      default: return '📍';
    }
  };



  const currentProgress = (currentTime / duration) * 100;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Controles de Reproducción */}
      <Paper sx={{ 
        p: 2, 
        mb: 2,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            🎵 Timeline Musical
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={currentFormation || 'Sin formación'}
              size="small"
              sx={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Chip 
              label={`${formatTime(currentTime)} / ${formatTime(duration)}`}
              size="small"
              sx={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontFamily: 'monospace'
              }}
            />
          </Box>
        </Box>

        {/* Barra de Progreso Principal */}
        <Box 
          ref={timelineRef}
          onClick={handleTimelineClick}
          sx={{ 
            position: 'relative',
            height: '60px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '30px',
            cursor: 'pointer',
            overflow: 'hidden',
            mb: 2
          }}
        >
          {/* Progreso de Reproducción */}
          <Box
            ref={progressRef}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${currentProgress}%`,
              background: 'linear-gradient(90deg, #FF6B9D 0%, #4ECDC4 100%)',
              borderRadius: '30px',
              transition: 'width 0.1s ease',
              boxShadow: '0 0 20px rgba(255,107,157,0.5)'
            }}
          />

          {/* Marcadores en el Timeline */}
          {markers.map((marker) => (
            <Tooltip 
              key={marker.id}
              title={`${marker.label} - ${formatTime(marker.time)}`}
              arrow
            >
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkerClick(marker);
                }}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: `${(marker.time / duration) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  background: marker.color,
                  borderRadius: '50%',
                  border: '3px solid white',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(1.2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                  }
                }}
              >
                {getMarkerIcon(marker.type)}
              </Box>
            </Tooltip>
          ))}

          {/* Indicador de Tiempo Actual */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${currentProgress}%`,
              transform: 'translate(-50%, -50%)',
              width: '4px',
              height: '100%',
              background: '#FFD700',
              borderRadius: '2px',
              zIndex: 5,
              boxShadow: '0 0 10px #FFD700'
            }}
          />

          {/* Texto de Tiempo */}
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              zIndex: 15
            }}
          >
            {formatTime(currentTime)}
          </Typography>
        </Box>

        {/* Controles de Reproducción */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => onTimeChange(Math.max(0, currentTime - 10))}
            sx={{ color: 'white' }}
          >
            <SkipPrevious />
          </IconButton>
          
          <IconButton 
            onClick={onPlayPause}
            sx={{ 
              color: 'white',
              background: 'rgba(255,255,255,0.2)',
              '&:hover': { background: 'rgba(255,255,255,0.3)' }
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          
          <IconButton 
            onClick={onStop}
            sx={{ color: 'white' }}
          >
            <Stop />
          </IconButton>
          
          <IconButton 
            onClick={() => onTimeChange(Math.min(duration, currentTime + 10))}
            sx={{ color: 'white' }}
          >
            <SkipNext />
          </IconButton>
        </Box>

        {/* Controles Adicionales */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Volume">
              <IconButton 
                size="small" 
                onClick={() => setShowVolume(!showVolume)}
                sx={{ color: 'white' }}
              >
                {volume > 0 ? <VolumeUp /> : <VolumeOff />}
              </IconButton>
            </Tooltip>
            
            {showVolume && (
              <Box sx={{ width: 100 }}>
                <Slider
                  size="small"
                  value={volume}
                  onChange={(e, value) => setVolume(value as number)}
                  min={0}
                  max={100}
                  sx={{ color: '#4ECDC4' }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Playback Speed">
              <IconButton 
                size="small" 
                onClick={() => setShowSpeed(!showSpeed)}
                sx={{ color: 'white' }}
              >
                <Speed />
              </IconButton>
            </Tooltip>
            
            {showSpeed && (
              <Box sx={{ width: 100 }}>
                <Slider
                  size="small"
                  value={playbackSpeed}
                  onChange={(e, value) => setPlaybackSpeed(value as number)}
                  min={0.25}
                  max={2}
                  step={0.25}
                  sx={{ color: '#FF6B9D' }}
                />
                <Typography variant="caption" sx={{ color: 'white', textAlign: 'center', display: 'block' }}>
                  {playbackSpeed}x
                </Typography>
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowMarkerDialog(true)}
            sx={{ 
              background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E55A8C 0%, #3DB8AF 100%)'
              }
            }}
          >
            Add Marker
          </Button>
        </Box>
      </Paper>

      {/* Lista de Marcadores */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          📍 Marcadores del Timeline
        </Typography>
        
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
                    borderLeft: `4px solid ${marker.color}`,
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleMarkerClick(marker)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <span style={{ fontSize: '20px' }}>{getMarkerIcon(marker.type)}</span>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {marker.label}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {formatTime(marker.time)}
                  </Typography>
                  
                  {marker.description && (
                    <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                      {marker.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMarker(marker);
                        setShowMarkerDialog(true);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMarker(marker.id);
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Dialog para Agregar/Editar Marcador */}
      <Dialog open={showMarkerDialog} onClose={() => setShowMarkerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMarker ? 'Edit Marker' : 'New Marker'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Label"
                value={editingMarker?.label || newMarker.label || ''}
                onChange={(e) => {
                  if (editingMarker) {
                    setEditingMarker({ ...editingMarker, label: e.target.value });
                  } else {
                    setNewMarker({ ...newMarker, label: e.target.value });
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Time (seconds)"
                type="number"
                value={editingMarker?.time || newMarker.time || 0}
                onChange={(e) => {
                  const time = parseFloat(e.target.value) || 0;
                  if (editingMarker) {
                    setEditingMarker({ ...editingMarker, time });
                  } else {
                    setNewMarker({ ...newMarker, time });
                  }
                }}
                inputProps={{ min: 0, max: duration, step: 0.1 }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={editingMarker?.type || newMarker.type || 'formation'}
                onChange={(e) => {
                  if (editingMarker) {
                    setEditingMarker({ ...editingMarker, type: e.target.value as any });
                  } else {
                    setNewMarker({ ...newMarker, type: e.target.value as any });
                  }
                }}
              >
                <option value="formation">🎭 Formation</option>
                <option value="cue">🎯 Cue</option>
                <option value="highlight">⭐ Highlight</option>
                <option value="note">📝 Note</option>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                multiline
                rows={2}
                value={editingMarker?.description || newMarker.description || ''}
                onChange={(e) => {
                  if (editingMarker) {
                    setEditingMarker({ ...editingMarker, description: e.target.value });
                  } else {
                    setNewMarker({ ...newMarker, description: e.target.value });
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMarkerDialog(false)}>Cancel</Button>
          {editingMarker && (
            <Button 
              color="error" 
              onClick={() => handleDeleteMarker(editingMarker.id)}
            >
              Delete
            </Button>
          )}
          <Button 
            onClick={editingMarker ? handleEditMarker : handleAddMarker}
            variant="contained"
          >
            {editingMarker ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MusicTimeline;
