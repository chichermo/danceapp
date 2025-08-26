export interface UserBehavior {
  userId: string;
  sessionId: string;
  timestamp: Date;
  action: string;
  component: string;
  metadata: any;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  componentRenderTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorRate: number;
}

export interface UsageAnalytics {
  totalUsers: number;
  activeUsers: number;
  sessionDuration: number;
  pageViews: number;
  featureUsage: { [key: string]: number };
  userRetention: number;
}

export interface ChoreographyAnalytics {
  choreographyId: string;
  views: number;
  completions: number;
  averageTime: number;
  dropOffPoints: Array<{ time: number; percentage: number }>;
  userFeedback: Array<{ rating: number; comment: string }>;
  sharingCount: number;
}

export interface HeatmapData {
  component: string;
  interactions: Array<{
    x: number;
    y: number;
    intensity: number;
    timestamp: Date;
  }>;
}

class AnalyticsService {
  private events: UserBehavior[] = [];
  private performanceMetrics: PerformanceMetrics[] = [];
  private sessionStartTime: Date = new Date();
  private currentSessionId: string = this.generateSessionId();

  constructor() {
    this.initializeAnalytics();
    this.startPerformanceMonitoring();
  }

  // Inicializar analytics
  private initializeAnalytics(): void {
    // Configurar listeners de eventos globales
    this.setupEventListeners();
    
    // Configurar monitoreo de rendimiento
    this.setupPerformanceMonitoring();
    
    // Configurar tracking de errores
    this.setupErrorTracking();
  }

