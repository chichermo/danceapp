import React, { useState, useEffect } from 'react';
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
import persistenceService from '../services/PersistenceService';

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

// Default coaches data
const defaultCoaches: Coach[] = [
  {
    id: '1',
    name: 'Liesbeth Kreps',
    email: 'liesbeth.kreps@heliopsis.be',
    phone: '+32 2 123 45 67',
    specialties: ['Dance Leadership', 'Administration', 'Artistic Direction', 'Operations'],
    experience: 15,
    rating: 5.0,
    totalStudents: 120,
    activeClasses: 25,
    bio: 'Board member, dance teacher, responsible for dance-artistic leadership, administration and operational team. Leading the artistic vision of Heliopsis Dance Academy.',
    joinDate: new Date('2010-01-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '2',
    name: 'Giulia',
    email: 'giulia@heliopsis.be',
    phone: '+32 2 123 45 68',
    specialties: ['Dance Leadership', 'Social Media', 'Artistic Direction', 'Operations'],
    experience: 12,
    rating: 4.9,
    totalStudents: 95,
    activeClasses: 20,
    bio: 'Board member, dance teacher, operational team member, responsible for social media & dance-artistic leadership. Expert in modern dance techniques and digital engagement.',
    joinDate: new Date('2012-03-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '3',
    name: 'Miet',
    email: 'miet@heliopsis.be',
    phone: '+32 2 123 45 69',
    specialties: ['Contemporary', 'Modern Dance', 'Operations'],
    experience: 10,
    rating: 4.8,
    totalStudents: 78,
    activeClasses: 15,
    bio: 'Dance teacher and operational team member. Specialized in contemporary and modern dance techniques with a focus on creative expression.',
    joinDate: new Date('2014-09-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '4',
    name: 'Aline',
    email: 'aline@heliopsis.be',
    phone: '+32 2 123 45 70',
    specialties: ['Ballet', 'Classical Dance', 'Technique'],
    experience: 8,
    rating: 4.7,
    totalStudents: 65,
    activeClasses: 12,
    bio: 'Dance teacher specializing in classical ballet and technical training. Dedicated to developing strong foundations in dance technique.',
    joinDate: new Date('2016-01-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '5',
    name: 'Erien',
    email: 'erien@heliopsis.be',
    phone: '+32 2 123 45 71',
    specialties: ['Hip Hop', 'Urban Dance', 'Youth'],
    experience: 7,
    rating: 4.6,
    totalStudents: 55,
    activeClasses: 10,
    bio: 'Dance teacher focused on hip hop and urban dance styles. Passionate about working with young dancers and developing street dance skills.',
    joinDate: new Date('2017-03-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '6',
    name: 'Britt',
    email: 'britt@heliopsis.be',
    phone: '+32 2 123 45 72',
    specialties: ['Jazz', 'Contemporary', 'Adults'],
    experience: 6,
    rating: 4.5,
    totalStudents: 45,
    activeClasses: 8,
    bio: 'Dance teacher specializing in jazz and contemporary dance. Experienced in teaching adult dancers and developing choreographic skills.',
    joinDate: new Date('2018-09-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '7',
    name: 'Anaïs',
    email: 'anais@heliopsis.be',
    phone: '+32 2 123 45 73',
    specialties: ['Mini Dance', 'Children', 'Creative Movement'],
    experience: 5,
    rating: 4.4,
    totalStudents: 35,
    activeClasses: 6,
    bio: 'Dance teacher specializing in mini dance and creative movement for young children. Creating a fun and engaging environment for early dance education.',
    joinDate: new Date('2019-01-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '8',
    name: 'Naëlle',
    email: 'naelle@heliopsis.be',
    phone: '+32 2 123 45 74',
    specialties: ['Teen Dance', 'Contemporary', 'Performance'],
    experience: 4,
    rating: 4.3,
    totalStudents: 30,
    activeClasses: 5,
    bio: 'Dance teacher focused on teen dance programs and contemporary performance. Helping young dancers develop their artistic voice.',
    joinDate: new Date('2020-03-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '9',
    name: 'Eline',
    email: 'eline@heliopsis.be',
    phone: '+32 2 123 45 75',
    specialties: ['Ballet', 'Technique', 'Beginners'],
    experience: 3,
    rating: 4.2,
    totalStudents: 25,
    activeClasses: 4,
    bio: 'Dance teacher specializing in ballet technique for beginners. Building strong foundations and love for classical dance.',
    joinDate: new Date('2021-01-01'),
    status: 'active',
    photo: '',
  },
  {
    id: '10',
    name: 'Marc',
    email: 'marc@heliopsis.be',
    phone: '+32 2 123 45 76',
    specialties: ['Management', 'Finance', 'Leadership'],
    experience: 20,
    rating: 5.0,
    totalStudents: 0,
    activeClasses: 0,
    bio: 'Chairman and treasurer of Heliopsis Dance Academy. Providing strategic leadership and financial management for the academy.',
    joinDate: new Date('2005-01-01'),
    status: 'active',
    photo: '',
  },
];

const Coaches: React.FC = () => {
  // Load coaches from persistence or use defaults
  const loadInitialCoaches = (): Coach[] => {
    const savedCoaches = persistenceService.loadCoaches();
    if (savedCoaches.length > 0) {
      // Convert dates back to Date objects
      return savedCoaches.map(coach => ({
        ...coach,
        joinDate: new Date(coach.joinDate)
      }));
    }
    return defaultCoaches;
  };

  const [coaches, setCoaches] = useState<Coach[]>(loadInitialCoaches);

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

  const allSpecialties = ['Dance Leadership', 'Administration', 'Artistic Direction', 'Operations', 'Social Media', 'Contemporary', 'Modern Dance', 'Ballet', 'Classical Dance', 'Technique', 'Hip Hop', 'Urban Dance', 'Youth', 'Jazz', 'Adults', 'Mini Dance', 'Children', 'Creative Movement', 'Teen Dance', 'Performance', 'Beginners', 'Management', 'Finance', 'Leadership'];

  // Save coaches to persistence whenever they change
  useEffect(() => {
    persistenceService.saveCoaches(coaches);
  }, [coaches]);

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
      'on_leave': 'On Leave',
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

      {/* Dialog to create/edit coach */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCoach ? 'Edit Coach' : 'New Coach'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
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
                label="Phone"
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
                label="Biography"
                multiline
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                  placeholder="Describe the experience, training and specialties of the coach..."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Specialties:
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingCoach ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Coaches;
