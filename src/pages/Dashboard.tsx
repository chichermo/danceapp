import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  FitnessCenter as CoachIcon,
  Class as ClassIcon,
  MusicNote as ChoreographyIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const stats = [
    {
              title: 'Total Students',
      value: '156',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#FF6B9D',
      trend: '+12%',
      trendUp: true,
    },
    {
              title: 'Active Coaches',
      value: '8',
      icon: <CoachIcon sx={{ fontSize: 40 }} />,
      color: '#4ECDC4',
      trend: '+2',
      trendUp: true,
    },
    {
              title: 'Classes This Week',
      value: '42',
      icon: <ClassIcon sx={{ fontSize: 40 }} />,
      color: '#FFD93D',
      trend: '+5',
      trendUp: true,
    },
    {
              title: 'Choreographies',
      value: '23',
      icon: <ChoreographyIcon sx={{ fontSize: 40 }} />,
      color: '#6C5CE7',
      trend: '+3',
      trendUp: true,
    },
  ];

  const upcomingClasses = [
    {
      name: 'Hip Hop Teens',
      time: '16:00',
              coach: 'Maria Gonzalez',
              location: 'Main Hall',
      students: 18,
      maxStudents: 20,
      type: 'Hip Hop',
    },
    {
              name: 'Contemporary Adults',
      time: '18:00',
      coach: 'Carlos Ruiz',
              location: 'Hall 2',
      students: 12,
      maxStudents: 15,
              type: 'Contemporary',
    },
    {
      name: 'Ragga Mini',
      time: '15:00',
              coach: 'Ana Martinez',
              location: 'Small Hall',
      students: 8,
      maxStudents: 12,
      type: 'Ragga',
    },
  ];

  const recentActivity = [
    {
      type: 'new_student',
              message: 'Ana Garcia enrolled in Hip Hop Teens',
              time: '2 hours ago',
      icon: <PeopleIcon />,
      color: '#FF6B9D',
    },
    {
      type: 'new_choreography',
              message: 'Choreography "Hip Hop Fusion" was created',
              time: '4 hours ago',
      icon: <ChoreographyIcon />,
      color: '#6C5CE7',
    },
    {
      type: 'class_completed',
              message: 'Contemporary Adults class completed',
              time: '6 hours ago',
      icon: <ClassIcon />,
      color: '#4ECDC4',
    },
    {
      type: 'achievement',
              message: 'Carlos Rodriguez reached Advanced level',
              time: '1 day ago',
      icon: <TrophyIcon />,
      color: '#FFD93D',
    },
  ];

  const topPerformers = [
            { name: 'Laura Martinez', level: 'Advanced', progress: 85, category: 'Teens' },
            { name: 'Diego Ruiz', level: 'Expert', progress: 92, category: 'Adults' },
        { name: 'Sofia Lopez', level: 'Intermediate', progress: 78, category: 'Teens' },
            { name: 'Miguel Lopez', level: 'Beginner', progress: 65, category: 'Mini' },
  ];

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Hip Hop': '#FF6B9D',
              'Contemporary': '#4ECDC4',
      'Ragga': '#FFD93D',
      'Jazz': '#6C5CE7',
      'Ballet': '#A8E6CF',
    };
    return colors[type] || '#95A5A6';
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header del Dashboard */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h2" sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            🎭 Bienvenido a Heliopsis
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
            Your Trusted Dance Academy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona tus clases, estudiantes y coreografías desde un solo lugar
          </Typography>
        </motion.div>
      </Box>

              {/* Main Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                border: `2px solid ${stat.color}20`,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 40px ${stat.color}30`,
                },
                transition: 'all 0.3s ease',
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      background: `${stat.color}20`,
                      color: stat.color,
                      border: `3px solid ${stat.color}30`,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold',
                    color: stat.color,
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {stat.title}
                  </Typography>
                  <Chip
                    label={stat.trend}
                    size="small"
                    sx={{
                      background: stat.trendUp ? '#2ECC71' : '#E74C3C',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Classes */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Upcoming Classes
                  </Typography>
                </Box>
                <List>
                  {upcomingClasses.map((classItem, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          background: getTypeColor(classItem.type),
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                          {classItem.type.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                                             <ListItemText
                         primary={classItem.name}
                         secondary={`${classItem.time} • ${classItem.coach} • ${classItem.location}`}
                       />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          {classItem.students}/{classItem.maxStudents}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(classItem.students / classItem.maxStudents) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            background: '#E0E0E0',
                            '& .MuiLinearProgress-bar': {
                              background: classItem.students / classItem.maxStudents > 0.8 ? '#E74C3C' : '#4ECDC4',
                            },
                          }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card sx={{
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Actividad Reciente
                  </Typography>
                </Box>
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          background: `${activity.color}20`,
                          color: activity.color,
                          width: 40,
                          height: 40,
                        }}>
                          {activity.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontWeight: 500 }
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <StarIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Top Performers
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {topPerformers.map((performer, index) => (
                    <Grid item xs={12} sm={6} md={3} key={performer.name}>
                      <Box sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.5)',
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            mr: 1,
                            background: index === 0 ? '#FFD93D' : 
                                       index === 1 ? '#C0C0C0' : 
                                       index === 2 ? '#CD7F32' : '#4ECDC4',
                            color: 'white',
                            fontWeight: 'bold',
                          }}>
                            {index + 1}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {performer.category}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {performer.level}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={performer.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            background: '#E0E0E0',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {performer.progress}% completado
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
