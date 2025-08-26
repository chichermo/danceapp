import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Slider,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Settings,
  MusicNote,
  VideoLibrary,
  ViewInAr,
  Speed
} from '@mui/icons-material';
import { musicService, MusicTrack } from '../services/MusicService';
import { videoService, VideoTrack, FormationFrame } from '../services/VideoService';

interface Formation3DPlayerProps {
  onFormationUpdate?: (frame: FormationFrame) => void;
}

const Formation3DPlayer: React.FC<Formation3DPlayerProps> = ({ onFormationUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoTrack | null>(null);
  const [currentFrame, setCurrentFrame] = useState<FormationFrame | null>(null);
  const [show3DView, setShow3DView] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const musicTracks = musicService.getAllTracks();
  const videoTracks = videoService.getAllVideos();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Seleccionar música y video por defecto
    if (musicTracks.length > 0 && !selectedMusic) {
      setSelectedMusic(musicTracks[0]);
    }
    if (videoTracks.length > 0 && !selectedVideo) {
      setSelectedVideo(videoTracks[0]);
    }
  }, [musicTracks, videoTracks, selectedMusic, selectedVideo]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1 * playbackSpeed;
          if (newTime >= duration) {
            handleStop();
            return duration;
          }
          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, duration]);

  const handlePlay = async () => {
    if (!selectedMusic || !selectedVideo) return;

    setIsPlaying(true);
    setDuration(Math.max(selectedMusic.duration, selectedVideo.duration));

    // Simular reproducción de música
    if (selectedMusic) {
      musicService.playTrack(selectedMusic.id, (progress) => {
        if (autoSync) {
          setCurrentTime(progress * selectedMusic.duration);
        }
      });
    }

    // Simular reproducción de video con formaciones
    if (selectedVideo) {
      videoService.playVideo(selectedVideo.id, (progress, frame) => {
        setCurrentFrame(frame);
        if (onFormationUpdate) {
          onFormationUpdate(frame);
        }
        if (autoSync) {
          setCurrentTime(progress * selectedVideo.duration);
        }
      });
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentFrame(null);
  };

  const handleTimeChange = (event: Event, newValue: number | number[]) => {
    const time = newValue as number;
    setCurrentTime(time);
    
    // Actualizar frame actual si hay video seleccionado
    if (selectedVideo && selectedVideo.formationData) {
      const frameIndex = Math.floor((time / selectedVideo.duration) * selectedVideo.formationData.length);
      const frame = selectedVideo.formationData[frameIndex];
      if (frame) {
        setCurrentFrame(frame);
        if (onFormationUpdate) {
          onFormationUpdate(frame);
        }
      }
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    setPlaybackSpeed(newValue as number);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ViewInAr color="primary" />
        Reproductor de Formaciones 3D
      </Typography>

      <Grid container spacing={3}>
        {/* Panel de Control Principal */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Controles de Reproducción
              </Typography>

              {/* Controles de reproducción */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <IconButton
                  onClick={isPlaying ? handlePause : handlePlay}
                  color="primary"
                  size="large"
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                
                <IconButton onClick={handleStop} color="secondary">
                  <Stop />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                  <Slider
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    min={0}
                    max={1}
                    step={0.1}
                    sx={{ width: 100 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Speed />
                  <Slider
                    value={playbackSpeed}
                    onChange={handleSpeedChange}
                    min={0.5}
                    max={2}
                    step={0.1}
                    sx={{ width: 100 }}
                  />
                  <Typography variant="body2">{playbackSpeed}x</Typography>
                </Box>
              </Box>

              {/* Barra de progreso */}
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getProgress()}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">{formatTime(currentTime)}</Typography>
                  <Typography variant="body2">{formatTime(duration)}</Typography>
                </Box>
              </Box>

              {/* Slider de tiempo */}
              <Slider
                value={currentTime}
                onChange={handleTimeChange}
                min={0}
                max={duration}
                step={0.1}
                sx={{ mb: 3 }}
              />

              {/* Información del frame actual */}
              {currentFrame && (
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Frame Actual ({formatTime(currentTime)})
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Bailarines:</strong> {currentFrame.dancers.length}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Efectos:</strong> {currentFrame.effects.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Cámara:</strong> ({currentFrame.camera.x.toFixed(1)}, {currentFrame.camera.y.toFixed(1)}, {currentFrame.camera.z.toFixed(1)})
                        </Typography>
                        <Typography variant="body2">
                          <strong>FOV:</strong> {currentFrame.camera.fov}°
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Panel de Selección */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selección de Contenido
              </Typography>

              {/* Selección de música */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Música</InputLabel>
                <Select
                  value={selectedMusic?.id || ''}
                  onChange={(e) => {
                    const track = musicTracks.find(t => t.id === e.target.value);
                    setSelectedMusic(track || null);
                  }}
                >
                  {musicTracks.map(track => (
                    <MenuItem key={track.id} value={track.id}>
                      <Box>
                        <Typography variant="body2">{track.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {track.artist} • {track.genre} • {track.tempo} BPM
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selección de video */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Video</InputLabel>
                <Select
                  value={selectedVideo?.id || ''}
                  onChange={(e) => {
                    const video = videoTracks.find(v => v.id === e.target.value);
                    setSelectedVideo(video || null);
                  }}
                >
                  {videoTracks.map(video => (
                    <MenuItem key={video.id} value={video.id}>
                      <Box>
                        <Typography variant="body2">{video.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {video.type} • {video.resolution} • {formatTime(video.duration)}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Configuraciones */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={show3DView}
                      onChange={(e) => setShow3DView(e.target.checked)}
                    />
                  }
                  label="Vista 3D"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                    />
                  }
                  label="Sincronización Automática"
                />
              </Box>

              {/* Información de la selección */}
              {selectedMusic && (
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MusicNote color="primary" />
                      Música Seleccionada
                    </Typography>
                    <Typography variant="body2">{selectedMusic.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedMusic.artist} • {selectedMusic.genre}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label={`${selectedMusic.tempo} BPM`} size="small" />
                      <Chip label={formatTime(selectedMusic.duration)} size="small" sx={{ ml: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              )}

              {selectedVideo && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VideoLibrary color="primary" />
                      Video Seleccionado
                    </Typography>
                    <Typography variant="body2">{selectedVideo.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedVideo.type} • {selectedVideo.resolution}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label={selectedVideo.type} size="small" />
                      <Chip label={formatTime(selectedVideo.duration)} size="small" sx={{ ml: 1 }} />
                      {selectedVideo.formationData && (
                        <Chip 
                          label={`${selectedVideo.formationData.length} frames`} 
                          size="small" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estadísticas */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Estadísticas del Sistema
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Pistas de Música
              </Typography>
              <Typography variant="h6">
                {musicService.getMusicStats().totalTracks}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Videos Disponibles
              </Typography>
              <Typography variant="h6">
                {videoService.getVideoStats().totalVideos}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Plantillas de Formación
              </Typography>
              <Typography variant="h6">
                {videoService.getFormationTemplates().length}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Géneros de Música
              </Typography>
              <Typography variant="h6">
                {Object.keys(musicService.getMusicStats().genres).length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Formation3DPlayer;
