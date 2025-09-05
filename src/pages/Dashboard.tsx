import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  IconButton,
  Container,
  Paper,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  MusicNote as MusicNoteIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface DashboardProps {
  // Props if needed
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [stats] = useState([
    {
      title: 'Total Students',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: PeopleIcon,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtitle: 'Active dancers'
    },
    {
      title: 'Coaches',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: SchoolIcon,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      subtitle: 'Professional instructors'
    },
    {
      title: 'Classes Today',
      value: '14',
      change: '+3',
      trend: 'up',
      icon: EventIcon,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      subtitle: 'Scheduled sessions'
    },
    {
      title: 'Performance',
      value: '94%',
      change: '+5%',
      trend: 'up',
      icon: EmojiEventsIcon,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      subtitle: 'Average attendance'
    }
  ]);

  const [upcomingClasses] = useState([
    {
      id: 1,
      name: 'Contemporary Advanced',
      time: '14:00 - 15:30',
      location: 'Studio A',
      coach: 'Liesbeth Kreps',
      type: 'Contemporary',
      students: 12,
      maxStudents: 15,
      color: '#4ecdc4'
    },
    {
      id: 2,
      name: 'Hip Hop Intermediate',
      time: '16:00 - 17:00',
      location: 'Studio B',
      coach: 'Giulia',
      type: 'Hip Hop',
      students: 18,
      maxStudents: 20,
      color: '#ff6b9d'
    },
    {
      id: 3,
      name: 'Ballet Technique',
      time: '18:00 - 19:30',
      location: 'Studio A',
      coach: 'Miet',
      type: 'Ballet',
      students: 8,
      maxStudents: 12,
      color: '#45b7d1'
    }
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'enrollment',
      message: 'New student enrolled in Contemporary Advanced',
      time: '2 hours ago',
      avatar: '👤',
      color: '#4ecdc4'
    },
    {
      id: 2,
      type: 'performance',
      message: 'Performance review completed for Hip Hop group',
      time: '4 hours ago',
      avatar: '⭐',
      color: '#ff6b9d'
    },
    {
      id: 3,
      type: 'class',
      message: 'Contemporary class attendance: 94%',
      time: '6 hours ago',
      avatar: '📊',
      color: '#45b7d1'
    }
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Welcome back to Heliopsis
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Here's what's happening at your dance academy today
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div variants={itemVariants}>
                <Card sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: stat.color
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          background: stat.color,
                          width: 48,
                          height: 48,
                          mr: 2
                        }}
                      >
                        <stat.icon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {stat.subtitle}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label={stat.change}
                          size="small"
                          sx={{
                            background: stat.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: stat.trend === 'up' ? '#10B981' : '#EF4444',
                            fontWeight: 600,
                            mb: 1
                          }}
                        />
                        {stat.trend === 'up' ? (
                          <TrendingUpIcon sx={{ color: '#10B981', fontSize: 20 }} />
                        ) : (
                          <TrendingDownIcon sx={{ color: '#EF4444', fontSize: 20 }} />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Upcoming Classes */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Upcoming Classes
                    </Typography>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      View All
                    </Button>
                  </Box>
                  <List sx={{ p: 0 }}>
                    {upcomingClasses.map((classItem, index) => (
                      <React.Fragment key={classItem.id}>
                        <ListItem
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            background: 'rgba(248, 250, 252, 0.5)',
                            border: '1px solid rgba(226, 232, 240, 0.5)',
                            '&:hover': {
                              background: 'rgba(248, 250, 252, 0.8)',
                              transform: 'translateY(-1px)',
                              transition: 'all 0.2s ease-in-out'
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                background: classItem.color,
                                width: 40,
                                height: 40
                              }}
                            >
                              <MusicNoteIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                                  {classItem.name}
                                </Typography>
                                <Chip
                                  label={classItem.type}
                                  size="small"
                                  sx={{
                                    background: `${classItem.color}20`,
                                    color: classItem.color,
                                    fontWeight: 600,
                                    mr: 1
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                    {classItem.time}
                                  </Typography>
                                  <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {classItem.location}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Coach: {classItem.coach}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
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
                                          background: classItem.color
                                        }
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < upcomingClasses.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
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
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    <Badge badgeContent={3} color="primary">
                      <NotificationsIcon />
                    </Badge>
                  </Box>
                  <List sx={{ p: 0 }}>
                    {recentActivity.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem sx={{ px: 0, py: 1 }}>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                background: activity.color,
                                width: 36,
                                height: 36,
                                fontSize: '1rem'
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
                        {index < recentActivity.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                      variant="text"
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      sx={{ justifyContent: 'space-between' }}
                    >
                      View All Activity
                    </Button>
                  </Box>
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
