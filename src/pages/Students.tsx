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
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  FitnessCenter as DanceIcon,
  CalendarToday as CalendarIcon,
  FitnessCenter,
  CalendarToday,
} from '@mui/icons-material';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  category: string;
  level: string;
  classes: string[];
  coach: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'graduated';
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@email.com',
      phone: '+34 600 123 456',
      age: 16,
      category: 'Teens',
      level: 'Intermedio',
      classes: ['Hip Hop Teens', 'Contemporáneo Teens'],
      coach: 'María González',
      joinDate: new Date('2023-01-15'),
      status: 'active',
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+34 600 234 567',
      age: 14,
      category: 'Teens',
      level: 'Principiante',
      classes: ['Hip Hop Teens'],
      coach: 'María González',
      joinDate: new Date('2023-03-20'),
      status: 'active',
    },
    {
      id: '3',
      name: 'Laura Martínez',
      email: 'laura.martinez@email.com',
      phone: '+34 600 345 678',
      age: 25,
      category: 'Adultos',
      level: 'Avanzado',
      classes: ['Contemporáneo Adultos', 'Jazz Adultos'],
      coach: 'Carlos Ruiz',
      joinDate: new Date('2022-09-10'),
      status: 'active',
    },
    {
      id: '4',
      name: 'Miguel López',
      email: 'miguel.lopez@email.com',
      phone: '+34 600 456 789',
      age: 8,
      category: 'Mini',
      level: 'Principiante',
      classes: ['Ragga Mini'],
      coach: 'Ana Martínez',
      joinDate: new Date('2023-02-05'),
      status: 'active',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: 0,
    category: '',
    level: '',
    coach: '',
  });

  const categories = ['Mini', 'Teens', 'Adultos', 'High Level'];
  const levels = ['Principiante', 'Intermedio', 'Avanzado', 'Experto'];
  const coaches = ['María González', 'Carlos Ruiz', 'Ana Martínez', 'Luis Pérez'];

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        category: student.category,
        level: student.level,
        coach: student.coach,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: 0,
        category: '',
        level: '',
        coach: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleSave = () => {
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...formData }
          : s
      ));
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        ...formData,
        classes: [],
        joinDate: new Date(),
        status: 'active',
      };
      setStudents([...students, newStudent]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'success',
      'inactive': 'warning',
      'graduated': 'info',
    };
    return colors[status] || 'default';
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

  const filteredStudents = students.filter(student => {
    if (selectedTab === 0) return true;
    if (selectedTab === 1) return student.category === 'Mini';
    if (selectedTab === 2) return student.category === 'Teens';
    if (selectedTab === 3) return student.category === 'Adultos';
    if (selectedTab === 4) return student.category === 'High Level';
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Estudiantes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Estudiante
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {students.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Estudiantes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {students.filter(s => s.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {students.filter(s => s.category === 'Teens').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teens
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {students.filter(s => s.category === 'Adultos').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adultos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs por categoría */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ px: 2 }}>
          <Tab label="Todos" />
          <Tab label="Mini" />
          <Tab label="Teens" />
          <Tab label="Adultos" />
          <Tab label="High Level" />
        </Tabs>
      </Card>

      {/* Lista de estudiantes */}
      <Grid container spacing={3}>
        {filteredStudents.map((student) => (
          <Grid item xs={12} md={6} lg={4} key={student.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {student.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleOpenDialog(student)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDelete(student.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={student.category}
                    size="small"
                    sx={{ 
                      mr: 1, 
                      backgroundColor: getCategoryColor(student.category), 
                      color: 'white' 
                    }}
                  />
                  <Chip
                    label={student.level}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={student.status}
                    size="small"
                    color={getStatusColor(student.status) as any}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {student.age} años
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FitnessCenter sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Coach: {student.coach}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Inscrito: {student.joinDate.toLocaleDateString('es-ES')}
                    </Typography>
                  </Box>
                </Box>

                {student.classes.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Clases inscritas:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {student.classes.map((className, index) => (
                        <Chip
                          key={index}
                          label={className}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para crear/editar estudiante */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Edad"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 1, max: 100 } }}
              />
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
                <InputLabel>Nivel</InputLabel>
                <Select
                  value={formData.level}
                  label="Nivel"
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  {levels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {editingStudent ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students;
