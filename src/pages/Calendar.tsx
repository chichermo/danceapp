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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface Class {
  id: string;
  name: string;
  type: string;
  category: string;
  coach: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  maxStudents: number;
  currentStudents: number;
  students: string[];
}

const Calendar: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'Hip Hop Teens',
      type: 'Hip Hop',
      category: 'Teens',
      coach: 'Maria Gonzalez',
      date: new Date(),
      startTime: '16:00',
      endTime: '17:30',
      location: 'Main Hall',
      maxStudents: 20,
      currentStudents: 15,
      students: ['Ana', 'Carlos', 'Laura', 'Miguel'],
    },
    {
      id: '2',
      name: 'Contemporary Adults',
      type: 'Contemporary',
      category: 'Adults',
      coach: 'Carlos Ruiz',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      startTime: '18:00',
      endTime: '19:30',
      location: 'Hall 2',
      maxStudents: 15,
      currentStudents: 12,
      students: ['Sofia', 'Diego', 'Carmen'],
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    coach: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    location: '',
    maxStudents: 20,
  });

  const classTypes = ['Hip Hop', 'Contemporary', 'Ragga', 'Jazz', 'Ballet'];
  const categories = ['Mini', 'Teens', 'Adults', 'High Level'];
  const coaches = ['Maria Gonzalez', 'Carlos Ruiz', 'Ana Martinez', 'Luis Perez'];

  const handleOpenDialog = (classItem?: Class) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        name: classItem.name,
        type: classItem.type,
        category: classItem.category,
        coach: classItem.coach,
        date: classItem.date,
        startTime: classItem.startTime,
        endTime: classItem.endTime,
        location: classItem.location,
        maxStudents: classItem.maxStudents,
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        type: '',
        category: '',
        coach: '',
        date: new Date(),
        startTime: '',
        endTime: '',
        location: '',
        maxStudents: 20,
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
          ? { ...c, ...formData, date: formData.date }
          : c
      ));
    } else {
      const newClass: Class = {
        id: Date.now().toString(),
        ...formData,
        date: formData.date,
        currentStudents: 0,
        students: [],
      };
      setClasses([...classes, newClass]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Hip Hop': '#1976d2',
      'Contemporary': '#dc004e',
      'Ragga': '#ff9800',
      'Jazz': '#9c27b0',
      'Ballet': '#4caf50',
    };
    return colors[type] || '#757575';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Mini': '#ff9800',
      'Teens': '#2196f3',
      'Adults': '#4caf50',
      'High Level': '#9c27b0',
    };
    return colors[category] || '#757575';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Calendar of Classes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Class
        </Button>
      </Box>

      <Grid container spacing={3}>
        {classes.map((classItem) => (
          <Grid item xs={12} md={6} lg={4} key={classItem.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {classItem.name}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenDialog(classItem)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
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
                      backgroundColor: getCategoryColor(classItem.category), 
                      color: 'white' 
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.date.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {classItem.startTime} - {classItem.endTime}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.location}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Coach: {classItem.coach}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PeopleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {classItem.currentStudents}/{classItem.maxStudents} students
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

                {classItem.students.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Students enrolled:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {classItem.students.map((student, index) => (
                        <Chip
                          key={index}
                          label={student}
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

              {/* Dialog to create/edit class */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingClass ? 'Edit Class' : 'New Class'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Class Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Class Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Class Type"
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => setFormData({ ...formData, date: newValue || new Date() })}
                  slots={{
                    textField: TextField,
                  }}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Students"
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingClass ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
