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

  // Initialize formation templates
  private initializeFormationTemplates(): void {
    this.formationTemplates = [
      {
        id: 'formation-line',
        name: 'Front Line',
        description: 'Classic formation in horizontal line',
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
        name: 'Circle',
        description: 'Circular formation for group movements',
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
        name: 'Diamond',
        description: 'Diamond formation for dynamic movements',
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
        name: 'V Formation',
        description: 'V formation for dramatic entrances',
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

  // Initialize posture models (simulated)
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

  // Suggest formations based on context
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
    const issues: Array<{
      type: 'alignment' | 'balance' | 'timing' | 'spacing';
      severity: 'low' | 'medium' | 'high';
      description: string;
      suggestion: string;
    }> = [];

    // Alignment analysis
    const alignmentScore = this.analyzeAlignment(dancer);
    if (alignmentScore < this.postureModels.alignment.threshold) {
      issues.push({
        type: 'alignment',
        severity: alignmentScore < 0.6 ? 'high' : alignmentScore < 0.8 ? 'medium' : 'low',
        description: 'Body alignment problems',
        suggestion: 'Keep your spine aligned and shoulders level'
      });
    }

    // Balance analysis
    const balanceScore = this.analyzeBalance(dancer);
    if (balanceScore < this.postureModels.balance.threshold) {
      issues.push({
        type: 'balance',
        severity: balanceScore < 0.5 ? 'high' : balanceScore < 0.7 ? 'medium' : 'low',
        description: 'Balance problems',
        suggestion: 'Center your weight and maintain a stable base'
      });
    }

    // Spacing analysis
    const spacingScore = this.analyzeSpacing(dancer, allDancers);
    if (spacingScore < this.postureModels.spacing.threshold) {
      issues.push({
        type: 'spacing',
        severity: spacingScore < 0.6 ? 'high' : spacingScore < 0.8 ? 'medium' : 'low',
        description: 'Incorrect spacing with other dancers',
        suggestion: 'Maintain proper distance with your partners'
      });
    }

    // Timing analysis (if there is music)
    if (musicTempo) {
      const timingScore = this.analyzeTiming(dancer, musicTempo);
      if (timingScore < this.postureModels.timing.threshold) {
        issues.push({
          type: 'timing',
          severity: timingScore < 0.7 ? 'high' : timingScore < 0.9 ? 'medium' : 'low',
                  description: 'Music synchronization problems',
        suggestion: 'Listen to the rhythm and maintain tempo'
        });
      }
    }

    return issues;
  }

  // Alignment analysis (simulated)
  private analyzeAlignment(dancer: any): number {
    // Simulate alignment analysis based on position and rotation
    const baseScore = 0.8;
    const rotationPenalty = Math.abs(dancer.rotation || 0) * 0.1;
    return Math.max(0, baseScore - rotationPenalty);
  }

  // Balance analysis (simulated)
  private analyzeBalance(dancer: any): number {
    // Simulate balance analysis based on position
    const centerX = 400; // Stage center
    const centerY = 300;
    const distanceFromCenter = Math.sqrt(
      Math.pow(dancer.x - centerX, 2) + Math.pow(dancer.y - centerY, 2)
    );
    const maxDistance = 200;
    return Math.max(0, 1 - (distanceFromCenter / maxDistance));
  }

  // Spacing analysis (simulated)
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
          totalScore += 0.3; // Too close
        } else if (distance > optimalDistance * 2) {
          totalScore += 0.6; // Too far
        } else {
          totalScore += 0.9; // Optimal distance
        }
        count++;
      }
    });
    
    return count > 0 ? totalScore / count : 1;
  }

  // Timing analysis (simulated)
  private analyzeTiming(dancer: any, musicTempo: number): number {
    // Simulate timing analysis based on position and tempo
    const baseScore = 0.85;
    const tempoVariation = Math.random() * 0.2; // Simulate variation
    return Math.max(0, baseScore - tempoVariation);
  }

  // Calculate overall score
  private calculateOverallScore(issues: Array<{
    type: 'alignment' | 'balance' | 'timing' | 'spacing';
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
  }>): number {
    if (issues.length === 0) return 100;
    
    const severityWeights: { [key: string]: number } = { low: 0.1, medium: 0.3, high: 0.6 };
    const totalPenalty = issues.reduce((sum, issue) => {
      return sum + (severityWeights[issue.severity] || 0);
    }, 0);
    
    return Math.max(0, 100 - (totalPenalty * 100));
  }

  // Optimize choreography
  optimizeChoreography(choreography: {
    formations: any[];
    musicTempo: number;
    style: string;
  }): ChoreographyOptimization {
    const suggestions: Array<{
      type: 'timing' | 'spacing' | 'formation' | 'flow';
      description: string;
      impact: 'low' | 'medium' | 'high';
      implementation: string;
    }> = [];
    let overallImprovement = 0;

    // Analyze formations
    const formationAnalysis = this.analyzeFormations(choreography.formations);
    if (formationAnalysis.score < 0.8) {
      suggestions.push({
        type: 'formation',
        description: 'Improve transitions between formations',
        impact: 'high',
        implementation: 'Add intermediate formations for smoother transitions'
      });
      overallImprovement += 15;
    }

    // Analyze timing
    const timingAnalysis = this.analyzeChoreographyTiming(choreography);
    if (timingAnalysis.score < 0.9) {
      suggestions.push({
        type: 'timing',
        description: 'Optimize music synchronization',
        impact: 'medium',
        implementation: 'Adjust formation timestamps for better synchronization'
      });
      overallImprovement += 10;
    }

    // Analyze spacing
    const spacingAnalysis = this.analyzeChoreographySpacing(choreography.formations);
    if (spacingAnalysis.score < 0.8) {
      suggestions.push({
        type: 'spacing',
        description: 'Improve spatial distribution of dancers',
        impact: 'medium',
        implementation: 'Adjust positions for better space usage'
      });
      overallImprovement += 8;
    }

    return {
      suggestions,
      overallImprovement: Math.min(50, overallImprovement)
    };
  }

  // Analyze formations (simulated)
  private analyzeFormations(formations: any[]): { score: number; issues: string[] } {
    const issues = [];
    let score = 1;

    if (formations.length < 2) {
      issues.push('Too few formations');
      score -= 0.3;
    }

    // Check transitions
    for (let i = 1; i < formations.length; i++) {
      const prev = formations[i - 1];
      const curr = formations[i];
      
      if (curr.timestamp - prev.timestamp < 5) {
        issues.push('Transitions too fast');
        score -= 0.1;
      }
    }

    return { score: Math.max(0, score), issues };
  }

  // Analyze choreography timing (simulated)
  private analyzeChoreographyTiming(choreography: any): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 0.9;

    // Simulate timing analysis
    if (choreography.musicTempo < 80 || choreography.musicTempo > 140) {
      issues.push('Tempo outside optimal range');
      score -= 0.2;
    }

    return { score: Math.max(0, score), issues };
  }

  // Analyze choreography spacing (simulated)
  private analyzeChoreographySpacing(formations: any[]): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 0.85;

    // Simulate spacing analysis
    formations.forEach(formation => {
      if (formation.dancers.length > 8) {
        issues.push('Too many dancers in one formation');
        score -= 0.1;
      }
    });

    return { score: Math.max(0, score), issues };
  }

  // Generate smart suggestions
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
    
    // Suggest next formation
    const nextFormation = this.suggestFormations({
      dancerCount,
      style: musicStyle,
      difficulty: 'medium'
    })[0] || null;

    // Generate improvements
    const improvements = [
      'Consider adding a smoother transition',
      'Current spacing is optimal',
      'Music synchronization is good'
    ];

            // Generate warnings
    const warnings = [];
    if (previousFormations.length > 5) {
      warnings.push('Too many formations can confuse the audience');
    }
    if (dancerCount > 10) {
      warnings.push('With many dancers, consider simpler formations');
    }

    return {
      nextFormation,
      improvements,
      warnings
    };
  }
}

// Singleton instance
const aiService = new AIService();
export default aiService;
