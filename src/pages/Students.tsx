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

  // Cargar datos iniciales
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
          name: g.name,
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
    gender: 'Femenino',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Chile'
    },
    guardians: [{
      name: '',
      relationship: 'Padre',
      phone: '',
      email: '',
      emergencyContact: true,
      canPickUp: true
    }],
    danceGroups: [],
    level: 'Principiante',
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
          message: 'Estudiante actualizado exitosamente',
          severity: 'success'
        });
      }
    } else {
      // Crear nuevo estudiante
      const newStudent = studentService.createStudent(formData);
      setSnackbar({
        open: true,
        message: 'Estudiante creado exitosamente',
        severity: 'success'
      });
    }

    loadStudents();
    handleCloseDialog();
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      const deleted = studentService.deleteStudent(studentId);
      if (deleted) {
        setSnackbar({
          open: true,
          message: 'Estudiante eliminado exitosamente',
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
        message: `${result.success} estudiantes importados exitosamente${result.errors.length > 0 ? `, ${result.errors.length} errores` : ''}`,
        severity: result.errors.length > 0 ? 'info' : 'success'
      });
      
      // Recargar la lista de estudiantes
      loadStudents();
    } else {
      setSnackbar({
        open: true,
        message: `No se pudieron importar estudiantes. Errores: ${result.errors.join(', ')}`,
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
        👥 Gestión de Estudiantes
      </Typography>

      {/* Estadísticas */}
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
              <Typography variant="body2">Total Estudiantes</Typography>
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
              <Typography variant="body2">Estudiantes Activos</Typography>
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
              <Typography variant="body2">Edad Promedio</Typography>
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
              <Typography variant="body2">Asistencia Promedio</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barra de herramientas */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar estudiantes..."
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
                Filtros
              </Button>
              <Button
                startIcon={<UploadIcon />}
                onClick={() => setShowImportDialog(true)}
                variant="outlined"
                color="secondary"
              >
                Importar
              </Button>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => {
                  const csv = studentService.exportStudentsToCSV();
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'estudiantes.csv';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                variant="outlined"
              >
                Exportar
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
                Nuevo Estudiante
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
                    <InputLabel>Nivel</InputLabel>
                    <Select
                      value={filters.level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                      label="Nivel"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Principiante">Principiante</MenuItem>
                      <MenuItem value="Intermedio">Intermedio</MenuItem>
                      <MenuItem value="Avanzado">Avanzado</MenuItem>
                      <MenuItem value="Experto">Experto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      label="Estado"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Activo">Activo</MenuItem>
                      <MenuItem value="Inactivo">Inactivo</MenuItem>
                      <MenuItem value="Suspendido">Suspendido</MenuItem>
                      <MenuItem value="Graduado">Graduado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Grupos</InputLabel>
                    <Select
                      multiple
                      value={filters.danceGroups}
                      onChange={(e) => setFilters({ ...filters, danceGroups: e.target.value as string[] })}
                      label="Grupos"
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
                      Rango de Edad: {filters.ageRange[0]} - {filters.ageRange[1]} años
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

      {/* Lista de estudiantes */}
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
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          mr: 2,
                          background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)'
                        }}
                      >
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {student.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.age} años • {student.gender}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip
                          label={student.level}
                          size="small"
                          color={
                            student.level === 'Principiante' ? 'default' :
                            student.level === 'Intermedio' ? 'primary' :
                            student.level === 'Avanzado' ? 'secondary' : 'success'
                          }
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {student.danceGroups.map((groupId) => {
                        const group = danceGroups.find(g => g.id === groupId);
                        return group ? (
                          <Chip
                            key={groupId}
                            label={group.name}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ) : null;
                      })}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {student.email || 'Sin email'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {student.phone || 'Sin teléfono'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {student.address.city}, {student.address.state}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Group sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {student.danceGroups.length} grupo(s)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(student.attendanceRate * 100)}% asistencia
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Inscrito: {student.joinDate.toLocaleDateString('es-ES')}
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

      {/* Diálogo de estudiante */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        disablePortal
      >
        <DialogTitle>
          {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ mb: 3 }}>
            <Tab label="Información Personal" />
            <Tab label="Contacto y Dirección" />
            <Tab label="Apoderados" />
            <Tab label="Información Académica" />
            <Tab label="Información Médica" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Género</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    label="Género"
                  >
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="No binario">No binario</MenuItem>
                    <MenuItem value="Prefiero no decir">Prefiero no decir</MenuItem>
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
                  label="Teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Calle y Número"
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
                  label="Ciudad"
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
                  label="Región"
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
                  label="Código Postal"
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
                  label="País"
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
                    Apoderado {index + 1}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nombre Completo"
                        value={guardian.name}
                        onChange={(e) => {
                          const newGuardians = [...formData.guardians];
                          newGuardians[index].name = e.target.value;
                          setFormData({ ...formData, guardians: newGuardians });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Relación</InputLabel>
                        <Select
                          value={guardian.relationship}
                          onChange={(e) => {
                            const newGuardians = [...formData.guardians];
                            newGuardians[index].relationship = e.target.value as any;
                            setFormData({ ...formData, guardians: newGuardians });
                          }}
                          label="Relación"
                        >
                          <MenuItem value="Padre">Padre</MenuItem>
                          <MenuItem value="Madre">Madre</MenuItem>
                          <MenuItem value="Tutor">Tutor</MenuItem>
                          <MenuItem value="Apoderado">Apoderado</MenuItem>
                          <MenuItem value="Otro">Otro</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Teléfono"
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
                        label="Contacto de Emergencia"
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
                        label="Puede Recoger al Estudiante"
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
                    name: '',
                    relationship: 'Padre',
                    phone: '',
                    email: '',
                    emergencyContact: false,
                    canPickUp: false
                  }]
                })}
                variant="outlined"
              >
                Agregar Apoderado
              </Button>
            </Box>
          )}

          {activeTab === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Nivel</InputLabel>
                  <Select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    label="Nivel"
                  >
                    <MenuItem value="Principiante">Principiante</MenuItem>
                    <MenuItem value="Intermedio">Intermedio</MenuItem>
                    <MenuItem value="Avanzado">Avanzado</MenuItem>
                    <MenuItem value="Experto">Experto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Grupos de Danza</InputLabel>
                  <Select
                    multiple
                    value={formData.danceGroups}
                    onChange={(e) => setFormData({ ...formData, danceGroups: e.target.value as string[] })}
                    label="Grupos de Danza"
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
                  label="Notas"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Información adicional sobre el estudiante..."
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 4 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Información Médica"
                  multiline
                  rows={3}
                  value={formData.medicalInfo}
                  onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                  placeholder="Condiciones médicas, alergias, medicamentos..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alergias"
                  value={formData.allergies.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  })}
                  placeholder="Separar múltiples alergias con comas"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {editingStudent ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de importación */}
      <Dialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        maxWidth="md"
        fullWidth
        disablePortal
      >
        <DialogTitle>Importar Estudiantes</DialogTitle>
        <DialogContent>
          <FileImporter
            onImportComplete={handleImportComplete}
            acceptedFormats={['.csv', '.json']}
            maxFileSize={10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
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
