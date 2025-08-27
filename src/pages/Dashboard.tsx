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
  Container,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  FitnessCenter as CoachIcon,
  Class as ClassIcon,
  MusicNote as ChoreographyIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '156',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FB1 100%)',
      trend: '+12%',
      trendUp: true,
      subtitle: 'Active members',
    },
    {
      title: 'Active Coaches',
      value: '8',
      icon: <CoachIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #4ECDC4 0%, #7DD3D0 100%)',
      trend: '+2',
      trendUp: true,
      subtitle: 'Professional instructors',
    },
    {
      title: 'Classes This Week',
      value: '42',
      icon: <ClassIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #FFD93D 0%, #FED976 100%)',
      trend: '+5',
      trendUp: true,
      subtitle: 'Scheduled sessions',
    },
    {
      title: 'Choreographies',
      value: '23',
      icon: <ChoreographyIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
      trend: '+3',
      trendUp: true,
      subtitle: 'Creative pieces',
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
      color: '#FF6B9D',
    },
    {
      name: 'Contemporary Adults',
      time: '18:00',
      coach: 'Carlos Ruiz',
      location: 'Hall 2',
      students: 12,
      maxStudents: 15,
      type: 'Contemporary',
      color: '#4ECDC4',
    },
    {
      name: 'Ragga Mini',
      time: '15:00',
      coach: 'Ana Martinez',
      location: 'Small Hall',
      students: 8,
      maxStudents: 12,
      type: 'Ragga',
      color: '#FFD93D',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'student',
      message: 'New student registration: Sofia Rodriguez',
      time: '2 hours ago',
      avatar: 'SR',
      color: '#FF6B9D',
    },
    {
      id: 2,
      type: 'class',
      message: 'Class completed: Advanced Ballet',
      time: '4 hours ago',
      avatar: 'AB',
      color: '#45B7D1',
    },
    {
      id: 3,
      type: 'choreography',
      message: 'New choreography uploaded: "Urban Flow"',
      time: '6 hours ago',
      avatar: 'UF',
      color: '#6C5CE7',
    },
    {
      id: 4,
      type: 'achievement',
      message: 'Student achievement: First place in competition',
      time: '1 day ago',
      avatar: '🏆',
      color: '#FFD93D',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
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
        {/* Header Section */}
        <motion.div variants={itemVariants}>
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
              Welcome Back!
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              Your Trusted Dance Academy
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome to your personalized dance management platform. Here you can oversee all aspects of your academy,
              from student progress to class scheduling and choreography management.
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: stat.color,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      transform: 'translate(30px, -30px)',
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {stat.subtitle}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {stat.trend} this month
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Upcoming Classes */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Upcoming Classes
                    </Typography>
                    <IconButton
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        },
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                  
                  <List sx={{ p: 0 }}>
                    {upcomingClasses.map((classItem, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            mb: 1,
                            background: 'rgba(0, 0, 0, 0.02)',
                            '&:hover': {
                              background: 'rgba(0, 0, 0, 0.04)',
                              transform: 'translateX(4px)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                background: classItem.color,
                                width: 48,
                                height: 48,
                              }}
                            >
                              <ClassIcon />
                            </Avatar>
                          </ListItemAvatar>
                          
                          <Box sx={{ flex: 1, ml: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {classItem.name}
                              </Typography>
                              <Chip
                                label={classItem.type}
                                size="small"
                                sx={{
                                  background: classItem.color,
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {classItem.time}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {classItem.location}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                Coach: {classItem.coach}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {classItem.students}/{classItem.maxStudents} students
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={(classItem.students / classItem.maxStudents) * 100}
                                  sx={{
                                    width: 60,
                                    height: 6,
                                    borderRadius: 3,
                                    '& .MuiLinearProgress-bar': {
                                      background: classItem.color,
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </ListItem>
                        {index < upcomingClasses.length - 1 && <Divider sx={{ my: 1 }} />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Recent Activity
                  </Typography>
                  
                  <List sx={{ p: 0 }}>
                    {recentActivity.map((activity, index) => (
                      <ListItem
                        key={activity.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            background: 'rgba(0, 0, 0, 0.02)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              background: activity.color,
                              width: 40,
                              height: 40,
                              fontSize: '0.9rem',
                            }}
                          >
                            {activity.avatar}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                              {activity.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
