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
      name: 'Maria Gonzalez',
      email: 'maria.gonzalez@heliopsis.com',
      phone: '+34 600 111 222',
      specialties: ['Hip Hop', 'Urban Dance', 'Teens'],
      experience: 8,
      rating: 4.8,
      totalStudents: 45,
      activeClasses: 12,
      bio: 'Hip Hop and urban dance specialist with over 8 years of experience. Passionate about teaching young dancers.',
      joinDate: new Date('2020-03-15'),
      status: 'active',
      photo: '',
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@heliopsis.com',
      phone: '+34 600 222 333',
      specialties: ['Contemporary', 'Jazz', 'Adults'],
      experience: 12,
      rating: 4.9,
      totalStudents: 38,
      activeClasses: 8,
      bio: 'Professional dancer with training in contemporary dance. Specialized in advanced techniques for adults.',
      joinDate: new Date('2019-09-01'),
      status: 'active',
      photo: '',
    },
    {
      id: '3',
      name: 'Ana Martinez',
      email: 'ana.martinez@heliopsis.com',
      phone: '+34 600 333 444',
      specialties: ['Ragga', 'Mini', 'Beginners'],
      experience: 5,
      rating: 4.7,
      totalStudents: 32,
      activeClasses: 10,
      bio: 'Ragga dance specialist and work with small children. Methodology adapted for beginners.',
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
              bio: 'Classical ballet master with extensive experience in advanced technical training and competitions.',
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

  const allSpecialties = ['Hip Hop', 'Contemporary', 'Ragga', 'Jazz', 'Ballet', 'Urban Dance', 'Teens', 'Mini', 'Adults', 'High Level', 'Beginners', 'Technique'];

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
              'active': 'Active',
        'inactive': 'Inactive',
      'on_leave': 'De Permiso',
    };
    return texts[status] || status;
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Enhanced Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          🎯 Coach Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Manage your dance academy instructors and their profiles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track performance, manage schedules, and monitor coach development
        </Typography>
      </Box>

      {/* Enhanced Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -20,
              right: -20,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {coaches.length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.9 }}>
                Total Coaches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -20,
              right: -20,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {coaches.filter(c => c.status === 'active').length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.9 }}>
                Active Coaches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -20,
              right: -20,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {coaches.reduce((sum, coach) => sum + coach.totalStudents, 0)}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.9 }}>
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -20,
              right: -20,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {coaches.reduce((sum, coach) => sum + coach.activeClasses, 0)}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.9 }}>
                Active Classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Toolbar */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Add Coach
        </Button>
      </Box>

      {/* Enhanced Coach Cards */}
      <Grid container spacing={3}>
        {coaches.map((coach) => (
          <Grid item xs={12} md={6} key={coach.id}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                {/* Header with Avatar and Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: 64, 
                        height: 64,
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      {coach.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {coach.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating 
                          value={coach.rating} 
                          precision={0.1} 
                          readOnly 
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#FFD93D',
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                          {coach.rating} ({coach.totalStudents} students)
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusText(coach.status)}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          background: 
                            coach.status === 'active' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
                            coach.status === 'inactive' ? 'linear-gradient(135deg, #ff6b9d 0%, #ff8fb1 100%)' :
                            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(coach)}
                        sx={{
                          background: 'rgba(102, 126, 234, 0.1)',
                          color: 'rgba(102, 126, 234, 0.8)',
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.2)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(coach.id)}
                        sx={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: 'rgba(239, 68, 68, 0.8)',
                          '&:hover': {
                            background: 'rgba(239, 68, 68, 0.2)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Bio Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {coach.bio}
                  </Typography>
                </Box>

                {/* Specialties Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
                    Specialties:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {coach.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontWeight: 500,
                          borderColor: 'rgba(102, 126, 234, 0.3)',
                          color: 'rgba(102, 126, 234, 0.8)',
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.08)',
                            borderColor: 'rgba(102, 126, 234, 0.5)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Stats Grid */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          background: 'rgba(102, 126, 234, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                        }}
                      >
                        <SchoolIcon sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {coach.experience} years exp.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          background: 'rgba(102, 126, 234, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                        }}
                      >
                        <FitnessCenter sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {coach.activeClasses} classes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          background: 'rgba(102, 126, 234, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {coach.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          background: 'rgba(102, 126, 234, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {coach.phone}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
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
                label="Years of Experience"
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
                                  placeholder="Describe the experience, training and specialties of the coach..."
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
