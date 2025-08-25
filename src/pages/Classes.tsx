import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Class as ClassIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  FitnessCenter as CoachIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface ClassType {
  id: string;
  name: string;
  type: string;
  category: string;
  coach: string;
  maxStudents: number;
  currentStudents: number;
  duration: number;
  schedule: string[];
  location: string;
  description: string;
  isActive: boolean;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
  price: number;
}

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<ClassType[]>([
    {
      id: '1',
      name: 'Hip Hop Teens',
      type: 'Hip Hop',
      category: 'Teens',
      coach: 'María González',
      maxStudents: 20,
      currentStudents: 15,
      duration: 90,
      schedule: ['Lunes 16:00', 'Miércoles 16:00'],
      location: 'Sala Principal',
      description: 'Clase de Hip Hop moderna para adolescentes con energía y ritmo urbano.',
      isActive: true,
      difficulty: 'Intermedio',
      price: 45,
    },
    {
      id: '2',
      name: 'Contemporáneo Adultos',
      type: 'Contemporáneo',
      category: 'Adultos',
      coach: 'Carlos Ruiz',
      maxStudents: 15,
      currentStudents: 12,
      duration: 90,
      schedule: ['Martes 18:00', 'Jueves 18:00'],
      location: 'Sala 2',
      description: 'Expresión corporal y danza contemporánea para adultos con técnicas avanzadas.',
      isActive: true,
      difficulty: 'Avanzado',
      price: 50,
    },
    {
      id: '3',
      name: 'Ragga Mini',
      type: 'Ragga',
      category: 'Mini',
      coach: 'Ana Martínez',
      maxStudents: 12,
      currentStudents: 8,
      duration: 60,
      schedule: ['Lunes 15:00', 'Viernes 15:00'],
      location: 'Sala Pequeña',
      description: 'Introducción al Ragga para niños pequeños con movimientos divertidos y ritmos caribeños.',
      isActive: true,
      difficulty: 'Principiante',
      price: 35,
    },
    {
      id: '4',
      name: 'Jazz High Level',
      type: 'Jazz',
      category: 'High Level',
      coach: 'Luis Pérez',
      maxStudents: 10,
      currentStudents: 8,
      duration: 120,
      schedule: ['Sábado 10:00'],
      location: 'Sala Principal',
      description: 'Jazz avanzado para bailarines experimentados con coreografías complejas.',
      isActive: true,
      difficulty: 'Experto',
      price: 60,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassType | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    coach: '',
    maxStudents: 20,
    duration: 90,
    schedule: [] as string[],
    location: '',
    description: '',
    difficulty: 'Principiante' as 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto',
    price: 0,
  });

  const classTypes = ['Hip Hop', 'Contemporáneo', 'Ragga', 'Jazz', 'Ballet', 'Urban Dance'];
  const categories = ['Mini', 'Teens', 'Adultos', 'High Level'];
  const coaches = ['María González', 'Carlos Ruiz', 'Ana Martínez', 'Luis Pérez'];
  const difficulties = ['Principiante', 'Intermedio', 'Avanzado', 'Experto'];
  const scheduleOptions = [
    'Lunes 15:00', 'Lunes 16:00', 'Lunes 17:00', 'Lunes 18:00',
    'Martes 15:00', 'Martes 16:00', 'Martes 17:00', 'Martes 18:00',
    'Miércoles 15:00', 'Miércoles 16:00', 'Miércoles 17:00', 'Miércoles 18:00',
    'Jueves 15:00', 'Jueves 16:00', 'Jueves 17:00', 'Jueves 18:00',
    'Viernes 15:00', 'Viernes 16:00', 'Viernes 17:00', 'Viernes 18:00',
    'Sábado 10:00', 'Sábado 11:00', 'Sábado 12:00',
  ];

  const handleOpenDialog = (classItem?: ClassType) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        name: classItem.name,
        type: classItem.type,
        category: classItem.category,
        coach: classItem.coach,
        maxStudents: classItem.maxStudents,
        duration: classItem.duration,
        schedule: classItem.schedule,
        location: classItem.location,
        description: classItem.description,
        difficulty: classItem.difficulty,
        price: classItem.price,
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        type: '',
        category: '',
        coach: '',
        maxStudents: 20,
        duration: 90,
        schedule: [],
        location: '',
        description: '',
        difficulty: 'Principiante',
        price: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClass(null);
  };

  const handleSave = () => {
    if (editingClass) {
      setClasses(classes.map(c => 
        c.id === editingClass.id 
          ? { ...c, ...formData }
          : c
      ));
    } else {
      const newClass: ClassType = {
        id: Date.now().toString(),
        ...formData,
        currentStudents: 0,
        isActive: true,
      };
      setClasses([...classes, newClass]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setClasses(classes.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleScheduleToggle = (schedule: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.includes(schedule)
        ? prev.schedule.filter(s => s !== schedule)
        : [...prev.schedule, schedule]
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Hip Hop': '#1976d2',
      'Contemporáneo': '#dc004e',
      'Ragga': '#ff9800',
      'Jazz': '#9c27b0',
      'Ballet': '#4caf50',
      'Urban Dance': '#795548',
    };
    return colors[type] || '#757575';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Mini': '#ff9800',
      'Teens': '#2196f3',
      'Adultos': '#4caf50',
      'High Level': '#9c27b0',
    };
    return colors[category] || '#757575';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Principiante': '#4caf50',
      'Intermedio': '#ff9800',
      'Avanzado': '#f44336',
      'Experto': '#9c27b0',
    };
    return colors[difficulty] || '#757575';
  };

  const filteredClasses = classes.filter(classItem => {
    if (selectedTab === 0) return true;
    if (selectedTab === 1) return classItem.type === 'Hip Hop';
    if (selectedTab === 2) return classItem.type === 'Contemporáneo';
    if (selectedTab === 3) return classItem.type === 'Ragga';
    if (selectedTab === 4) return classItem.type === 'Jazz';
    if (selectedTab === 5) return classItem.type === 'Ballet';
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Clases
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Clase
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {classes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Clases
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {classes.filter(c => c.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {classes.reduce((acc, c) => acc + c.currentStudents, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estudiantes Inscritos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {classes.reduce((acc, c) => acc + c.maxStudents, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capacidad Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs por tipo de clase */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ px: 2 }}>
          <Tab label="Todas" />
          <Tab label="Hip Hop" />
          <Tab label="Contemporáneo" />
          <Tab label="Ragga" />
          <Tab label="Jazz" />
          <Tab label="Ballet" />
        </Tabs>
      </Card>

      {/* Lista de clases */}
      <Grid container spacing={3}>
        {filteredClasses.map((classItem) => (
          <Grid item xs={12} md={6} lg={4} key={classItem.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {classItem.name}
                  </Typography>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={classItem.isActive}
                          onChange={() => handleToggleActive(classItem.id)}
                          size="small"
                        />
                      }
                      label=""
                    />
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleOpenDialog(classItem)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDelete(classItem.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={classItem.type}
                    size="small"
                    sx={{ 
                      mr: 1, 
                      backgroundColor: getTypeColor(classItem.type), 
                      color: 'white' 
                    }}
                  />
                  <Chip
                    label={classItem.category}
                    size="small"
                    sx={{ 
                      mr: 1, 
                      backgroundColor: getCategoryColor(classItem.category), 
                      color: 'white' 
                    }}
                  />
                  <Chip
                    label={classItem.difficulty}
                    size="small"
                    sx={{ 
                      backgroundColor: getDifficultyColor(classItem.difficulty), 
                      color: 'white' 
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {classItem.description}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CoachIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.coach}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.duration} min
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.location}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PeopleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.currentStudents}/{classItem.maxStudents} estudiantes
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', backgroundColor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        width: `${(classItem.currentStudents / classItem.maxStudents) * 100}%`,
                        height: 8,
                        backgroundColor: 'primary.main',
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Horarios:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {classItem.schedule.map((schedule, index) => (
                      <Chip
                        key={index}
                        label={schedule}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    €{classItem.price}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    por mes
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para crear/editar clase */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingClass ? 'Editar Clase' : 'Nueva Clase'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Clase"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Clase</InputLabel>
                <Select
                  value={formData.type}
                  label="Tipo de Clase"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {classTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.category}
                  label="Categoría"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Coach</InputLabel>
                <Select
                  value={formData.coach}
                  label="Coach"
                  onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                >
                  {coaches.map((coach) => (
                    <MenuItem key={coach} value={coach}>{coach}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Dificultad</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Dificultad"
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                >
                  {difficulties.map((difficulty) => (
                    <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Máximo de Estudiantes"
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 1, max: 50 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Duración (minutos)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 30, max: 180, step: 15 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Precio (€/mes)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                InputProps={{ inputProps: { min: 0, step: 5 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ubicación"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
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
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Horarios Disponibles:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {scheduleOptions.map((schedule) => (
                  <Chip
                    key={schedule}
                    label={schedule}
                    onClick={() => handleScheduleToggle(schedule)}
                    color={formData.schedule.includes(schedule) ? 'primary' : 'default'}
                    variant={formData.schedule.includes(schedule) ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {editingClass ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Classes;
