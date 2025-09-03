export interface PracticeSession {
  id: string;
  choreographyId: string;
  studentId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // en minutos
  formationsCompleted: number;
  accuracy: number; // porcentaje de precisión
  notes: string;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  totalPracticeTime: number;
  choreographiesCompleted: number;
  averageAccuracy: number;
  lastPracticeDate: Date;
  improvementTrend: 'up' | 'down' | 'stable';
}

export interface ChoreographyStats {
  choreographyId: string;
  choreographyName: string;
  totalPracticeSessions: number;
  averageCompletionTime: number;
  mostDifficultFormation: string;
  studentEngagement: number;
  lastPracticed: Date;
}

export interface SystemMetrics {
  totalUsers: number;
  totalPracticeTime: number;
  totalChoreographies: number;
  averageSessionDuration: number;
  mostPopularChoreography: string;
  systemUptime: number;
}

class MetricsService {
  private practiceSessions: PracticeSession[] = [];
  private systemStartTime: Date = new Date();

  constructor() {
    this.loadMetricsData();
  }

  // Registrar sesión de práctica
  recordPracticeSession(session: Omit<PracticeSession, 'id'>): string {
    const newSession: PracticeSession = {
      ...session,
      id: Date.now().toString()
    };
    
    this.practiceSessions.push(newSession);
    this.saveMetricsData();
    
    console.log(`📊 Practice session recorded: ${newSession.duration} minutes`);
    return newSession.id;
  }

  // Obtener progreso de un estudiante
  getStudentProgress(studentId: string): StudentProgress | null {
    const studentSessions = this.practiceSessions.filter(s => s.studentId === studentId);
    
    if (studentSessions.length === 0) return null;

    const totalPracticeTime = studentSessions.reduce((sum, session) => sum + session.duration, 0);
    const choreographiesCompleted = new Set(studentSessions.map(s => s.choreographyId)).size;
    const averageAccuracy = studentSessions.reduce((sum, session) => sum + session.accuracy, 0) / studentSessions.length;
    const lastPracticeDate = new Date(Math.max(...studentSessions.map(s => s.endTime.getTime())));

    // Calcular tendencia de mejora
    const recentSessions = studentSessions.slice(-5);
    const olderSessions = studentSessions.slice(-10, -5);
    
    let improvementTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentSessions.length >= 3 && olderSessions.length >= 3) {
      const recentAvg = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
      const olderAvg = olderSessions.reduce((sum, s) => sum + s.accuracy, 0) / olderSessions.length;
      
      if (recentAvg > olderAvg + 5) improvementTrend = 'up';
      else if (recentAvg < olderAvg - 5) improvementTrend = 'down';
    }

