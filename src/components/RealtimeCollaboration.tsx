import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  TextField,
  Alert,
  LinearProgress,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  People,
  Add,
  Close,
  Wifi,
  WifiOff,
  Sync,
  SyncProblem,
  Chat,
  PersonAdd,
  Settings,
  PlayArrow,
  Pause,
  Stop,
  Refresh
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import realtimeService, { RealtimeEvent, CollaborationSession, SyncState } from '../services/RealtimeService';

interface RealtimeCollaborationProps {
  open: boolean;
  onClose: () => void;
  onFormationUpdate?: (data: any) => void;
  onDancerMove?: (dancerId: string, position: any) => void;
  onComment?: (comment: any) => void;
}

const RealtimeCollaboration: React.FC<RealtimeCollaborationProps> = ({
  open,
  onClose,
  onFormationUpdate,
  onDancerMove,
  onComment
}) => {
  const [syncState, setSyncState] = useState<SyncState>(realtimeService.getSyncState());
  const [currentSession, setCurrentSession] = useState<CollaborationSession | null>(null);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showJoinSession, setShowJoinSession] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [newComment, setNewComment] = useState('');
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (open) {
      // Suscribirse a eventos de sincronización
      const unsubscribeSync = realtimeService.subscribe('sync_request', handleSyncEvent);
      const unsubscribeFormation = realtimeService.subscribe('formation_update', handleFormationEvent);
      const unsubscribeDancer = realtimeService.subscribe('dancer_move', handleDancerEvent);
      const unsubscribeComment = realtimeService.subscribe('comment', handleCommentEvent);
      const unsubscribeConnection = realtimeService.subscribe('connection', handleConnectionEvent);

      // Actualizar estado inicial
      updateSyncState();

      return () => {
        unsubscribeSync();
        unsubscribeFormation();
        unsubscribeDancer();
        unsubscribeComment();
        unsubscribeConnection();
      };
    }
  }, [open]);

  const updateSyncState = () => {
    setSyncState(realtimeService.getSyncState());
    setCurrentSession(realtimeService.getCurrentSession());
  };

  const handleSyncEvent = (event: RealtimeEvent) => {
    setRecentEvents(prev => [event, ...prev.slice(0, 9)]); // Mantener últimos 10 eventos
  };

  const handleFormationEvent = (event: RealtimeEvent) => {
    setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
    onFormationUpdate?.(event.data);
  };

  const handleDancerEvent = (event: RealtimeEvent) => {
    setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
    onDancerMove?.(event.data.dancerId, event.data.position);
  };

  const handleCommentEvent = (event: RealtimeEvent) => {
    setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
    onComment?.(event.data);
  };

  const handleConnectionEvent = (event: RealtimeEvent) => {
    updateSyncState();
  };

  const createSession = async () => {
    if (!sessionName.trim()) return;

    try {
      const session = await realtimeService.createCollaborationSession('choreography-1', sessionName);
      setCurrentSession(session);
      setShowCreateSession(false);
      setSessionName('');
    } catch (error) {
      console.error('Error al crear sesión:', error);
    }
  };

  const joinSession = async () => {
    if (!sessionId.trim()) return;

    try {
      const session = await realtimeService.joinCollaborationSession(sessionId);
      if (session) {
        setCurrentSession(session);
        setShowJoinSession(false);
        setSessionId('');
      }
    } catch (error) {
      console.error('Error al unirse a sesión:', error);
    }
  };

  const leaveSession = () => {
    realtimeService.disconnect();
    setCurrentSession(null);
    setRecentEvents([]);
  };

  const sendComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      timestamp: Date.now()
    };

    realtimeService.syncComment(comment);
    setNewComment('');
  };

  const requestSync = () => {
    realtimeService.requestSync();
  };

  const simulateActivity = () => {
    setIsSimulating(true);
    realtimeService.simulateUserActivity();
    
    setTimeout(() => {
      setIsSimulating(false);
    }, 15000);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'formation_update': return '🎭';
      case 'dancer_move': return '👤';
      case 'comment': return '💬';
      case 'user_join': return '➕';
      case 'user_leave': return '➖';
      case 'sync_request': return '🔄';
      default: return '📝';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'formation_update': return 'primary';
      case 'dancer_move': return 'success';
      case 'comment': return 'info';
      case 'user_join': return 'success';
      case 'user_leave': return 'warning';
      case 'sync_request': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <People sx={{ mr: 1, color: 'primary.main' }} />
          Colaboración en Tiempo Real
          <Chip
            icon={syncState.isConnected ? <Wifi /> : <WifiOff />}
            label={syncState.isConnected ? 'Conectado' : 'Desconectado'}
            color={syncState.isConnected ? 'success' : 'error'}
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Estado de Sincronización */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Sync sx={{ mr: 1 }} />
                Estado de Sincronización
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip
                  label={`Última sincronización: ${syncState.lastSyncTime ? syncState.lastSyncTime.toLocaleTimeString() : 'Nunca'}`}
                  variant="outlined"
                />
                <Chip
                  label={`Cambios pendientes: ${syncState.pendingChanges}`}
                  color={syncState.pendingChanges > 0 ? 'warning' : 'success'}
                />
                <Chip
                  label={`Conflictos: ${syncState.conflicts.length}`}
                  color={syncState.conflicts.length > 0 ? 'error' : 'success'}
                />
              </Box>

              {syncState.isSyncing && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Sincronizando...
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={requestSync}
                  disabled={!syncState.isConnected}
                >
                  Sincronizar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PlayArrow />}
                  onClick={simulateActivity}
                  disabled={isSimulating || !syncState.isConnected}
                >
                  {isSimulating ? 'Simulando...' : 'Simular Actividad'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Sesión de Colaboración */}
          {currentSession ? (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Sesión: {currentSession.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={leaveSession}
                    startIcon={<Stop />}
                  >
                    Salir
                  </Button>
                </Box>

                {/* Participantes */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Participantes ({currentSession.participants.length})
                </Typography>
                <List dense>
                  {currentSession.participants.map((participant, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar src={participant.avatar}>
                          {participant.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={participant.name}
                        secondary={`${participant.role} • Última vez: ${participant.lastSeen.toLocaleTimeString()}`}
                      />
                      <Chip
                        label={participant.role}
                        size="small"
                        color={participant.role === 'owner' ? 'primary' : 'default'}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Comentarios */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Comentarios
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    size="small"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendComment();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={sendComment}
                    disabled={!newComment.trim()}
                    startIcon={<Chat />}
                  >
                    Enviar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Crear o Unirse a una Sesión
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowCreateSession(true)}
                    disabled={!syncState.isConnected}
                  >
                    Crear Sesión
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={() => setShowJoinSession(true)}
                    disabled={!syncState.isConnected}
                  >
                    Unirse a Sesión
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Eventos Recientes */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Badge badgeContent={recentEvents.length} color="primary">
                  <Settings />
                </Badge>
                <Typography sx={{ ml: 1 }}>Actividad Reciente</Typography>
              </Typography>
              
              {recentEvents.length > 0 ? (
                <List dense>
                  <AnimatePresence>
                    {recentEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>{getEventIcon(event.type)}</span>
                                <Typography variant="body2">
                                  {event.type.replace('_', ' ')}
                                </Typography>
                                <Chip
                                  label={event.userId}
                                  size="small"
                                  color={getEventColor(event.type)}
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  {event.timestamp.toLocaleTimeString()}
                                </Typography>
                                {event.data && (
                                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {typeof event.data === 'string' ? event.data : JSON.stringify(event.data)}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </List>
              ) : (
                <Alert severity="info">
                  No hay actividad reciente
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      {/* Dialog para crear sesión */}
      <Dialog open={showCreateSession} onClose={() => setShowCreateSession(false)}>
        <DialogTitle>Crear Sesión de Colaboración</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre de la sesión"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateSession(false)}>Cancelar</Button>
          <Button onClick={createSession} variant="contained" disabled={!sessionName.trim()}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para unirse a sesión */}
      <Dialog open={showJoinSession} onClose={() => setShowJoinSession(false)}>
        <DialogTitle>Unirse a Sesión</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ID de la sesión"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJoinSession(false)}>Cancelar</Button>
          <Button onClick={joinSession} variant="contained" disabled={!sessionId.trim()}>
            Unirse
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

export default RealtimeCollaboration;
