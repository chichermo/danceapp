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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  InputAdornment,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  FitnessCenter as DanceIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  ExpandMore,
  Phone,
  Email,
  LocationOn,
  Group,
  TrendingUp,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, StudentFormData, StudentFilters, DanceGroup } from '../types/Student';
import studentService from '../services/StudentService';
import FileImporter from '../components/FileImporter';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [danceGroups, setDanceGroups] = useState<DanceGroup[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    level: '',
    status: '',
    danceGroups: [],
    ageRange: [0, 100],
    isActive: true
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load initial data
  useEffect(() => {
    loadStudents();
    loadDanceGroups();
  }, []);

  const loadStudents = () => {
    const allStudents = studentService.getAllStudents();
    setStudents(allStudents);
  };

  const loadDanceGroups = () => {
    const allGroups = studentService.getAllDanceGroups();
    setDanceGroups(allGroups);
  };

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      // Convertir estudiante a formato de formulario
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth.toISOString().split('T')[0],
        gender: student.gender,
        email: student.email || '',
        phone: student.phone || '',
        address: student.address,
        guardians: student.guardians.map(g => ({
          firstName: g.firstName,
          lastName: g.lastName,
          relationship: g.relationship,
          phone: g.phone,
          email: g.email,
          emergencyContact: g.emergencyContact,
          canPickUp: g.canPickUp
        })),
        danceGroups: student.danceGroups,
        level: student.level,
        medicalInfo: student.medicalInfo || '',
        allergies: student.allergies || [],
        notes: student.notes || ''
      });
    } else {
      setEditingStudent(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
    setFormData(initialFormData);
  };

  const initialFormData: StudentFormData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
            gender: 'Female',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Belgium'
    },
    guardians: [{
      firstName: '',
      lastName: '',
      relationship: 'Father',
      phone: '',
      email: '',
      emergencyContact: true,
      canPickUp: true
    }],
    danceGroups: [],
    level: 'Beginner',
    medicalInfo: '',
    allergies: [],
    notes: ''
  };

  const [formData, setFormData] = useState<StudentFormData>(initialFormData);

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName) {
      setSnackbar({
        open: true,
        message: 'Nombre y apellido son obligatorios',
        severity: 'error'
      });
      return;
    }

    if (editingStudent) {
      // Actualizar estudiante existente
      const updated = studentService.updateStudent(editingStudent.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        dateOfBirth: new Date(formData.dateOfBirth),
        age: studentService['calculateAge'](new Date(formData.dateOfBirth)),
        gender: formData.gender as any,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        guardians: formData.guardians.map((guardian, index) => ({
          ...guardian,
          id: editingStudent.guardians[index]?.id || `guardian-${Date.now()}-${index}`
        })),
        danceGroups: formData.danceGroups,
        level: formData.level as any,
        medicalInfo: formData.medicalInfo,
        allergies: formData.allergies,
        notes: formData.notes
      });

      if (updated) {
        setSnackbar({
          open: true,
          message: 'Student updated successfully',
          severity: 'success'
        });
      }
    } else {
      // Crear nuevo estudiante
      const newStudent = studentService.createStudent(formData);
      setSnackbar({
        open: true,
        message: 'Student created successfully',
        severity: 'success'
      });
    }

    loadStudents();
    handleCloseDialog();
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const deleted = studentService.deleteStudent(studentId);
      if (deleted) {
        setSnackbar({
          open: true,
          message: 'Student deleted successfully',
          severity: 'success'
        });
        loadStudents();
      }
    }
  };

  const handleImportComplete = (data: any[]) => {
    // Procesar los datos importados usando el servicio
    const result = studentService.importStudentsFromFile(data);
    
    console.log('Resultado de importación:', result);
    
    if (result.success > 0) {
      setSnackbar({
        open: true,
        message: `${result.success} students imported successfully${result.errors.length > 0 ? `, ${result.errors.length} errors` : ''}`,
        severity: result.errors.length > 0 ? 'info' : 'success'
      });
      
      // Recargar la lista de estudiantes
      loadStudents();
    } else {
      setSnackbar({
        open: true,
        message: `Could not import students. Errors: ${result.errors.join(', ')}`,
        severity: 'error'
      });
    }
    
    setShowImportDialog(false);
  };

  const filteredStudents = studentService.filterStudents(filters);

  const getStudentStats = () => {
    return studentService.getStudentStats();
  };

  const stats = getStudentStats();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        👥 Student Management
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalStudents}
              </Typography>
              <Typography variant="body2">Total Students</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.activeStudents}
              </Typography>
              <Typography variant="body2">Active Students</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.averageAge}
              </Typography>
              <Typography variant="body2">Average Age</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {Math.round(stats.attendanceRate * 100)}%
              </Typography>
              <Typography variant="body2">Average Attendance</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search students..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? 'contained' : 'outlined'}
              >
                Filters
              </Button>
              <Button
                startIcon={<UploadIcon />}
                onClick={() => setShowImportDialog(true)}
                variant="outlined"
                color="secondary"
              >
                Import
              </Button>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => {
                  const csv = studentService.exportStudentsToCSV();
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'students.csv';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                variant="outlined"
              >
                Export
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                variant="contained"
                sx={{ 
                  background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5A8E, #3DB8B0)'
                  }
                }}
              >
                New Student
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Filtros expandibles */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Level</InputLabel>
                    <Select
                      value={filters.level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                      label="Level"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                      <MenuItem value="Expert">Expert</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      label="Status"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Suspended">Suspended</MenuItem>
                      <MenuItem value="Graduated">Graduated</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Groups</InputLabel>
                    <Select
                      multiple
                      value={filters.danceGroups}
                      onChange={(e) => setFilters({ ...filters, danceGroups: e.target.value as string[] })}
                      label="Groups"
                    >
                      {danceGroups.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          {group.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
                    </Typography>
                    <Slider
                      value={filters.ageRange}
                      onChange={(_, value) => setFilters({ ...filters, ageRange: value as [number, number] })}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </Paper>

      {/* Enhanced Student List */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredStudents.map((student, index) => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
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
                    {/* Header with Avatar and Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          mr: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        }}
                      >
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {student.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {student.age} years • {student.gender}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip
                          label={student.level}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            background: 
                              student.level === 'Beginner' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
                              student.level === 'Intermediate' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                              student.level === 'Advanced' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Dance Groups */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                        Dance Groups:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {student.danceGroups.map((groupId) => {
                          const group = danceGroups.find(g => g.id === groupId);
                          return group ? (
                            <Chip
                              key={groupId}
                              label={group.name}
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
                          ) : null;
                        })}
                      </Box>
                    </Box>

                    {/* Contact Information */}
                    <Box sx={{ mb: 3 }}>
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
                          <Email sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {student.email || 'No email'}
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
                          <Phone sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {student.phone || 'No phone'}
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
                          <LocationOn sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {student.address.city}, {student.address.state}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                          <Group sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {student.danceGroups.length} group(s)
                        </Typography>
                      </Box>
                    </Box>

                    {/* Enrollment Info */}
                    <Box sx={{ mb: 3 }}>
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
                          <CalendarIcon sx={{ fontSize: 16, color: 'rgba(102, 126, 234, 0.7)' }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Enrolled: {student.joinDate.toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Enrolled: {student.joinDate.toLocaleDateString('en-US')}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(student)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(student.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* Student Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        disablePortal
      >
        <DialogTitle>
          {editingStudent ? 'Edit Student' : 'New Student'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ mb: 3 }}>
                            <Tab label="Personal Information" />
                <Tab label="Contact & Address" />
                <Tab label="Guardians" />
                <Tab label="Academic Information" />
                <Tab label="Medical Information" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                                      <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      label="Gender"
                    >
                                          <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Non-binary">Non-binary</MenuItem>
                      <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street and Number"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                                        label="City"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Region"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                                        label="Postal Code"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                                        label="Country"
                  value={formData.address.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value }
                  })}
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Box>
              {formData.guardians.map((guardian, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Guardian {index + 1}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={guardian.firstName}
                        onChange={(e) => {
                          const newGuardians = [...formData.guardians];
                          newGuardians[index].firstName = e.target.value;
                          setFormData({ ...formData, guardians: newGuardians });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Relationship</InputLabel>
                        <Select
                          value={guardian.relationship}
                          onChange={(e) => {
                            const newGuardians = [...formData.guardians];
                            newGuardians[index].relationship = e.target.value as any;
                            setFormData({ ...formData, guardians: newGuardians });
                          }}
                          label="Relationship"
                        >
                          <MenuItem value="Father">Father</MenuItem>
                          <MenuItem value="Mother">Mother</MenuItem>
                          <MenuItem value="Guardian">Guardian</MenuItem>
                          <MenuItem value="Legal Representative">Legal Representative</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={guardian.phone}
                        onChange={(e) => {
                          const newGuardians = [...formData.guardians];
                          newGuardians[index].phone = e.target.value;
                          setFormData({ ...formData, guardians: newGuardians });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={guardian.email}
                        onChange={(e) => {
                          const newGuardians = [...formData.guardians];
                          newGuardians[index].email = e.target.value;
                          setFormData({ ...formData, guardians: newGuardians });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={guardian.emergencyContact}
                            onChange={(e) => {
                              const newGuardians = [...formData.guardians];
                              newGuardians[index].emergencyContact = e.target.checked;
                              setFormData({ ...formData, guardians: newGuardians });
                            }}
                          />
                        }
                        label="Emergency Contact"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={guardian.canPickUp}
                            onChange={(e) => {
                              const newGuardians = [...formData.guardians];
                              newGuardians[index].canPickUp = e.target.checked;
                              setFormData({ ...formData, guardians: newGuardians });
                            }}
                          />
                        }
                        label="Can Pick Up Student"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setFormData({
                  ...formData,
                  guardians: [...formData.guardians, {
                    firstName: '',
                    lastName: '',
                    relationship: 'Father',
                    phone: '',
                    email: '',
                    emergencyContact: false,
                    canPickUp: false
                  }]
                })}
                variant="outlined"
              >
                Add Guardian
              </Button>
            </Box>
          )}

          {activeTab === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    label="Level"
                  >
                                          <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                      <MenuItem value="Expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                                      <InputLabel>Dance Groups</InputLabel>
                    <Select
                      multiple
                      value={formData.danceGroups}
                      onChange={(e) => setFormData({ ...formData, danceGroups: e.target.value as string[] })}
                      label="Dance Groups"
                    >
                    {danceGroups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name} - {group.style}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional information about the student..."
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 4 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medical Information"
                  multiline
                  rows={3}
                  value={formData.medicalInfo}
                  onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                  placeholder="Medical conditions, allergies, medications..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Allergies"
                  value={formData.allergies.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  })}
                  placeholder="Separate multiple allergies with commas"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingStudent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        maxWidth="md"
        fullWidth
        disablePortal
      >
        <DialogTitle>Import Students</DialogTitle>
        <DialogContent>
          <FileImporter
            onImportComplete={handleImportComplete}
            acceptedFormats={['.csv', '.json']}
            maxFileSize={10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Students;
