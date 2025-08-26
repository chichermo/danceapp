import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Alert,
  Grid,
  Paper
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  MoreVert,
  Add,
  Search,
  TrendingUp,
  Notifications,
  PersonAdd,
  PersonRemove,
  PlayArrow,
  Image,
  VideoLibrary
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import socialService, { Post, User, Comment as SocialComment } from '../services/SocialService';

interface SocialFeedProps {
  open: boolean;
  onClose: () => void;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ open, onClose }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingTags, setTrendingTags] = useState<Array<{ tag: string; count: number }>>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<Post['type']>('choreography');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  const currentUser = socialService.getCurrentUser();

  useEffect(() => {
    if (open) {
      loadFeed();
      loadTrendingTags();
      loadNotifications();
    }
  }, [open]);

  const loadFeed = () => {
    setLoading(true);
    setTimeout(() => {
      const feedPosts = socialService.getFeed(20);
      setPosts(feedPosts);
      setLoading(false);
    }, 1000);
  };

  const loadTrendingTags = () => {
    const trending = socialService.getTrendingTags();
    setTrendingTags(trending);
  };

  const loadNotifications = () => {
    const notifs = socialService.getNotifications();
    setNotifications(notifs);
  };

  const handleLike = (postId: string) => {
    const liked = socialService.likePost(postId);
    if (liked) {
      // Actualizar posts localmente
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } else {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes - 1 }
          : post
      ));
    }
  };

  const handleShare = (postId: string) => {
    const shared = socialService.sharePost(postId);
    if (shared) {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, shares: post.shares + 1 }
          : post
      ));
    }
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      const newPost = socialService.createPost(
        newPostContent,
        newPostType,
        undefined,
        [],
        'public'
      );
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setShowCreatePost(false);
    }
  };

  const handleFollow = (userId: string) => {
    const followed = socialService.followUser(userId);
    // Actualizar UI según sea necesario
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };

  const getPostTypeIcon = (type: Post['type']) => {
    switch (type) {
      case 'choreography': return '🎭';
      case 'achievement': return '🏆';
      case 'question': return '❓';
      case 'tip': return '💡';
      case 'video': return '🎥';
      default: return '📝';
    }
  };

  const getPostTypeColor = (type: Post['type']) => {
    switch (type) {
      case 'choreography': return 'primary';
      case 'achievement': return 'success';
      case 'question': return 'warning';
      case 'tip': return 'info';
      case 'video': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            🌟 Comunidad de Danza
          </Typography>
          <Badge badgeContent={notifications.length} color="error">
            <Notifications />
          </Badge>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreatePost(true)}
          sx={{
            background: 'linear-gradient(45deg, #FF6B9D 30%, #4ECDC4 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #E91E63 30%, #0097A7 90%)',
            }
          }}
        >
          Crear Post
        </Button>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
                Tendencias
              </Typography>
              {trendingTags.slice(0, 5).map((trend, index) => (
                <Chip
                  key={index}
                  label={`#${trend.tag} (${trend.count})`}
                  size="small"
                  onClick={() => setSelectedTag(trend.tag)}
                  sx={{ 
                    m: 0.5,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'primary.light' }
                  }}
                />
              ))}
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Notificaciones
              </Typography>
              {notifications.length > 0 ? (
                <List dense>
                  {notifications.slice(0, 3).map((notif, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={notif.user.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={notif.message}
                        secondary={formatTimeAgo(notif.createdAt)}
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay notificaciones nuevas
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Feed Principal */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar en la comunidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ mb: 2 }}
              />
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Cargando feed...</Typography>
              </Box>
            ) : (
              <Box>
                <AnimatePresence>
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
                        <CardContent>
                          {/* Header del Post */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              src={post.author.avatar} 
                              sx={{ mr: 2, width: 48, height: 48 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {post.author.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatTimeAgo(post.createdAt)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                icon={<span>{getPostTypeIcon(post.type)}</span>}
                                label={post.type}
                                size="small"
                                color={getPostTypeColor(post.type)}
                                variant="outlined"
                              />
                              <IconButton size="small">
                                <MoreVert />
                              </IconButton>
                            </Box>
                          </Box>

                          {/* Contenido del Post */}
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {post.content}
                          </Typography>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              {post.tags.map((tag, tagIndex) => (
                                <Chip
                                  key={tagIndex}
                                  label={`#${tag}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 1, mb: 1 }}
                                />
                              ))}
                            </Box>
                          )}

                          {/* Attachments */}
                          {post.attachments && post.attachments.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              {post.attachments.map((attachment, attIndex) => (
                                <Box key={attIndex} sx={{ mb: 1 }}>
                                  {attachment.type === 'video' && (
                                    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                                      <CardMedia
                                        component="img"
                                        height="200"
                                        image={attachment.thumbnail}
                                        alt="Video thumbnail"
                                      />
                                      <IconButton
                                        sx={{
                                          position: 'absolute',
                                          top: '50%',
                                          left: '50%',
                                          transform: 'translate(-50%, -50%)',
                                          backgroundColor: 'rgba(0,0,0,0.5)',
                                          color: 'white',
                                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                        }}
                                      >
                                        <PlayArrow />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}

                          {/* Acciones del Post */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                              startIcon={post.likes > 0 ? <Favorite /> : <FavoriteBorder />}
                              onClick={() => handleLike(post.id)}
                              color={post.likes > 0 ? 'error' : 'default'}
                            >
                              {post.likes}
                            </Button>
                            <Button startIcon={<Comment />}>
                              {post.comments.length}
                            </Button>
                            <Button startIcon={<Share />} onClick={() => handleShare(post.id)}>
                              {post.shares}
                            </Button>
                          </Box>

                          {/* Comentarios */}
                          {post.comments.length > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                              {post.comments.slice(0, 2).map((comment, commentIndex) => (
                                <Box key={commentIndex} sx={{ display: 'flex', mb: 1 }}>
                                  <Avatar 
                                    src={comment.author.avatar} 
                                    sx={{ width: 32, height: 32, mr: 1 }}
                                  />
                                  <Box>
                                    <Typography variant="body2" fontWeight="bold">
                                      {comment.author.name}
                                    </Typography>
                                    <Typography variant="body2">
                                      {comment.content}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                              {post.comments.length > 2 && (
                                <Typography variant="body2" color="text.secondary">
                                  Ver {post.comments.length - 2} comentarios más...
                                </Typography>
                              )}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      {/* Dialog para crear post */}
      <Dialog open={showCreatePost} onClose={() => setShowCreatePost(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="¿Qué quieres compartir con la comunidad?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant={newPostType === 'choreography' ? 'contained' : 'outlined'}
              onClick={() => setNewPostType('choreography')}
              startIcon={<span>🎭</span>}
            >
              Coreografía
            </Button>
            <Button
              variant={newPostType === 'tip' ? 'contained' : 'outlined'}
              onClick={() => setNewPostType('tip')}
              startIcon={<span>💡</span>}
            >
              Consejo
            </Button>
            <Button
              variant={newPostType === 'achievement' ? 'contained' : 'outlined'}
              onClick={() => setNewPostType('achievement')}
              startIcon={<span>🏆</span>}
            >
              Logro
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreatePost(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreatePost} 
            variant="contained"
            disabled={!newPostContent.trim()}
          >
            Publicar
          </Button>
        </DialogActions>
      </Dialog>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SocialFeed;
