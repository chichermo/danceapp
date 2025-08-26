export interface FormationSuggestion {
  id: string;
  name: string;
  description: string;
  dancers: Array<{
    id: string;
    x: number;
    y: number;
    z: number;
  }>;
  difficulty: 'easy' | 'medium' | 'hard';
  style: string;
  confidence: number; // 0-1
}

export interface PostureAnalysis {
  dancerId: string;
  issues: Array<{
    type: 'alignment' | 'balance' | 'timing' | 'spacing';
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
  }>;
  overallScore: number; // 0-100
}

export interface ChoreographyOptimization {
  suggestions: Array<{
    type: 'formation' | 'timing' | 'spacing' | 'flow';
    description: string;
    impact: 'low' | 'medium' | 'high';
    implementation: string;
  }>;
  overallImprovement: number; // porcentaje de mejora estimado
}

class AIService {
  private formationTemplates: FormationSuggestion[] = [];
  private postureModels: any = {};

  constructor() {
    this.initializeFormationTemplates();
    this.initializePostureModels();
  }

  // Inicializar plantillas de formaciones
  private initializeFormationTemplates(): void {
    this.formationTemplates = [
      {
        id: 'formation-line',
        name: 'Línea Frontal',
        description: 'Formación clásica en línea horizontal',
        dancers: [
          { id: 'dancer-1', x: 200, y: 300, z: 0 },
          { id: 'dancer-2', x: 300, y: 300, z: 0 },
          { id: 'dancer-3', x: 400, y: 300, z: 0 },
          { id: 'dancer-4', x: 500, y: 300, z: 0 }
        ],
        difficulty: 'easy',
        style: 'classical',
        confidence: 0.95
      },
      {
        id: 'formation-circle',
        name: 'Círculo',
        description: 'Formación circular para movimientos grupales',
        dancers: [
          { id: 'dancer-1', x: 350, y: 200, z: 0 },
          { id: 'dancer-2', x: 450, y: 250, z: 0 },
          { id: 'dancer-3', x: 400, y: 350, z: 0 },
          { id: 'dancer-4', x: 300, y: 350, z: 0 },
          { id: 'dancer-5', x: 250, y: 250, z: 0 }
        ],
        difficulty: 'medium',
        style: 'contemporary',
        confidence: 0.88
      },
      {
        id: 'formation-diamond',
        name: 'Diamante',
        description: 'Formación en diamante para movimientos dinámicos',
        dancers: [
          { id: 'dancer-1', x: 400, y: 200, z: 0 },
          { id: 'dancer-2', x: 500, y: 300, z: 0 },
          { id: 'dancer-3', x: 400, y: 400, z: 0 },
          { id: 'dancer-4', x: 300, y: 300, z: 0 }
        ],
        difficulty: 'medium',
        style: 'modern',
        confidence: 0.92
      },
      {
        id: 'formation-v',
        name: 'Formación V',
        description: 'Formación en V para entradas dramáticas',
        dancers: [
          { id: 'dancer-1', x: 400, y: 150, z: 0 },
          { id: 'dancer-2', x: 350, y: 250, z: 0 },
          { id: 'dancer-3', x: 450, y: 250, z: 0 },
          { id: 'dancer-4', x: 300, y: 350, z: 0 },
          { id: 'dancer-5', x: 500, y: 350, z: 0 }
        ],
        difficulty: 'hard',
        style: 'dramatic',
        confidence: 0.85
      }
    ];
  }

  // Inicializar modelos de postura (simulado)
  private initializePostureModels(): void {
    this.postureModels = {
      alignment: {
        threshold: 0.8,
        weights: { spine: 0.4, shoulders: 0.3, hips: 0.3 }
      },
      balance: {
        threshold: 0.7,
        weights: { centerOfGravity: 0.5, footPlacement: 0.5 }
      },
      timing: {
        threshold: 0.9,
        weights: { beatSync: 0.6, groupSync: 0.4 }
      },
      spacing: {
        threshold: 0.8,
        weights: { distance: 0.7, formation: 0.3 }
      }
    };
  }

