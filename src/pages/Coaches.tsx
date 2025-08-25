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
  Rating,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  FitnessCenter as DanceIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  FitnessCenter,
} from '@mui/icons-material';

interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  experience: number;
  rating: number;
  totalStudents: number;
  activeClasses: number;
  bio: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'on_leave';
  photo: string;
}

const Coaches: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([
    {
      id: '1',
      name: 'María González',
      email: 'maria.gonzalez@heliopsis.com',
      phone: '+34 600 111 222',
      specialties: ['Hip Hop', 'Urban Dance', 'Teens'],
      experience: 8,
      rating: 4.8,
      totalStudents: 45,
      activeClasses: 12,
      bio: 'Especialista en Hip Hop y danza urbana con más de 8 años de experiencia. Apasionada por enseñar a jóvenes bailarines.',
      joinDate: new Date('2020-03-15'),
      status: 'active',
      photo: '',
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@heliopsis.com',
      phone: '+34 600 222 333',
      specialties: ['Contemporáneo', 'Jazz', 'Adultos'],
      experience: 12,
      rating: 4.9,
      totalStudents: 38,
      activeClasses: 8,
      bio: 'Bailarín profesional con formación en danza contemporánea. Especializado en técnicas avanzadas para adultos.',
      joinDate: new Date('2019-09-01'),
      status: 'active',
      photo: '',
    },
    {
      id: '3',
      name: 'Ana Martínez',
      email: 'ana.martinez@heliopsis.com',
      phone: '+34 600 333 444',
      specialties: ['Ragga', 'Mini', 'Principiantes'],
      experience: 5,
      rating: 4.7,
      totalStudents: 32,
      activeClasses: 10,
      bio: 'Especialista en danza Ragga y trabajo con niños pequeños. Metodología adaptada para principiantes.',
      joinDate: new Date('2021-01-10'),
      status: 'active',
      photo: '',
    },
    {
      id: '4',
      name: 'Luis Pérez',
      email: 'luis.perez@heliopsis.com',
      phone: '+34 600 444 555',
      specialties: ['Ballet', 'High Level', 'Técnica'],
      experience: 15,
      rating: 5.0,
      totalStudents: 28,
      activeClasses: 6,
      bio: 'Maestro de ballet clásico con amplia experiencia en formación técnica avanzada y competiciones.',
      joinDate: new Date('2018-06-01'),
      status: 'active',
      photo: '',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    experience: 0,
    bio: '',
  });

  const allSpecialties = ['Hip Hop', 'Contemporáneo', 'Ragga', 'Jazz', 'Ballet', 'Urban Dance', 'Teens', 'Mini', 'Adultos', 'High Level', 'Principiantes', 'Técnica'];

  const handleOpenDialog = (coach?: Coach) => {
    if (coach) {
      setEditingCoach(coach);
      setFormData({
        name: coach.name,
        email: coach.email,
        phone: coach.phone,
        specialties: coach.specialties,
        experience: coach.experience,
        bio: coach.bio,
      });
    } else {
      setEditingCoach(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialties: [],
        experience: 0,
        bio: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCoach(null);
  };

  const handleSave = () => {
    if (editingCoach) {
      setCoaches(coaches.map(c => 
        c.id === editingCoach.id 
          ? { ...c, ...formData }
          : c
      ));
    } else {
      const newCoach: Coach = {
        id: Date.now().toString(),
        ...formData,
        rating: 0,
        totalStudents: 0,
        activeClasses: 0,
        joinDate: new Date(),
        status: 'active',
        photo: '',
      };
      setCoaches([...coaches, newCoach]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setCoaches(coaches.filter(c => c.id !== id));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'success',
      'inactive': 'warning',
      'on_leave': 'info',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'on_leave': 'De Permiso',
    };
    return texts[status] || status;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Coaches
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Coach
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {coaches.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Coaches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {coaches.filter(c => c.status === 'active').length}
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
                {coaches.reduce((acc, c) => acc + c.totalStudents, 0)}
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
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {coaches.reduce((acc, c) => acc + c.activeClasses, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Clases Activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de coaches */}
      <Grid container spacing={3}>
        {coaches.map((coach) => (
          <Grid item xs={12} md={6} key={coach.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 60, height: 60 }}>
                      {coach.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {coach.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={coach.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {coach.rating} ({coach.totalStudents} estudiantes)
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusText(coach.status)}
                        size="small"
                        color={getStatusColor(coach.status) as any}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => handleOpenDialog(coach)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDelete(coach.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {coach.bio}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Especialidades:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {coach.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        variant="outlined"
                        sx={{ backgroundColor: 'primary.light', color: 'white' }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SchoolIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {coach.experience} años exp.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FitnessCenter sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {coach.activeClasses} clases
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {coach.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {coach.phone}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Miembro desde: {coach.joinDate.toLocaleDateString('es-ES')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para crear/editar coach */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCoach ? 'Editar Coach' : 'Nuevo Coach'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Años de Experiencia"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 0, max: 50 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biografía"
                multiline
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe la experiencia, formación y especialidades del coach..."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Especialidades:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {allSpecialties.map((specialty) => (
                  <Chip
                    key={specialty}
                    label={specialty}
                    onClick={() => handleSpecialtyToggle(specialty)}
                    color={formData.specialties.includes(specialty) ? 'primary' : 'default'}
                    variant={formData.specialties.includes(specialty) ? 'filled' : 'outlined'}
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
            {editingCoach ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Coaches;
