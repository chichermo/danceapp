export interface RealtimeEvent {
  id: string;
  type: 'formation_update' | 'dancer_move' | 'comment' | 'user_join' | 'user_leave' | 'sync_request' | 'connection' | 'heartbeat' | 'conflict_resolved';
  data: any;
  timestamp: Date;
  userId: string;
  sessionId: string;
}

export interface CollaborationSession {
  id: string;
  name: string;
  participants: Array<{
    userId: string;
    name: string;
    avatar?: string;
    role: 'owner' | 'collaborator' | 'viewer';
    lastSeen: Date;
  }>;
  choreographyId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface SyncState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
  conflicts: Array<{
    id: string;
    type: string;
    localData: any;
    remoteData: any;
    timestamp: Date;
  }>;
}

class RealtimeService {
  private ws: WebSocket | null = null;
  private eventListeners: Map<string, Array<(event: RealtimeEvent) => void>> = new Map();
  private syncState: SyncState = {
    isConnected: false,
    isSyncing: false,
    lastSyncTime: null,
    pendingChanges: 0,
    conflicts: []
  };
  private currentSession: CollaborationSession | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeWebSocket();
  }

  // Inicializar WebSocket
  private initializeWebSocket(): void {
    try {
      // Simular conexión WebSocket (en una app real sería una URL real)
      this.simulateWebSocketConnection();
    } catch (error) {
      console.error('Error al inicializar WebSocket:', error);
    }
  }

  // Simular conexión WebSocket
  private simulateWebSocketConnection(): void {
    // Simular conexión exitosa
    setTimeout(() => {
      this.syncState.isConnected = true;
      this.syncState.lastSyncTime = new Date();
      this.startHeartbeat();
      this.notifyListeners('connection', {
        id: `connection-${Date.now()}`,
        type: 'connection',
        data: { status: 'connected' },
        timestamp: new Date(),
        userId: 'current-user',
        sessionId: 'current-session'
      });
    }, 1000);
  }

  // Iniciar heartbeat
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.syncState.isConnected) {
        this.sendEvent({
          type: 'heartbeat',
          data: { timestamp: Date.now() },
          userId: 'current-user',
          sessionId: 'current-session'
        });
      }
    }, 30000); // Cada 30 segundos
  }

  // Detener heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Enviar evento
  sendEvent(event: Omit<RealtimeEvent, 'id' | 'timestamp'>): void {
    if (!this.syncState.isConnected) {
      console.warn('No hay conexión WebSocket activa');
      return;
    }

    const fullEvent: RealtimeEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // Simular envío de evento
    this.simulateEventSend(fullEvent);
  }

  // Simular envío de evento
  private simulateEventSend(event: RealtimeEvent): void {
    // Simular delay de red
    setTimeout(() => {
      // Simular recepción del evento por otros clientes
      this.handleIncomingEvent(event);
    }, 100);
  }

  // Manejar evento entrante
  private handleIncomingEvent(event: RealtimeEvent): void {
    // No procesar eventos propios
    if (event.userId === 'current-user') {
      return;
    }

    this.notifyListeners(event.type, event);
  }

  // Suscribirse a eventos
  subscribe(eventType: string, callback: (event: RealtimeEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    
    this.eventListeners.get(eventType)!.push(callback);
    
    // Devolver función de desuscripción
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Notificar listeners
  private notifyListeners(eventType: string, event: RealtimeEvent): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error en listener de evento:', error);
        }
      });
    }
  }

  // Crear sesión de colaboración
  async createCollaborationSession(choreographyId: string, name: string): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: `session-${Date.now()}`,
      name,
      participants: [{
        userId: 'current-user',
        name: 'Usuario Actual',
        role: 'owner',
        lastSeen: new Date()
      }],
      choreographyId,
      isActive: true,
      createdAt: new Date()
    };

    this.currentSession = session;
    
    // Simular creación de sesión
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return session;
  }

  // Unirse a sesión de colaboración
  async joinCollaborationSession(sessionId: string): Promise<CollaborationSession | null> {
    // Simular unirse a sesión
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular sesión existente
    const session: CollaborationSession = {
      id: sessionId,
      name: 'Sesión de Colaboración',
      participants: [
        {
          userId: 'user-1',
          name: 'Usuario 1',
          role: 'owner',
          lastSeen: new Date()
        },
        {
          userId: 'current-user',
          name: 'Usuario Actual',
          role: 'collaborator',
          lastSeen: new Date()
        }
      ],
      choreographyId: 'choreography-1',
      isActive: true,
      createdAt: new Date()
    };

    this.currentSession = session;
    return session;
  }

  // Sincronizar formación
  syncFormation(formationData: any): void {
    this.sendEvent({
      type: 'formation_update',
      data: formationData,
      userId: 'current-user',
      sessionId: this.currentSession?.id || 'default'
    });
  }

  // Sincronizar movimiento de bailarín
  syncDancerMove(dancerId: string, position: { x: number; y: number; z: number }): void {
    this.sendEvent({
      type: 'dancer_move',
      data: { dancerId, position },
      userId: 'current-user',
      sessionId: this.currentSession?.id || 'default'
    });
  }

  // Sincronizar comentario
  syncComment(comment: { id: string; content: string; timestamp: number; position?: { x: number; y: number } }): void {
    this.sendEvent({
      type: 'comment',
      data: comment,
      userId: 'current-user',
      sessionId: this.currentSession?.id || 'default'
    });
  }

  // Solicitar sincronización
  requestSync(): void {
    this.sendEvent({
      type: 'sync_request',
      data: { timestamp: Date.now() },
      userId: 'current-user',
      sessionId: this.currentSession?.id || 'default'
    });
  }

  // Obtener estado de sincronización
  getSyncState(): SyncState {
    return { ...this.syncState };
  }

  // Obtener sesión actual
  getCurrentSession(): CollaborationSession | null {
    return this.currentSession;
  }

  // Verificar si está conectado
  isConnected(): boolean {
    return this.syncState.isConnected;
  }

  // Desconectar
  disconnect(): void {
    this.stopHeartbeat();
    this.syncState.isConnected = false;
    this.currentSession = null;
    this.eventListeners.clear();
  }

  // Reconectar
  async reconnect(): Promise<boolean> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Máximo número de intentos de reconexión alcanzado');
      return false;
    }

    this.reconnectAttempts++;
    console.log(`Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    // Simular delay de reconexión
    await new Promise(resolve => setTimeout(resolve, this.reconnectDelay * this.reconnectAttempts));

    try {
      this.initializeWebSocket();
      this.reconnectAttempts = 0;
      return true;
    } catch (error) {
      console.error('Error al reconectar:', error);
      return false;
    }
  }

  // Resolver conflicto
  resolveConflict(conflictId: string, resolution: 'local' | 'remote' | 'merge'): void {
    const conflictIndex = this.syncState.conflicts.findIndex(c => c.id === conflictId);
    if (conflictIndex > -1) {
      this.syncState.conflicts.splice(conflictIndex, 1);
      
      // Simular resolución de conflicto
      this.sendEvent({
        type: 'conflict_resolved',
        data: { conflictId, resolution },
        userId: 'current-user',
        sessionId: this.currentSession?.id || 'default'
      });
    }
  }

  // Obtener estadísticas de conexión
  getConnectionStats(): {
    isConnected: boolean;
    uptime: number;
    eventsSent: number;
    eventsReceived: number;
    lastEventTime: Date | null;
  } {
    return {
      isConnected: this.syncState.isConnected,
      uptime: this.syncState.lastSyncTime ? Date.now() - this.syncState.lastSyncTime.getTime() : 0,
      eventsSent: 0, // Se implementaría con contadores reales
      eventsReceived: 0,
      lastEventTime: this.syncState.lastSyncTime
    };
  }

  // Simular eventos de otros usuarios
  simulateUserActivity(): void {
    if (!this.syncState.isConnected) return;

    // Simular movimiento de bailarín
    setTimeout(() => {
      this.handleIncomingEvent({
        id: `event-${Date.now()}`,
        type: 'dancer_move',
        data: {
          dancerId: 'dancer-1',
          position: { x: Math.random() * 400, y: Math.random() * 300, z: 0 }
        },
        timestamp: new Date(),
        userId: 'user-2',
        sessionId: this.currentSession?.id || 'default'
      });
    }, 5000);

    // Simular comentario
    setTimeout(() => {
      this.handleIncomingEvent({
        id: `event-${Date.now()}`,
        type: 'comment',
        data: {
          id: `comment-${Date.now()}`,
          content: '¡Excelente movimiento!',
          timestamp: Date.now(),
          position: { x: 200, y: 150 }
        },
        timestamp: new Date(),
        userId: 'user-3',
        sessionId: this.currentSession?.id || 'default'
      });
    }, 10000);
  }
}

// Instancia singleton
const realtimeService = new RealtimeService();
export default realtimeService;
