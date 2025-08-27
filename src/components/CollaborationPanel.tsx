import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Comment,
  Send,
  Edit,
  Delete,
  Reply,
  AttachFile,
  Mic,
  MicOff,
  VideoCall,
  ScreenShare,
  Notifications,
  NotificationsOff,
  Group,
  Timeline,
  Bookmark,
  Flag
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'comment' | 'note' | 'instruction' | 'question';
  position?: { x: number; y: number; z: number };
  formation?: string;
  replies: Comment[];
  isResolved: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface CollaborationPanelProps {
  choreographyId: string;
  currentFormation?: string;
  currentTime: number;
  onPositionComment: (x: number, y: number, z: number) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  choreographyId,
  currentFormation,
  currentTime
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Coach Maria',
      content: 'Make sure Ana is in the front row for the jump',
      timestamp: new Date(),
      type: 'instruction',
      formation: 'Formation A',
      position: { x: 200, y: 300, z: 0 },
      replies: [],
      isResolved: false,
      priority: 'high'
    },
    {
      id: '2',
      author: 'Dancer Carlos',
      content: 'Can we adjust the timing of the turn at minute 2:30?',
      timestamp: new Date(Date.now() - 300000),
      type: 'question',
      formation: 'Formation B',
      replies: [
        {
          id: '2.1',
          author: 'Coach Maria',
          content: 'Yes, we will adjust it in the next rehearsal',
          timestamp: new Date(Date.now() - 240000),
          type: 'comment',
          replies: [],
          isResolved: false,
          priority: 'medium'
        }
      ],
      isResolved: false,
      priority: 'medium'
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'note' | 'instruction' | 'question'>('comment');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [notifications, setNotifications] = useState(true);
  
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      timestamp: new Date(),
      type: commentType,
      formation: currentFormation,
      position: undefined,
      replies: [],
      isResolved: false,
      priority
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    setCommentType('comment');
    setPriority('medium');
  };

  const handleReply = (commentId: string, replyContent: string) => {
    const reply: Comment = {
      id: `${commentId}.${Date.now()}`,
      author: 'Current User',
      content: replyContent,
      timestamp: new Date(),
      type: 'comment',
      replies: [],
      isResolved: false,
      priority: 'low'
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      return comment;
    }));
  };

  const handleResolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, isResolved: true };
      }
      return comment;
    }));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'instruction': return '📋';
      case 'note': return '📝';
      case 'question': return '❓';
      default: return '💬';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  };

  const filteredComments = comments.filter(comment => {
    if (activeTab === 0) return true; // All
    if (activeTab === 1) return comment.type === 'instruction';
    if (activeTab === 2) return comment.type === 'question';
    if (activeTab === 3) return comment.type === 'note';
    return false;
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del Panel */}
      <Paper sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            🎭 Colaboración en Tiempo Real
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Llamada de Video">
              <IconButton 
                size="small" 
                onClick={() => setIsVideoCall(!isVideoCall)}
                sx={{ color: 'white' }}
              >
                <VideoCall />
              </IconButton>
            </Tooltip>
            <Tooltip title="Compartir Pantalla">
              <IconButton size="small" sx={{ color: 'white' }}>
                <ScreenShare />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notificaciones">
              <IconButton 
                size="small" 
                onClick={() => setNotifications(!notifications)}
                sx={{ color: 'white' }}
              >
                {notifications ? <Notifications /> : <NotificationsOff />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Estadísticas Rápidas */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip 
            label={`${comments.length} comentarios`}
            size="small"
            sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
          <Chip 
            label={`${comments.filter(c => !c.isResolved).length} pendientes`}
            size="small"
            sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
          <Chip 
            label={`${currentFormation || 'Sin formación'}`}
            size="small"
            sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Box>
      </Paper>

      {/* Tabs de Navegación */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ 
            '& .MuiTab-root': { 
              minWidth: 'auto', 
              px: 2,
              textTransform: 'none',
              fontWeight: 'bold'
            }
          }}
        >
          <Tab label="Todos" />
          <Tab label="Instrucciones" />
          <Tab label="Preguntas" />
                          <Tab label="Notes" />
        </Tabs>
      </Box>

      {/* Lista de Comentarios */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <AnimatePresence>
          {filteredComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                sx={{ 
                  mb: 2, 
                  p: 2,
                  borderLeft: `4px solid ${getPriorityColor(comment.priority)}`,
                  opacity: comment.isResolved ? 0.6 : 1,
                  background: comment.isResolved ? '#f5f5f5' : 'white'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar sx={{ bgcolor: getPriorityColor(comment.priority) }}>
                    {comment.author.charAt(0)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {comment.author}
                      </Typography>
                      <Chip 
                        label={comment.type}
                        size="small"
                        icon={<span>{getTypeIcon(comment.type)}</span>}
                        sx={{ height: '20px', fontSize: '10px' }}
                      />
                      <Chip 
                        label={comment.priority}
                        size="small"
                        sx={{ 
                          height: '20px', 
                          fontSize: '10px',
                          background: getPriorityColor(comment.priority),
                          color: 'white'
                        }}
                      />
                      {comment.formation && (
                        <Chip 
                          label={comment.formation}
                          size="small"
                          variant="outlined"
                          sx={{ height: '20px', fontSize: '10px' }}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {comment.content}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(comment.timestamp)}
                      </Typography>
                      {comment.position && (
                        <Chip 
                          label={`Pos: ${comment.position.x}, ${comment.position.y}`}
                          size="small"
                          variant="outlined"
                          sx={{ height: '16px', fontSize: '8px' }}
                        />
                      )}
                    </Box>

                    {/* Acciones */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        startIcon={<Reply />}
                        onClick={() => {
                          const reply = prompt('Escribe tu respuesta:');
                          if (reply) handleReply(comment.id, reply);
                        }}
                      >
                        Responder
                      </Button>
                      
                      {!comment.isResolved && (
                        <Button 
                          size="small" 
                          color="success"
                          onClick={() => handleResolveComment(comment.id)}
                        >
                          Resolver
                        </Button>
                      )}
                      
                      <Button 
                        size="small" 
                        startIcon={<Edit />}
                        onClick={() => setEditingComment(comment)}
                      >
                        Editar
                      </Button>
                      
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Eliminar
                      </Button>
                    </Box>

                    {/* Respuestas */}
                    {comment.replies.length > 0 && (
                      <Box sx={{ mt: 2, ml: 4 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Respuestas ({comment.replies.length}):
                        </Typography>
                        {comment.replies.map((reply) => (
                          <Paper key={reply.id} sx={{ p: 1, mb: 1, background: '#f9f9f9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Avatar sx={{ width: 20, height: 20, fontSize: '10px' }}>
                                {reply.author.charAt(0)}
                              </Avatar>
                              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                {reply.author}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatTime(reply.timestamp)}
                              </Typography>
                            </Box>
                            <Typography variant="body2">{reply.content}</Typography>
                          </Paper>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={commentsEndRef} />
      </Box>

      {/* Input para Nuevo Comentario */}
      <Paper sx={{ p: 2, borderRadius: '0 0 12px 12px' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            select
            size="small"
            value={commentType}
            onChange={(e) => setCommentType(e.target.value as any)}
            sx={{ minWidth: 120 }}
          >
            <option value="comment">💬 Comentario</option>
            <option value="instruction">📋 Instrucción</option>
            <option value="note">📝 Nota</option>
            <option value="question">❓ Pregunta</option>
          </TextField>
          
          <TextField
            select
            size="small"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            sx={{ minWidth: 100 }}
          >
            <option value="low">🟢 Baja</option>
            <option value="medium">🔵 Media</option>
            <option value="high">🟠 Alta</option>
            <option value="urgent">🔴 Urgente</option>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Escribe tu comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={2}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Tooltip title="Grabar Audio">
              <IconButton 
                size="small" 
                onClick={() => setIsRecording(!isRecording)}
                color={isRecording ? 'error' : 'default'}
              >
                {isRecording ? <MicOff /> : <Mic />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Adjuntar Archivo">
              <IconButton size="small">
                <AttachFile />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A8C 0%, #3DB8AF 100%)'
                }
              }}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Dialog para Editar Comentario */}
      <Dialog open={!!editingComment} onClose={() => setEditingComment(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Comentario</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={editingComment?.content || ''}
            onChange={(e) => setEditingComment(prev => prev ? { ...prev, content: e.target.value } : null)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
                          <Button onClick={() => setEditingComment(null)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (editingComment) {
                setComments(prev => prev.map(comment => 
                  comment.id === editingComment.id ? editingComment : comment
                ));
                setEditingComment(null);
              }
            }}
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollaborationPanel;