  // Sugerir formaciones basadas en contexto
  suggestFormations(context: {
    dancerCount: number;
    style: string;
    difficulty: 'easy' | 'medium' | 'hard';
    currentFormation?: any;
  }): FormationSuggestion[] {
    const { dancerCount, style, difficulty } = context;
    
    return this.formationTemplates
      .filter(formation => {
        const matchesDancerCount = formation.dancers.length <= dancerCount;
        const matchesStyle = formation.style === style || style === 'any';
        const matchesDifficulty = formation.difficulty === difficulty;
        
        return matchesDancerCount && (matchesStyle || matchesDifficulty);
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }

  // Analizar postura de bailarines
  analyzePosture(dancers: Array<{
    id: string;
    x: number;
    y: number;
    z: number;
    rotation?: number;
  }>, musicTempo?: number): PostureAnalysis[] {
    return dancers.map(dancer => {
      const issues = this.detectPostureIssues(dancer, dancers, musicTempo);
      const overallScore = this.calculateOverallScore(issues);
      
      return {
        dancerId: dancer.id,
        issues,
        overallScore
      };
    });
  }

  // Detectar problemas de postura
  private detectPostureIssues(dancer: any, allDancers: any[], musicTempo?: number): Array<{
    type: 'alignment' | 'balance' | 'timing' | 'spacing';
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
  }> {
    const issues = [];

    // Análisis de alineación
    const alignmentScore = this.analyzeAlignment(dancer);
    if (alignmentScore < this.postureModels.alignment.threshold) {
      issues.push({
        type: 'alignment',
        severity: alignmentScore < 0.6 ? 'high' : alignmentScore < 0.8 ? 'medium' : 'low',
        description: 'Problemas de alineación corporal',
        suggestion: 'Mantén la columna vertebral alineada y los hombros nivelados'
      });
    }

    // Análisis de balance
    const balanceScore = this.analyzeBalance(dancer);
    if (balanceScore < this.postureModels.balance.threshold) {
      issues.push({
        type: 'balance',
        severity: balanceScore < 0.5 ? 'high' : balanceScore < 0.7 ? 'medium' : 'low',
        description: 'Problemas de equilibrio',
        suggestion: 'Centra tu peso y mantén una base estable'
      });
    }

    // Análisis de espaciado
    const spacingScore = this.analyzeSpacing(dancer, allDancers);
    if (spacingScore < this.postureModels.spacing.threshold) {
      issues.push({
        type: 'spacing',
        severity: spacingScore < 0.6 ? 'high' : spacingScore < 0.8 ? 'medium' : 'low',
        description: 'Espaciado incorrecto con otros bailarines',
        suggestion: 'Mantén la distancia adecuada con tus compañeros'
      });
    }

    // Análisis de timing (si hay música)
    if (musicTempo) {
      const timingScore = this.analyzeTiming(dancer, musicTempo);
      if (timingScore < this.postureModels.timing.threshold) {
        issues.push({
          type: 'timing',
          severity: timingScore < 0.7 ? 'high' : timingScore < 0.9 ? 'medium' : 'low',
          description: 'Problemas de sincronización con la música',
          suggestion: 'Escucha el ritmo y mantén el tempo'
        });
      }
    }

    return issues;
  }

  // Análisis de alineación (simulado)
  private analyzeAlignment(dancer: any): number {
    // Simular análisis de alineación basado en posición y rotación
    const baseScore = 0.8;
    const rotationPenalty = Math.abs(dancer.rotation || 0) * 0.1;
    return Math.max(0, baseScore - rotationPenalty);
  }

  // Análisis de balance (simulado)
  private analyzeBalance(dancer: any): number {
    // Simular análisis de balance basado en posición
    const centerX = 400; // Centro del escenario
    const centerY = 300;
    const distanceFromCenter = Math.sqrt(
      Math.pow(dancer.x - centerX, 2) + Math.pow(dancer.y - centerY, 2)
    );
    const maxDistance = 200;
    return Math.max(0, 1 - (distanceFromCenter / maxDistance));
  }

  // Análisis de espaciado (simulado)
  private analyzeSpacing(dancer: any, allDancers: any[]): number {
    const minDistance = 50;
    const optimalDistance = 100;
    
    let totalScore = 0;
    let count = 0;
    
    allDancers.forEach(other => {
      if (other.id !== dancer.id) {
        const distance = Math.sqrt(
          Math.pow(dancer.x - other.x, 2) + Math.pow(dancer.y - other.y, 2)
        );
        
        if (distance < minDistance) {
          totalScore += 0.3; // Muy cerca
        } else if (distance > optimalDistance * 2) {
          totalScore += 0.6; // Muy lejos
        } else {
          totalScore += 0.9; // Distancia óptima
        }
        count++;
      }
    });
    
    return count > 0 ? totalScore / count : 1;
  }

  // Análisis de timing (simulado)
  private analyzeTiming(dancer: any, musicTempo: number): number {
    // Simular análisis de timing basado en posición y tempo
    const baseScore = 0.85;
    const tempoVariation = Math.random() * 0.2; // Simular variación
    return Math.max(0, baseScore - tempoVariation);
  }

  // Calcular puntuación general
  private calculateOverallScore(issues: any[]): number {
    if (issues.length === 0) return 100;
    
    const severityWeights = { low: 0.1, medium: 0.3, high: 0.6 };
    const totalPenalty = issues.reduce((sum, issue) => {
      return sum + severityWeights[issue.severity];
    }, 0);
    
    return Math.max(0, 100 - (totalPenalty * 100));
  }

  // Optimizar coreografía
  optimizeChoreography(choreography: {
    formations: any[];
    musicTempo: number;
    style: string;
  }): ChoreographyOptimization {
    const suggestions = [];
    let overallImprovement = 0;

    // Analizar formaciones
    const formationAnalysis = this.analyzeFormations(choreography.formations);
    if (formationAnalysis.score < 0.8) {
      suggestions.push({
        type: 'formation',
        description: 'Mejorar transiciones entre formaciones',
        impact: 'high',
        implementation: 'Agregar formaciones intermedias para transiciones más suaves'
      });
      overallImprovement += 15;
    }

    // Analizar timing
    const timingAnalysis = this.analyzeChoreographyTiming(choreography);
    if (timingAnalysis.score < 0.9) {
      suggestions.push({
        type: 'timing',
        description: 'Optimizar sincronización con la música',
        impact: 'medium',
        implementation: 'Ajustar timestamps de formaciones para mejor sincronización'
      });
      overallImprovement += 10;
    }

    // Analizar espaciado
    const spacingAnalysis = this.analyzeChoreographySpacing(choreography.formations);
    if (spacingAnalysis.score < 0.8) {
      suggestions.push({
        type: 'spacing',
        description: 'Mejorar distribución espacial de bailarines',
        impact: 'medium',
        implementation: 'Ajustar posiciones para mejor uso del espacio'
      });
      overallImprovement += 8;
    }

    return {
      suggestions,
      overallImprovement: Math.min(50, overallImprovement)
    };
  }

  // Analizar formaciones (simulado)
  private analyzeFormations(formations: any[]): { score: number; issues: string[] } {
    const issues = [];
    let score = 1;

    if (formations.length < 2) {
      issues.push('Muy pocas formaciones');
      score -= 0.3;
    }

    // Verificar transiciones
    for (let i = 1; i < formations.length; i++) {
      const prev = formations[i - 1];
      const curr = formations[i];
      
      if (curr.timestamp - prev.timestamp < 5) {
        issues.push('Transiciones muy rápidas');
        score -= 0.1;
      }
    }

    return { score: Math.max(0, score), issues };
  }

  // Analizar timing de coreografía (simulado)
  private analyzeChoreographyTiming(choreography: any): { score: number; issues: string[] } {
    const issues = [];
    let score = 0.9;

    // Simular análisis de timing
    if (choreography.musicTempo < 80 || choreography.musicTempo > 140) {
      issues.push('Tempo fuera del rango óptimo');
      score -= 0.2;
    }

    return { score: Math.max(0, score), issues };
  }

  // Analizar espaciado de coreografía (simulado)
  private analyzeChoreographySpacing(formations: any[]): { score: number; issues: string[] } {
    const issues = [];
    let score = 0.85;

    // Simular análisis de espaciado
    formations.forEach(formation => {
      if (formation.dancers.length > 8) {
        issues.push('Demasiados bailarines en una formación');
        score -= 0.1;
      }
    });

    return { score: Math.max(0, score), issues };
  }

  // Generar sugerencias inteligentes
  generateSmartSuggestions(context: {
    currentFormation: any;
    musicStyle: string;
    dancerCount: number;
    previousFormations: any[];
  }): {
    nextFormation: FormationSuggestion | null;
    improvements: string[];
    warnings: string[];
  } {
    const { currentFormation, musicStyle, dancerCount, previousFormations } = context;
    
    // Sugerir siguiente formación
    const nextFormation = this.suggestFormations({
      dancerCount,
      style: musicStyle,
      difficulty: 'medium'
    })[0] || null;

    // Generar mejoras
    const improvements = [
      'Considera agregar una transición más suave',
      'El espaciado actual es óptimo',
      'La sincronización con la música es buena'
    ];

    // Generar advertencias
    const warnings = [];
    if (previousFormations.length > 5) {
      warnings.push('Demasiadas formaciones pueden confundir a la audiencia');
    }
    if (dancerCount > 10) {
      warnings.push('Con muchos bailarines, considera formaciones más simples');
    }

    return {
      nextFormation,
      improvements,
      warnings
    };
  }
}

// Instancia singleton
const aiService = new AIService();
export default aiService;
