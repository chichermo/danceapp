import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Drawer,
  AppBar,
  Toolbar,
  Container
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  VolumeUp as VolumeIcon,
  Timeline as TimelineIcon,
  Palette as PaletteIcon,
  Brush as BrushIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  Straighten as LineIcon,
  ArrowForward as ArrowIcon,
  PhotoCamera as CameraIcon,
  Mic as MicIcon,
  AttachFile as AttachIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  Note as NoteIcon,
  MusicNote as MusicNoteIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Sync as SyncIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Flip as FlipIcon,
  Crop as CropIcon,
  Transform as TransformIcon,
  Layers as LayersIcon,
  Visibility as LayersVisibilityIcon,
  VisibilityOff as LayersVisibilityOffIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  ContentCopy as CopyIcon,
  ContentCut as CutIcon,
  ContentPaste as PasteIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import persistenceService from '../services/PersistenceService';

interface DanceNote {
  id: string;
  title: string;
  danceStyle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
  content: string;
  formations: Formation[];
  timeline: TimelineEvent[];
  attachments: Attachment[];
  tags: string[];
  isPublic: boolean;
  isBookmarked: boolean;
  rating: number;
  practiceCount: number;
  lastPracticed: Date | null;
  instructor: string;
  students: string[];
  objectives: string[];
  notes: string;
  musicTrack?: string;
  videoUrl?: string;
}

interface Formation {
  id: string;
  name: string;
  timestamp: number; // in seconds
  dancers: DancerPosition[];
  notes: string;
  image?: string;
}

interface DancerPosition {
  id: string;
  x: number; // percentage of stage width
  y: number; // percentage of stage height
  rotation: number; // degrees
  color: string;
  label?: string;
  isLeader: boolean;
}

interface TimelineEvent {
  id: string;
  timestamp: number;
  type: 'note' | 'formation' | 'music' | 'cue' | 'break';
  content: string;
  color: string;
  icon: string;
}

interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  name: string;
  url: string;
  timestamp?: number;
  size: number;
  uploadedAt: Date;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notebook-tabpanel-${index}`}
      aria-labelledby={`notebook-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DanceNotebook: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [notes, setNotes] = useState<DanceNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<DanceNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser' | 'circle' | 'line' | 'arrow'>('pen');
  const [drawingColor, setDrawingColor] = useState('#6366F1');
  const [drawingSize, setDrawingSize] = useState(3);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [currentFormation, setCurrentFormation] = useState<Formation | null>(null);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showFormationEditor, setShowFormationEditor] = useState(false);
  const [showTimelineEditor, setShowTimelineEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStyle, setFilterStyle] = useState('All');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSidebar, setShowSidebar] = useState(true);
  const persistenceServiceInstance = persistenceService;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load notes from persistence
  useEffect(() => {
    const savedNotes = persistenceServiceInstance.loadNotes();
    if (savedNotes.length > 0) {
      setNotes(savedNotes);
    } else {
      // Create sample notes
      const sampleNotes: DanceNote[] = [
        {
          id: '1',
          title: 'Contemporary Fusion Routine',
          danceStyle: 'Contemporary',
          difficulty: 'Intermediate',
          duration: 180,
          createdAt: new Date(),
          updatedAt: new Date(),
          content: 'A beautiful contemporary piece combining fluid movements with sharp accents...',
          formations: [
            {
              id: 'f1',
              name: 'Opening Circle',
              timestamp: 0,
              dancers: [
                { id: 'd1', x: 50, y: 50, rotation: 0, color: '#6366F1', isLeader: true, label: 'Leader' },
                { id: 'd2', x: 40, y: 40, rotation: 0, color: '#EC4899', isLeader: false },
                { id: 'd3', x: 60, y: 40, rotation: 0, color: '#10B981', isLeader: false },
                { id: 'd4', x: 40, y: 60, rotation: 0, color: '#F59E0B', isLeader: false },
                { id: 'd5', x: 60, y: 60, rotation: 0, color: '#EF4444', isLeader: false }
              ],
              notes: 'Start in a tight circle, all facing center'
            }
          ],
          timeline: [
            { id: 't1', timestamp: 0, type: 'cue', content: 'Start music', color: '#6366F1', icon: '🎵' },
            { id: 't2', timestamp: 30, type: 'formation', content: 'Move to line formation', color: '#EC4899', icon: '👥' },
            { id: 't3', timestamp: 60, type: 'note', content: 'Focus on fluid arm movements', color: '#10B981', icon: '💫' },
            { id: 't4', timestamp: 120, type: 'break', content: 'Hold position for 8 counts', color: '#F59E0B', icon: '⏸️' },
            { id: 't5', timestamp: 150, type: 'cue', content: 'Final pose', color: '#EF4444', icon: '🎭' }
          ],
          attachments: [],
          tags: ['contemporary', 'fusion', 'intermediate'],
          isPublic: false,
          isBookmarked: true,
          rating: 4,
          practiceCount: 12,
          lastPracticed: new Date(),
          instructor: 'Liesbeth Kreps',
          students: ['Emma', 'Sophie', 'Lucas', 'Maya'],
          objectives: ['Improve fluidity', 'Work on transitions', 'Perfect final pose'],
          notes: 'Great progress on the opening sequence. Need to work on the transition at 1:30.',
          musicTrack: 'Contemporary Fusion Mix'
        }
      ];
      setNotes(sampleNotes);
      persistenceServiceInstance.saveNotes(sampleNotes);
    }
  }, [persistenceServiceInstance]);

  // Save notes to persistence
  useEffect(() => {
    if (notes.length > 0) {
      persistenceServiceInstance.saveNotes(notes);
    }
  }, [notes, persistenceServiceInstance]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCreateNote = () => {
    const newNote: DanceNote = {
      id: Date.now().toString(),
      title: 'New Dance Note',
      danceStyle: 'Contemporary',
      difficulty: 'Beginner',
      duration: 120,
      createdAt: new Date(),
      updatedAt: new Date(),
      content: '',
      formations: [],
      timeline: [],
      attachments: [],
      tags: [],
      isPublic: false,
      isBookmarked: false,
      rating: 0,
      practiceCount: 0,
      lastPracticed: null,
      instructor: '',
      students: [],
      objectives: [],
      notes: ''
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      const updatedNote = { ...selectedNote, updatedAt: new Date() };
      setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note));
      setSelectedNote(updatedNote);
      setIsEditing(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const handleToggleBookmark = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, isBookmarked: !note.isBookmarked }
        : note
    ));
  };

  const handleAddFormation = () => {
    if (selectedNote) {
      const newFormation: Formation = {
        id: Date.now().toString(),
        name: `Formation ${selectedNote.formations.length + 1}`,
        timestamp: timelinePosition,
        dancers: [],
        notes: ''
      };
      const updatedNote = {
        ...selectedNote,
        formations: [...selectedNote.formations, newFormation]
      };
      setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note));
      setSelectedNote(updatedNote);
      setCurrentFormation(newFormation);
      setShowFormationEditor(true);
    }
  };

  const handleAddTimelineEvent = () => {
    if (selectedNote) {
      const newEvent: TimelineEvent = {
        id: Date.now().toString(),
        timestamp: timelinePosition,
        type: 'note',
        content: '',
        color: '#6366F1',
        icon: '📝'
      };
      const updatedNote = {
        ...selectedNote,
        timeline: [...selectedNote.timeline, newEvent].sort((a, b) => a.timestamp - b.timestamp)
      };
      setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note));
      setSelectedNote(updatedNote);
      setShowTimelineEditor(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimelineSeek = (event: Event, newValue: number | number[]) => {
    setTimelinePosition(newValue as number);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStyle = filterStyle === 'All' || note.danceStyle === filterStyle;
    return matchesSearch && matchesStyle;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'createdAt':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'updatedAt':
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'practiceCount':
        return b.practiceCount - a.practiceCount;
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Dance Studio Notebook
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Your personal dance documentation and creation workspace
          </Typography>
        </Box>

        {/* Toolbar */}
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)', backdropFilter: 'blur(20px)' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search notes, formations, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Style</InputLabel>
                  <Select
                    value={filterStyle}
                    onChange={(e) => setFilterStyle(e.target.value)}
                    label="Style"
                  >
                    <MenuItem value="All">All Styles</MenuItem>
                    <MenuItem value="Contemporary">Contemporary</MenuItem>
                    <MenuItem value="Hip Hop">Hip Hop</MenuItem>
                    <MenuItem value="Ballet">Ballet</MenuItem>
                    <MenuItem value="Jazz">Jazz</MenuItem>
                    <MenuItem value="Salsa">Salsa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="updatedAt">Last Updated</MenuItem>
                    <MenuItem value="createdAt">Date Created</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="practiceCount">Practice Count</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? 'List View' : 'Grid View'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNote}
                    sx={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                      }
                    }}
                  >
                    New Note
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Notes List */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '70vh', overflow: 'auto' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Your Notes ({sortedNotes.length})
                </Typography>
                <List>
                  {sortedNotes.map((note, index) => (
                    <motion.div key={note.id} variants={itemVariants}>
                      <ListItem
                        button
                        selected={selectedNote?.id === note.id}
                        onClick={() => setSelectedNote(note)}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          background: selectedNote?.id === note.id 
                            ? 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)'
                            : 'transparent',
                          border: selectedNote?.id === note.id 
                            ? '1px solid rgba(99,102,241,0.3)'
                            : '1px solid transparent',
                          '&:hover': {
                            background: 'rgba(99, 102, 241, 0.05)',
                            transform: 'translateY(-1px)',
                            transition: 'all 0.2s ease-in-out'
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              background: `linear-gradient(135deg, ${note.danceStyle === 'Contemporary' ? '#4ECDC4' : 
                                note.danceStyle === 'Hip Hop' ? '#FF6B9D' : 
                                note.danceStyle === 'Ballet' ? '#45B7D1' : '#96CEB4'}, #6366F1)`,
                              width: 40,
                              height: 40
                            }}
                          >
                            <NoteIcon />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {note.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {note.isBookmarked && <BookmarkIcon sx={{ color: '#F59E0B', fontSize: 16 }} />}
                                <Chip
                                  label={note.danceStyle}
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {note.instructor && `Instructor: ${note.instructor}`}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {note.practiceCount} practices
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      sx={{
                                        fontSize: 12,
                                        color: i < note.rating ? '#F59E0B' : '#E5E7EB'
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Note Editor */}
          <Grid item xs={12} md={8}>
            {selectedNote ? (
              <Card sx={{ height: '70vh' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Note Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {selectedNote.title}
                      </Typography>
                      <Chip
                        label={selectedNote.difficulty}
                        color={selectedNote.difficulty === 'Expert' ? 'error' : 
                               selectedNote.difficulty === 'Advanced' ? 'warning' : 
                               selectedNote.difficulty === 'Intermediate' ? 'info' : 'success'}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleToggleBookmark(selectedNote.id)}>
                        {selectedNote.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                      <IconButton onClick={() => setIsEditing(!isEditing)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteNote(selectedNote.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={selectedTab} onChange={handleTabChange}>
                      <Tab label="Overview" />
                      <Tab label="Formations" />
                      <Tab label="Timeline" />
                      <Tab label="Notes" />
                      <Tab label="Attachments" />
                    </Tabs>
                  </Box>

                  {/* Tab Content */}
                  <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <TabPanel value={selectedTab} index={0}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                              label="Title"
                              value={selectedNote.title}
                              onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
                              disabled={!isEditing}
                            />
                            <TextField
                              label="Instructor"
                              value={selectedNote.instructor}
                              onChange={(e) => setSelectedNote({...selectedNote, instructor: e.target.value})}
                              disabled={!isEditing}
                            />
                            <TextField
                              label="Duration (seconds)"
                              type="number"
                              value={selectedNote.duration}
                              onChange={(e) => setSelectedNote({...selectedNote, duration: parseInt(e.target.value)})}
                              disabled={!isEditing}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 2 }}>Statistics</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography>Practice Count:</Typography>
                              <Typography fontWeight={600}>{selectedNote.practiceCount}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography>Rating:</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    sx={{
                                      color: i < selectedNote.rating ? '#F59E0B' : '#E5E7EB'
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography>Last Practiced:</Typography>
                              <Typography>
                                {selectedNote.lastPracticed 
                                  ? selectedNote.lastPracticed.toLocaleDateString()
                                  : 'Never'
                                }
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </TabPanel>

                    <TabPanel value={selectedTab} index={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Formations ({selectedNote.formations.length})</Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddFormation}
                          sx={{
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                            }
                          }}
                        >
                          Add Formation
                        </Button>
                      </Box>
                      <Grid container spacing={2}>
                        {selectedNote.formations.map((formation) => (
                          <Grid item xs={12} md={6} key={formation.id}>
                            <Card sx={{ 
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0px 8px 25px rgba(0,0,0,0.15)',
                              }
                            }}>
                              <CardContent>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                  {formation.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {formation.timestamp}s - {formation.dancers.length} dancers
                                </Typography>
                                <Typography variant="body2">
                                  {formation.notes}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </TabPanel>

                    <TabPanel value={selectedTab} index={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Timeline ({selectedNote.timeline.length})</Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddTimelineEvent}
                          sx={{
                            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                            }
                          }}
                        >
                          Add Event
                        </Button>
                      </Box>
                      
                      {/* Timeline Player */}
                      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <IconButton onClick={handlePlayPause}>
                              {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </IconButton>
                            <Typography variant="body2" color="text.secondary">
                              {Math.floor(timelinePosition / 60)}:{(timelinePosition % 60).toString().padStart(2, '0')}
                            </Typography>
                            <Box sx={{ flexGrow: 1 }}>
                              <Slider
                                value={timelinePosition}
                                onChange={handleTimelineSeek}
                                max={selectedNote.duration}
                                sx={{
                                  '& .MuiSlider-thumb': {
                                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                  },
                                  '& .MuiSlider-track': {
                                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                  }
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {Math.floor(selectedNote.duration / 60)}:{(selectedNote.duration % 60).toString().padStart(2, '0')}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>

                      {/* Timeline Events */}
                      <List>
                        {selectedNote.timeline.map((event) => (
                          <ListItem key={event.id} sx={{ 
                            borderRadius: 2, 
                            mb: 1,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                            }
                          }}>
                            <ListItemIcon>
                              <Avatar sx={{ background: event.color, width: 32, height: 32 }}>
                                <Typography sx={{ fontSize: '0.8rem' }}>{event.icon}</Typography>
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {event.content}
                                  </Typography>
                                  <Chip
                                    label={`${event.timestamp}s`}
                                    size="small"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                  />
                                </Box>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                  {event.type} event
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </TabPanel>

                    <TabPanel value={selectedTab} index={3}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Notes & Objectives</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={8}
                        label="Practice Notes"
                        value={selectedNote.notes}
                        onChange={(e) => setSelectedNote({...selectedNote, notes: e.target.value})}
                        disabled={!isEditing}
                        sx={{ mb: 3 }}
                      />
                      <Typography variant="h6" sx={{ mb: 2 }}>Objectives</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedNote.objectives.map((objective, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                            <Typography>{objective}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </TabPanel>

                    <TabPanel value={selectedTab} index={4}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Attachments ({selectedNote.attachments.length})</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ mb: 2 }}
                      >
                        Upload File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          // Handle file upload
                          console.log('Files selected:', e.target.files);
                        }}
                      />
                      <Grid container spacing={2}>
                        {selectedNote.attachments.map((attachment) => (
                          <Grid item xs={12} md={6} key={attachment.id}>
                            <Card>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Avatar>
                                    {attachment.type === 'image' ? <CameraIcon /> :
                                     attachment.type === 'video' ? <PlayIcon /> :
                                     attachment.type === 'audio' ? <MicIcon /> : <AttachIcon />}
                                  </Avatar>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle2">{attachment.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {attachment.type} • {(attachment.size / 1024).toFixed(1)} KB
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </TabPanel>
                  </Box>

                  {/* Action Buttons */}
                  {isEditing && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveNote}
                        sx={{
                          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                          }
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <NoteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No note selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Choose a note from the list or create a new one to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNote}
                    sx={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                      }
                    }}
                  >
                    Create New Note
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              transform: 'scale(1.1)',
            }
          }}
          onClick={handleCreateNote}
        >
          <AddIcon />
        </Fab>
      </motion.div>
    </Container>
  );
};

export default DanceNotebook;