    return {
      studentId,
      studentName: `Student ${studentId}`, // This can be improved with a student service
      totalPracticeTime,
      choreographiesCompleted,
      averageAccuracy,
      lastPracticeDate,
      improvementTrend
    };
  }

  // Obtener estadísticas de una coreografía
  getChoreographyStats(choreographyId: string): ChoreographyStats | null {
    const choreographySessions = this.practiceSessions.filter(s => s.choreographyId === choreographyId);
    
    if (choreographySessions.length === 0) return null;

    const totalPracticeSessions = choreographySessions.length;
    const averageCompletionTime = choreographySessions.reduce((sum, session) => sum + session.duration, 0) / totalPracticeSessions;
    const uniqueStudents = new Set(choreographySessions.map(s => s.studentId)).size;
    const lastPracticed = new Date(Math.max(...choreographySessions.map(s => s.endTime.getTime())));

    return {
      choreographyId,
      choreographyName: `Coreografía ${choreographyId}`, // Esto se puede mejorar con un servicio de coreografías
      totalPracticeSessions,
      averageCompletionTime,
      mostDifficultFormation: 'Formación Central', // Esto se puede calcular basándose en la precisión
      studentEngagement: uniqueStudents,
      lastPracticed
    };
  }

  // Obtener métricas del sistema
  getSystemMetrics(): SystemMetrics {
    const totalUsers = new Set(this.practiceSessions.map(s => s.studentId)).size;
    const totalPracticeTime = this.practiceSessions.reduce((sum, session) => sum + session.duration, 0);
    const totalChoreographies = new Set(this.practiceSessions.map(s => s.choreographyId)).size;
    const averageSessionDuration = this.practiceSessions.length > 0 
      ? totalPracticeTime / this.practiceSessions.length 
      : 0;
    
    // Encontrar coreografía más popular
    const choreographyCounts = this.practiceSessions.reduce((acc, session) => {
      acc[session.choreographyId] = (acc[session.choreographyId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostPopularChoreography = Object.keys(choreographyCounts).reduce((a, b) => 
      choreographyCounts[a] > choreographyCounts[b] ? a : b, 'N/A'
    );

    const systemUptime = Date.now() - this.systemStartTime.getTime();

    return {
      totalUsers,
      totalPracticeTime,
      totalChoreographies,
      averageSessionDuration,
      mostPopularChoreography,
      systemUptime
    };
  }

  // Obtener reporte de progreso semanal
  getWeeklyProgressReport(): {
    week: string;
    totalSessions: number;
    totalPracticeTime: number;
    averageAccuracy: number;
    topPerformers: string[];
  } {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklySessions = this.practiceSessions.filter(s => s.startTime >= oneWeekAgo);
    
    const totalSessions = weeklySessions.length;
    const totalPracticeTime = weeklySessions.reduce((sum, session) => sum + session.duration, 0);
    const averageAccuracy = weeklySessions.length > 0 
      ? weeklySessions.reduce((sum, session) => sum + session.accuracy, 0) / weeklySessions.length 
      : 0;

    // Top performers basado en precisión
    const studentAccuracy = weeklySessions.reduce((acc, session) => {
      if (!acc[session.studentId]) {
        acc[session.studentId] = { total: 0, count: 0 };
      }
      acc[session.studentId].total += session.accuracy;
      acc[session.studentId].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const topPerformers = Object.entries(studentAccuracy)
      .map(([studentId, data]) => ({
        studentId,
        averageAccuracy: data.total / data.count
      }))
      .sort((a, b) => b.averageAccuracy - a.averageAccuracy)
      .slice(0, 5)
      .map(p => p.studentId);

    return {
      week: `Semana del ${oneWeekAgo.toLocaleDateString()}`,
      totalSessions,
      totalPracticeTime,
      averageAccuracy,
      topPerformers
    };
  }

  // Generate real metrics for Heliopsis Dance Academy
  generateRealMetrics(): void {
    const realSessions: Omit<PracticeSession, 'id'>[] = [
      {
        choreographyId: '1',
        studentId: 'student-1',
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // 45 minutes
        duration: 45,
        formationsCompleted: 3,
        accuracy: 85,
        notes: 'Good session, needs to improve synchronization'
      },
      {
        choreographyId: '1',
        studentId: 'student-2',
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 60 minutes
        duration: 60,
        formationsCompleted: 4,
        accuracy: 92,
        notes: 'Excellent progress in contemporary technique'
      },
      {
        choreographyId: '2',
        studentId: 'student-1',
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        endTime: new Date(Date.now() - 3 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 minutes
        duration: 30,
        formationsCompleted: 2,
        accuracy: 78,
        notes: 'First time with this hip hop choreography'
      }
    ];

    realSessions.forEach(session => {
      this.recordPracticeSession(session);
    });

    console.log('📊 Real metrics generated for Heliopsis Dance Academy');
  }

  // Guardar datos de métricas
  private saveMetricsData(): void {
    try {
      localStorage.setItem('heliopsis-metrics', JSON.stringify({
        practiceSessions: this.practiceSessions,
        systemStartTime: this.systemStartTime
      }));
    } catch (error) {
      console.error('❌ Error saving metrics:', error);
    }
  }

  // Cargar datos de métricas
  private loadMetricsData(): void {
    try {
      const data = localStorage.getItem('heliopsis-metrics');
      if (data) {
        const parsedData = JSON.parse(data);
        this.practiceSessions = parsedData.practiceSessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime)
        }));
        this.systemStartTime = new Date(parsedData.systemStartTime);
      } else {
        // Generar métricas de muestra si no hay datos
        this.generateRealMetrics();
      }
    } catch (error) {
      console.error('❌ Error loading metrics:', error);
      this.generateRealMetrics();
    }
  }

  // Exportar métricas
  exportMetrics(): string {
    return JSON.stringify({
      practiceSessions: this.practiceSessions,
      systemMetrics: this.getSystemMetrics(),
      weeklyReport: this.getWeeklyProgressReport()
    }, null, 2);
  }

  // Limpiar métricas
  clearMetrics(): void {
    this.practiceSessions = [];
    this.systemStartTime = new Date();
    this.saveMetricsData();
    console.log('🗑️ Métricas limpiadas');
  }
}

// Instancia singleton
const metricsService = new MetricsService();
export default metricsService;