  // Configurar listeners de eventos
  private setupEventListeners(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      this.trackEvent('click', 'document', {
        target: (event.target as HTMLElement)?.tagName,
        className: (event.target as HTMLElement)?.className,
        id: (event.target as HTMLElement)?.id
      });
    });

    // Track scroll
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackEvent('scroll', 'window', {
          scrollY: window.scrollY,
          scrollX: window.scrollX
        });
      }, 100);
    });

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', 'document', {
        hidden: document.hidden
      });
    });
  }

  // Configurar monitoreo de rendimiento
  private setupPerformanceMonitoring(): void {
    // Monitorear Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformance('lcp', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.trackPerformance('fid', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        this.trackPerformance('cls', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Configurar tracking de errores
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackEvent('error', 'window', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandled_promise_rejection', 'window', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  // Iniciar monitoreo de rendimiento
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      this.collectPerformanceMetrics();
    }, 30000); // Cada 30 segundos
  }

  // Recopilar métricas de rendimiento
  private collectPerformanceMetrics(): void {
    const metrics: PerformanceMetrics = {
      pageLoadTime: performance.now(),
      componentRenderTime: 0, // Se actualizará por componente
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      networkLatency: 0, // Se calculará basándose en requests
      errorRate: this.calculateErrorRate()
    };

    this.performanceMetrics.push(metrics);
    
    // Mantener solo las últimas 100 métricas
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }
  }

  // Calcular tasa de errores
  private calculateErrorRate(): number {
    const errorEvents = this.events.filter(e => e.action === 'error');
    const totalEvents = this.events.length;
    return totalEvents > 0 ? (errorEvents.length / totalEvents) * 100 : 0;
  }

  // Generar ID de sesión
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Trackear evento
  trackEvent(action: string, component: string, metadata: any = {}): void {
    const event: UserBehavior = {
      userId: 'current-user', // En una app real, esto vendría del sistema de autenticación
      sessionId: this.currentSessionId,
      timestamp: new Date(),
      action,
      component,
      metadata
    };

    this.events.push(event);
    
    // Mantener solo los últimos 1000 eventos
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    console.log('📊 Event tracked:', event);
  }

  // Trackear rendimiento
  trackPerformance(metric: string, value: number): void {
    this.trackEvent('performance', 'system', {
      metric,
      value,
      timestamp: Date.now()
    });
  }

  // Trackear uso de funcionalidad
  trackFeatureUsage(feature: string, action: string, metadata: any = {}): void {
    this.trackEvent('feature_usage', feature, {
      action,
      ...metadata
    });
  }

  // Trackear tiempo de sesión
  trackSessionDuration(): number {
    const duration = Date.now() - this.sessionStartTime.getTime();
    this.trackEvent('session_end', 'system', {
      duration: duration,
      sessionId: this.currentSessionId
    });
    return duration;
  }

  // Obtener analytics de uso
  getUsageAnalytics(): UsageAnalytics {
    const uniqueUsers = new Set(this.events.map(e => e.userId)).size;
    const activeUsers = new Set(
      this.events
        .filter(e => Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000) // Últimas 24 horas
        .map(e => e.userId)
    ).size;

    const featureUsage: { [key: string]: number } = {};
    this.events
      .filter(e => e.action === 'feature_usage')
      .forEach(e => {
        featureUsage[e.component] = (featureUsage[e.component] || 0) + 1;
      });

    const sessionDurations = this.events
      .filter(e => e.action === 'session_end')
      .map(e => e.metadata.duration);

    const averageSessionDuration = sessionDurations.length > 0
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
      : 0;

    return {
      totalUsers: uniqueUsers,
      activeUsers,
      sessionDuration: averageSessionDuration,
      pageViews: this.events.filter(e => e.action === 'page_view').length,
      featureUsage,
      userRetention: this.calculateUserRetention()
    };
  }

  // Calcular retención de usuarios
  private calculateUserRetention(): number {
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);

    const usersLastWeek = new Set(
      this.events
        .filter(e => e.timestamp.getTime() > oneWeekAgo)
        .map(e => e.userId)
    );

    const usersTwoWeeksAgo = new Set(
      this.events
        .filter(e => e.timestamp.getTime() > twoWeeksAgo && e.timestamp.getTime() <= oneWeekAgo)
        .map(e => e.userId)
    );

    const retainedUsers = Array.from(usersLastWeek).filter(userId => 
      usersTwoWeeksAgo.has(userId)
    ).length;

    return usersTwoWeeksAgo.size > 0 ? (retainedUsers / usersTwoWeeksAgo.size) * 100 : 0;
  }

  // Obtener analytics de coreografía
  getChoreographyAnalytics(choreographyId: string): ChoreographyAnalytics {
    const choreographyEvents = this.events.filter(e => 
      e.metadata.choreographyId === choreographyId
    );

    const views = choreographyEvents.filter(e => e.action === 'view').length;
    const completions = choreographyEvents.filter(e => e.action === 'complete').length;
    
    const completionTimes = choreographyEvents
      .filter(e => e.action === 'complete')
      .map(e => e.metadata.duration || 0);

    const averageTime = completionTimes.length > 0
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0;

    const dropOffPoints = this.calculateDropOffPoints(choreographyEvents);
    const userFeedback = this.getUserFeedback(choreographyId);
    const sharingCount = choreographyEvents.filter(e => e.action === 'share').length;

    return {
      choreographyId,
      views,
      completions,
      averageTime,
      dropOffPoints,
      userFeedback,
      sharingCount
    };
  }

  // Calcular puntos de abandono
  private calculateDropOffPoints(events: UserBehavior[]): Array<{ time: number; percentage: number }> {
    const timePoints = [0, 30, 60, 120, 180, 300]; // en segundos
    const dropOffPoints = [];

    for (const timePoint of timePoints) {
      const usersAtTime = events.filter(e => 
        e.metadata.timestamp <= timePoint
      ).length;
      
      const totalUsers = events.length;
      const percentage = totalUsers > 0 ? (usersAtTime / totalUsers) * 100 : 0;
      
      dropOffPoints.push({
        time: timePoint,
        percentage: 100 - percentage
      });
    }

    return dropOffPoints;
  }

  // Obtener feedback de usuarios
  private getUserFeedback(choreographyId: string): Array<{ rating: number; comment: string }> {
    return this.events
      .filter(e => e.action === 'feedback' && e.metadata.choreographyId === choreographyId)
      .map(e => ({
        rating: e.metadata.rating || 0,
        comment: e.metadata.comment || ''
      }));
  }

  // Obtener datos de heatmap
  getHeatmapData(component: string): HeatmapData {
    const componentEvents = this.events.filter(e => 
      e.component === component && e.action === 'click'
    );

    const interactions = componentEvents.map(e => ({
      x: e.metadata.x || 0,
      y: e.metadata.y || 0,
      intensity: 1,
      timestamp: e.timestamp
    }));

    return {
      component,
      interactions
    };
  }

  // Obtener métricas de rendimiento
  getPerformanceMetrics(): PerformanceMetrics[] {
    return [...this.performanceMetrics];
  }

  // Obtener eventos recientes
  getRecentEvents(limit: number = 50): UserBehavior[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Exportar datos de analytics
  exportAnalytics(): string {
    const data = {
      events: this.events,
      performanceMetrics: this.performanceMetrics,
      usageAnalytics: this.getUsageAnalytics(),
      sessionId: this.currentSessionId,
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  // Limpiar datos antiguos
  cleanupOldData(): void {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    this.events = this.events.filter(e => e.timestamp > oneWeekAgo);
    this.performanceMetrics = this.performanceMetrics.filter(m => 
      new Date(m.pageLoadTime) > oneWeekAgo
    );
  }

  // Generar reporte de analytics
  generateReport(): {
    summary: UsageAnalytics;
    topFeatures: Array<{ feature: string; usage: number }>;
    performanceSummary: {
      averageLoadTime: number;
      averageMemoryUsage: number;
      errorRate: number;
    };
    recommendations: string[];
  } {
    const usageAnalytics = this.getUsageAnalytics();
    const performanceMetrics = this.getPerformanceMetrics();

    const topFeatures = Object.entries(usageAnalytics.featureUsage)
      .map(([feature, usage]) => ({ feature, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);

    const averageLoadTime = performanceMetrics.length > 0
      ? performanceMetrics.reduce((sum, m) => sum + m.pageLoadTime, 0) / performanceMetrics.length
      : 0;

    const averageMemoryUsage = performanceMetrics.length > 0
      ? performanceMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / performanceMetrics.length
      : 0;

    const errorRate = performanceMetrics.length > 0
      ? performanceMetrics.reduce((sum, m) => sum + m.errorRate, 0) / performanceMetrics.length
      : 0;

    const recommendations = this.generateRecommendations(usageAnalytics, performanceMetrics);

    return {
      summary: usageAnalytics,
      topFeatures,
      performanceSummary: {
        averageLoadTime,
        averageMemoryUsage,
        errorRate
      },
      recommendations
    };
  }

  // Generar recomendaciones
  private generateRecommendations(usage: UsageAnalytics, performance: PerformanceMetrics[]): string[] {
    const recommendations = [];

    if (usage.userRetention < 70) {
      recommendations.push('Mejorar la retención de usuarios implementando notificaciones push y recordatorios');
    }

    if (performance.length > 0) {
      const avgLoadTime = performance.reduce((sum, p) => sum + p.pageLoadTime, 0) / performance.length;
      if (avgLoadTime > 3000) {
        recommendations.push('Optimizar el tiempo de carga implementando lazy loading y compresión de assets');
      }
    }

    if (usage.activeUsers < usage.totalUsers * 0.3) {
      recommendations.push('Implementar gamificación para aumentar la participación de usuarios');
    }

    return recommendations;
  }
}

// Instancia singleton
const analyticsService = new AnalyticsService();
export default analyticsService;
