import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Slider,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Alert,
  Fab,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  MusicNote as MusicIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  DragIndicator as DragIcon,
  Settings as SettingsIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Stage3D from '../components/Stage3D';
import CollaborationPanel from '../components/CollaborationPanel';
import MusicTimeline from '../components/MusicTimeline';
import VideoAnalysis from '../components/VideoAnalysis';
import TutorialGuide from '../components/TutorialGuide';
import Formation3DPlayer from '../components/Formation3DPlayer';
import studentService from '../services/StudentService';
import videoService from '../services/VideoService';
import musicService from '../services/MusicService';
import { Student } from '../types/Student';

interface Dancer {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  isVisible: boolean;
  formation?: string;
}

interface Formation {
  id: string;
  name: string;
  dancers: Dancer[];
  timestamp: number; // en segundos
}

interface Choreography {
  id: string;
  name: string;
  description: string;
  musicFile: string;
  duration: number; // en segundos
  formations: Formation[];
  students: string[];
  coach: string;
  category: string;
  difficulty: string;
  createdAt: Date;
}

const Choreography: React.FC = () => {
  const [choreographies, setChoreographies] = useState<Choreography[]>([
    {
      id: '1',
      name: 'Hip Hop Fusion',
      description: 'Coreografía moderna de Hip Hop con elementos urbanos',
      musicFile: 'hip-hop-fusion.mp3',
      duration: 180,
      formations: [
        {
          id: 'formation-1',
          name: 'Formación Inicial',
          dancers: [
            { id: 'dancer-1', name: 'Ana García', x: 150, y: 150, z: 0, color: '#FF6B6B', isVisible: true },
            { id: 'dancer-2', name: 'Carlos Rodríguez', x: 300, y: 150, z: 0, color: '#4ECDC4', isVisible: true },
            { id: 'dancer-3', name: 'Laura Martínez', x: 225, y: 250, z: 0, color: '#45B7D1', isVisible: true },
          ],
          timestamp: 0,
        },
        {
          id: 'formation-2',
          name: 'Formación Central',
          dancers: [
            { id: 'dancer-1', name: 'Ana García', x: 225, y: 200, z: 0, color: '#FF6B6B', isVisible: true },
            { id: 'dancer-2', name: 'Carlos Rodríguez', x: 175, y: 300, z: 0, color: '#4ECDC4', isVisible: true },
            { id: 'dancer-3', name: 'Laura Martínez', x: 275, y: 300, z: 0, color: '#45B7D1', isVisible: true },
          ],
          timestamp: 60,
        },
      ],
      students: ['Ana García', 'Carlos Rodríguez', 'Laura Martínez'],
      coach: 'María González',
      category: 'Teens',
      difficulty: 'Intermedio',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Contemporáneo Expressivo',
      description: 'Danza contemporánea con énfasis en expresión corporal',
      musicFile: 'contemporaneo-expressivo.mp3',
      duration: 240,
      formations: [
        {
          id: 'formation-3',
          name: 'Apertura',
          dancers: [
            { id: 'dancer-4', name: 'Sofía López', x: 100, y: 200, z: 0, color: '#96CEB4', isVisible: true },
            { id: 'dancer-5', name: 'Diego Ruiz', x: 250, y: 150, z: 0, color: '#FFEAA7', isVisible: true },
            { id: 'dancer-6', name: 'Carmen Vega', x: 400, y: 200, z: 0, color: '#DDA0DD', isVisible: true },
          ],
          timestamp: 0,
        },
      ],
      students: ['Sofía López', 'Diego Ruiz', 'Carmen Vega'],
      coach: 'Carlos Ruiz',
      category: 'Adultos',
      difficulty: 'Avanzado',
      createdAt: new Date('2024-01-10'),
    },
  ]);

  const [selectedChoreography, setSelectedChoreography] = useState<Choreography | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingChoreography, setEditingChoreography] = useState<Choreography | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentFormation, setCurrentFormation] = useState<Formation | null>(null);
  const [showFormationEditor, setShowFormationEditor] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [timelineMarkers, setTimelineMarkers] = useState<Array<{
    id: string;
    time: number;
    label: string;
    type: 'formation' | 'cue' | 'highlight' | 'note';
    color: string;
    description?: string;
  }>>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [currentFormationFrame, setCurrentFormationFrame] = useState<any>(null);
  const [selectedDancer, setSelectedDancer] = useState<string | undefined>(undefined);
  const [showTutorial, setShowTutorial] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    musicFile: '',
    videoFile: ''
  });
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [selectedMusicId, setSelectedMusicId] = useState<string>('');

  const canvasRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Obtener estudiantes reales del servicio y deduplicar por nombre completo
  const allStudents = studentService.getAllStudents();
  const students = allStudents.filter((student, index, self) => 
    index === self.findIndex(s => s.fullName === student.fullName)
  );
  const categories = ['Mini', 'Teens', 'Adultos', 'High Level'];
  const difficulties = ['Principiante', 'Intermedio', 'Avanzado', 'Experto'];
  const coaches = ['María González', 'Carlos Ruiz', 'Ana Martínez', 'Luis Pérez'];

  const dancerColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  useEffect(() => {
    if (isPlaying && selectedChoreography) {
      const animate = () => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= selectedChoreography.duration) {
            setIsPlaying(false);
            return selectedChoreography.duration;
          }
          return newTime;
        });
        // Solo continuar si aún está reproduciendo
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isPlaying, selectedChoreography?.duration]);

  useEffect(() => {
    if (selectedChoreography && currentTime > 0) {
      const formation = selectedChoreography.formations.find(f => 
        f.timestamp <= currentTime && 
        (!selectedChoreography.formations.find(next => next.timestamp > f.timestamp) || 
         selectedChoreography.formations.find(next => next.timestamp > f.timestamp)!.timestamp > currentTime)
      );
      setCurrentFormation(formation || null);
    }
  }, [currentTime, selectedChoreography]);

  const handleOpenDialog = (choreography?: Choreography) => {
    if (choreography) {
      setEditingChoreography(choreography);
      setSelectedStudents(choreography.students);
    } else {
      setEditingChoreography(null);
      setSelectedStudents([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingChoreography(null);
    setSelectedStudents([]);
    setSelectedVideoId('');
    setSelectedMusicId('');
    setFormData({
      name: '',
      category: '',
      description: '',
      musicFile: '',
      videoFile: ''
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Por favor ingresa un nombre para la coreografía');
      return;
    }

    if (!formData.musicFile) {
      alert('Por favor selecciona un archivo de música');
      return;
    }

    if (selectedStudents.length === 0) {
      alert('Por favor selecciona al menos un estudiante');
      return;
    }

    if (editingChoreography) {
      setChoreographies(choreographies.map(c => 
        c.id === editingChoreography.id 
          ? { 
              ...c, 
              name: formData.name,
              description: formData.description,
              category: formData.category,
              musicFile: formData.musicFile,
              students: selectedStudents 
            }
          : c
      ));
    } else {
      const newChoreography: Choreography = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description || 'Nueva coreografía',
        musicFile: formData.musicFile,
        duration: 180, // Duración por defecto
        formations: [],
        students: selectedStudents,
        coach: 'María González',
        category: formData.category || 'Teens',
        difficulty: 'Intermedio',
        createdAt: new Date(),
      };
      setChoreographies([...choreographies, newChoreography]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setChoreographies(choreographies.filter(c => c.id !== id));
    if (selectedChoreography?.id === id) {
      setSelectedChoreography(null);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSliderTimeChange = (event: Event, newValue: number | number[]) => {
    setCurrentTime(newValue as number);
  };

  const handleStudentToggle = (studentName: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentName) 
        ? prev.filter(s => s !== studentName)
        : [...prev, studentName]
    );
  };

  const handleFormationEdit = (formation?: Formation) => {
    if (formation) {
      setEditingFormation(formation);
    } else {
      const newFormation: Formation = {
        id: Date.now().toString(),
        name: `Formación ${(selectedChoreography?.formations.length || 0) + 1}`,
        dancers: selectedChoreography?.students.map((student, index) => ({
          id: `dancer-${index}`,
          name: student,
          x: 100 + (index % 4) * 150,
          y: 100 + Math.floor(index / 4) * 150,
          z: 0,
          color: dancerColors[index % dancerColors.length],
          isVisible: true,
        })) || [],
        timestamp: currentTime,
      };
      setEditingFormation(newFormation);
    }
    setShowFormationEditor(true);
  };

  const handleFormationSave = () => {
    if (editingFormation && selectedChoreography) {
      const updatedFormations = selectedChoreography.formations.filter(f => f.id !== editingFormation.id);
      const newFormations = [...updatedFormations, editingFormation].sort((a, b) => a.timestamp - b.timestamp);
      
      const updatedChoreography = {
        ...selectedChoreography,
        formations: newFormations,
      };
      
      setChoreographies(choreographies.map(c => 
        c.id === selectedChoreography.id ? updatedChoreography : c
      ));
      setSelectedChoreography(updatedChoreography);
    }
    setShowFormationEditor(false);
    setEditingFormation(null);
  };

  const handleDancerMove = (dancerId: string, x: number, y: number, z?: number) => {
    if (editingFormation) {
      setEditingFormation(prev => prev ? {
        ...prev,
        dancers: prev.dancers.map(d => 
          d.id === dancerId ? { ...d, x, y, z: z ?? d.z } : d
        )
      } : null);
    }
  };

  const handleDancerToggle = (dancerId: string) => {
    if (editingFormation) {
      setEditingFormation(prev => prev ? {
        ...prev,
        dancers: prev.dancers.map(d => 
          d.id === dancerId ? { ...d, isVisible: !d.isVisible } : d
        )
      } : null);
    }
  };

  const getFormationAtTime = (time: number) => {
    if (!selectedChoreography) return null;
    return selectedChoreography.formations.find(f => 
      f.timestamp <= time && 
      (!selectedChoreography.formations.find(next => next.timestamp > f.timestamp) || 
       selectedChoreography.formations.find(next => next.timestamp > f.timestamp)!.timestamp > time)
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Funciones para el Timeline Musical
  const handleMarkerAdd = (marker: any) => {
    setTimelineMarkers(prev => [...prev, marker]);
  };

  const handleMarkerEdit = (marker: any) => {
    setTimelineMarkers(prev => prev.map(m => m.id === marker.id ? marker : m));
  };

  const handleMarkerDelete = (markerId: string) => {
    setTimelineMarkers(prev => prev.filter(m => m.id !== markerId));
  };

  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
  };

  const handlePositionComment = (x: number, y: number, z: number) => {
    // Función para posicionar comentarios en el escenario
    console.log('Comentario posicionado en:', x, y, z);
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      p: 3
    }}>
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 4,
        p: 4,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              🎭 Coreografías
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Crea, edita y sincroniza tus coreografías con música
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<GroupIcon />}
              onClick={() => setShowTutorial(true)}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  borderColor: '#5a6fd8',
                }
              }}
            >
              📚 Tutorial
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                }
              }}
            >
              Nueva Coreografía
            </Button>
          </Box>
        </Box>

        {/* Tabs de Navegación */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ 
              '& .MuiTab-root': { 
                minWidth: 'auto', 
                px: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem'
              }
            }}
          >
                             <Tab label="🎭 Escenario 3D" />
                 <Tab label="🎬 Reproductor 3D" />
                 <Tab label="🎵 Timeline Musical" />
                 <Tab label="💬 Colaboración" />
                 <Tab label="🎥 Análisis de Video" />
                 <Tab label="📋 Lista de Coreografías" />
          </Tabs>
        </Box>

        {/* Contenido según el Tab Activo */}
        {activeTab === 0 && (
          // Tab: Escenario 3D
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              🎭 Escenario 3D - Vista Tridimensional
            </Typography>
            {selectedChoreography ? (
              <Stage3D
                dancers={selectedChoreography.formations[selectedChoreography.formations.length - 1]?.dancers || []}
                onDancerMove={handleDancerMove}
                onDancerSelect={setSelectedDancer}
                selectedDancer={selectedDancer}
                currentFormation={currentFormation?.name}
              />
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Selecciona una coreografía para ver el escenario 3D
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          // Tab: Reproductor 3D
          <Formation3DPlayer 
            onFormationUpdate={(frame) => {
              setCurrentFormationFrame(frame);
              // Actualizar el escenario 3D con la formación actual
              if (frame && frame.dancers) {
                const updatedDancers = frame.dancers.map(dancer => ({
                  id: dancer.id,
                  name: dancer.name,
                  x: dancer.x,
                  y: dancer.y,
                  z: dancer.z,
                  color: dancer.color,
                  isVisible: dancer.isVisible
                }));
                // setDancers(updatedDancers); // TODO: Implementar actualización de bailarines
              }
            }}
          />
        )}

        {activeTab === 2 && (
          // Tab: Timeline Musical
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              🎵 Timeline Musical - Sincronización Avanzada
            </Typography>
            {selectedChoreography ? (
              <MusicTimeline
                duration={selectedChoreography.duration}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onTimeChange={handleTimeChange}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onStop={() => {
                  setIsPlaying(false);
                  setCurrentTime(0);
                }}
                onMarkerAdd={handleMarkerAdd}
                onMarkerEdit={handleMarkerEdit}
                onMarkerDelete={handleMarkerDelete}
                markers={timelineMarkers}
                currentFormation={currentFormation?.name}
              />
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Selecciona una coreografía para ver el timeline musical
                </Typography>
              </Paper>
            )}
          </Box>
        )}

                 {activeTab === 2 && (
           // Tab: Colaboración
           <Box>
             <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
               💬 Colaboración en Tiempo Real
             </Typography>
             {selectedChoreography ? (
               <CollaborationPanel
                 choreographyId={selectedChoreography.id}
                 currentFormation={currentFormation?.name}
                 currentTime={currentTime}
                 onPositionComment={handlePositionComment}
               />
             ) : (
               <Paper sx={{ p: 4, textAlign: 'center' }}>
                 <Typography variant="h6" color="text.secondary">
                   Selecciona una coreografía para acceder a la colaboración
                 </Typography>
               </Paper>
             )}
           </Box>
         )}

         {activeTab === 3 && (
           // Tab: Colaboración
           <Box>
             <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
               💬 Colaboración en Tiempo Real
             </Typography>
             {selectedChoreography ? (
               <CollaborationPanel
                 choreographyId={selectedChoreography.id}
                 currentTime={currentTime}
                 onPositionComment={(comment) => console.log('Comentario de posición:', comment)}
               />
             ) : (
               <Paper sx={{ p: 4, textAlign: 'center' }}>
                 <Typography variant="h6" color="text.secondary">
                   Selecciona una coreografía para acceder a la colaboración
                 </Typography>
               </Paper>
             )}
           </Box>
         )}

         {activeTab === 4 && (
           // Tab: Análisis de Video
           <Box>
             <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
               🎥 Análisis de Video - Coach's Eye Style
             </Typography>
             {selectedChoreography ? (
               <VideoAnalysis
                 choreographyId={selectedChoreography.id}
                 currentTime={currentTime}
                 onTimeChange={handleTimeChange}
                 onSaveAnalysis={(analysis) => console.log('Análisis guardado:', analysis)}
               />
             ) : (
               <Paper sx={{ p: 4, textAlign: 'center' }}>
                 <Typography variant="h6" color="text.secondary">
                   Selecciona una coreografía para acceder al análisis de video
                 </Typography>
               </Paper>
             )}
           </Box>
         )}

                 {activeTab === 5 && (
           // Tab: Lista de Coreografías
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: 'fit-content',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    📋 Mis Coreografías
                  </Typography>
                  <List>
                    {choreographies.map((choreography) => (
                      <ListItem
                        key={choreography.id}
                        button
                        selected={selectedChoreography?.id === choreography.id}
                        onClick={() => setSelectedChoreography(choreography)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          border: selectedChoreography?.id === choreography.id ? '2px solid #667eea' : 'none',
                          background: selectedChoreography?.id === choreography.id ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                        }}
                      >
                        <ListItemText
                          primary={choreography.name}
                          secondary={`${choreography.students.length} estudiantes • ${choreography.difficulty}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small" onClick={() => handleOpenDialog(choreography)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(choreography.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Editor de coreografía */}
            <Grid item xs={12} md={8}>
              {selectedChoreography ? (
                <Box>
                  {/* Header de la coreografía */}
                  <Card sx={{ 
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    borderRadius: 3
                  }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {selectedChoreography.name}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                        {selectedChoreography.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip label={selectedChoreography.category} sx={{ background: 'rgba(255, 255, 255, 0.2)' }} />
                        <Chip label={selectedChoreography.difficulty} sx={{ background: 'rgba(255, 255, 255, 0.2)' }} />
                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                          {formatTime(currentTime)} / {formatTime(selectedChoreography.duration)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Controles de música */}
                  <Card sx={{ mb: 3, borderRadius: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <MusicIcon color="primary" />
                        <Typography variant="h6">Controles de Música</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton
                          onClick={handlePlayPause}
                          sx={{ 
                            background: isPlaying ? '#f44336' : '#4caf50',
                            color: 'white',
                            '&:hover': { background: isPlaying ? '#d32f2f' : '#388e3c' }
                          }}
                        >
                          {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </IconButton>
                        <IconButton
                          onClick={handleStop}
                          sx={{ 
                            background: '#757575',
                            color: 'white',
                            '&:hover': { background: '#616161' }
                          }}
                        >
                          <StopIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                          {formatTime(currentTime)} / {formatTime(selectedChoreography.duration)}
                        </Typography>
                      </Box>

                      <Slider
                        value={currentTime}
                        onChange={handleSliderTimeChange}
                        max={selectedChoreography.duration}
                        step={0.1}
                        sx={{ color: '#667eea' }}
                      />
                    </CardContent>
                  </Card>

                {/* Canvas del escenario */}
                <Card sx={{ mb: 3, borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Escenario</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={() => handleFormationEdit()}
                          sx={{ 
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #E55A8A, #43B5B0)',
                            }
                          }}
                        >
                          Nueva Formación
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<TimelineIcon />}
                          onClick={() => setActiveTab(1)}
                          sx={{ borderRadius: 2 }}
                        >
                          Ver Timeline
                        </Button>
                      </Box>
                    </Box>

                    <Box
                      ref={canvasRef}
                      sx={{
                        width: '100%',
                        height: 500,
                        background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)',
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        border: '2px solid #e0e0e0',
                      }}
                    >
                      {/* Líneas de guía */}
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        pointerEvents: 'none'
                      }} />

                      {/* Bailarines */}
                      <AnimatePresence>
                        {(currentFormation?.dancers || []).map((dancer) => (
                          <Box
                            key={dancer.id}
                            sx={{
                              position: 'absolute',
                              left: dancer.x,
                              top: dancer.y,
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: dancer.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              border: '2px solid white',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            }}
                            onMouseDown={(e) => {
                              if (showFormationEditor) {
                                // Implementar drag and drop aquí
                              }
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                              }}
                            >
                              {dancer.name.split(' ')[0]}
                            </Typography>
                          </Box>
                        ))}
                      </AnimatePresence>
                    </Box>
                  </CardContent>
                </Card>

                {/* Timeline de formaciones */}
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Timeline de Formaciones</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Haz clic para saltar al tiempo de la formación
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedChoreography.formations.map((formation) => (
                        <Chip
                          key={formation.id}
                          label={`${formation.name} (${formatTime(formation.timestamp)})`}
                          onClick={() => setCurrentTime(formation.timestamp)}
                          onDelete={() => handleFormationEdit(formation)}
                          deleteIcon={<EditIcon />}
                          sx={{
                            background: currentTime >= formation.timestamp ? '#667eea' : '#e0e0e0',
                            color: currentTime >= formation.timestamp ? 'white' : 'black',
                            cursor: 'pointer',
                            '&:hover': {
                              background: currentTime >= formation.timestamp ? '#5a6fd8' : '#d0d0d0',
                            },
                            '& .MuiChip-deleteIcon': {
                              color: currentTime >= formation.timestamp ? 'white' : '#666',
                              '&:hover': {
                                color: currentTime >= formation.timestamp ? '#f0f0f0' : '#333',
                              }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Card sx={{ 
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 3
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <GroupIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Selecciona una coreografía para comenzar
                  </Typography>
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>
        )}

        {/* Dialog para crear/editar coreografía */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          disableEnforceFocus
          disableAutoFocus
          disablePortal
        >
          <DialogTitle>
            {editingChoreography ? 'Editar Coreografía' : 'Nueva Coreografía'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre de la Coreografía"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Categoría"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  select
                >
                  {['Mini\'s', 'Teen\'s', 'Adultos', 'High Level'].map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>

              {/* Selección de Música Simulada */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2">🎵 Música de Coreografía</Typography>
                  <TextField
                    fullWidth
                    select
                    value={selectedMusicId}
                    onChange={(e) => {
                      setSelectedMusicId(e.target.value);
                      const selectedMusic = musicService.getMusicTracks().find(m => m.id === e.target.value);
                      if (selectedMusic) {
                        setFormData({ ...formData, musicFile: selectedMusic.title });
                        console.log('🎵 Música seleccionada:', selectedMusic);
                      }
                    }}
                    variant="outlined"
                    placeholder="Seleccionar música..."
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderStyle: 'dashed',
                        '&:hover': { backgroundColor: 'rgba(255, 107, 157, 0.04)' }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Seleccionar música...</em>
                    </MenuItem>
                    {musicService.getMusicTracks().map((music) => (
                      <MenuItem key={music.id} value={music.id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {music.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {music.duration}s • {music.genre} • {music.tempo} BPM
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                  <Typography variant="caption" color="text.secondary">
                    🎶 16 pistas de música simulada con diferentes géneros y tempos
                  </Typography>
                </Box>
              </Grid>

              {/* Selección de Video Simulado */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2">🎥 Video de Formación 3D (Opcional)</Typography>
                  <TextField
                    fullWidth
                    select
                    value={selectedVideoId}
                    onChange={(e) => {
                      setSelectedVideoId(e.target.value);
                      const selectedVideo = videoService.getVideoTracks().find(v => v.id === e.target.value);
                      if (selectedVideo) {
                        setFormData({ ...formData, videoFile: selectedVideo.title });
                        console.log('🎥 Video seleccionado:', selectedVideo);
                      }
                    }}
                    variant="outlined"
                    placeholder="Seleccionar video de formación..."
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderStyle: 'dashed',
                        '&:hover': { backgroundColor: 'rgba(78, 205, 196, 0.04)' }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Seleccionar video de formación...</em>
                    </MenuItem>
                    {videoService.getVideoTracks().map((video) => (
                      <MenuItem key={video.id} value={video.id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {video.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {video.duration}s • {video.type} • {video.resolution}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                  <Typography variant="caption" color="text.secondary">
                    🎬 Videos simulados con formaciones 3D generadas automáticamente
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  👥 Estudiantes Participantes:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 200, overflow: 'auto' }}>
                  {students.map((student) => (
                    <Chip
                      key={student.id}
                      label={student.fullName}
                      onClick={() => handleStudentToggle(student.fullName)}
                      color={selectedStudents.includes(student.fullName) ? 'primary' : 'default'}
                      variant={selectedStudents.includes(student.fullName) ? 'filled' : 'outlined'}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { transform: 'scale(1.05)' },
                        transition: 'transform 0.2s'
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Seleccionados: {selectedStudents.length} estudiantes
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">
              {editingChoreography ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para editar formación */}
        <Dialog 
          open={showFormationEditor} 
          onClose={() => setShowFormationEditor(false)}
          maxWidth="lg" 
          fullWidth
          disableEnforceFocus
          disableAutoFocus
          disablePortal
        >
          <DialogTitle>
            {editingFormation ? 'Editar Formación' : 'Nueva Formación'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Nombre de la Formación"
                    value={editingFormation?.name || ''}
                    onChange={(e) => setEditingFormation(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Tiempo (segundos)"
                    type="number"
                    value={editingFormation?.timestamp || 0}
                    onChange={(e) => setEditingFormation(prev => prev ? { ...prev, timestamp: parseFloat(e.target.value) } : null)}
                  />
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid #e0e0e0',
                  }}
                >
                  {/* Líneas de guía */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    pointerEvents: 'none'
                  }} />

                  {/* Bailarines editables */}
                  {editingFormation?.dancers.map((dancer) => (
                    <Box
                      key={dancer.id}
                      sx={{
                        position: 'absolute',
                        left: dancer.x,
                        top: dancer.y,
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: dancer.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'grab',
                        border: '3px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                      }}
                    >
                                              <Typography
                          variant="caption"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          {dancer.name.split(' ')[0]}
                        </Typography>
                      </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Bailarines</Typography>
                <List>
                  {editingFormation?.dancers.map((dancer) => (
                    <ListItem key={dancer.id}>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        background: dancer.color,
                        mr: 2
                      }} />
                      <ListItemText primary={dancer.name} />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={dancer.isVisible}
                          onChange={() => handleDancerToggle(dancer.id)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowFormationEditor(false)}>Cancelar</Button>
            <Button onClick={handleFormationSave} variant="contained">
              Guardar Formación
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tutorial Guide */}
        <TutorialGuide 
          open={showTutorial} 
          onClose={() => setShowTutorial(false)} 
        />
      </Box>
    </Box>
  );
};

export default Choreography;
