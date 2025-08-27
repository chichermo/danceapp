export interface VideoTrack {
  id: string;
  title: string;
  description: string;
  duration: number; // en segundos
  resolution: string;
  fps: number;
  url: string;
  thumbnail: string;
  type: 'choreography' | 'tutorial' | 'performance' | 'rehearsal';
  choreographyId?: string;
  formationData?: FormationFrame[];
}

export interface FormationFrame {
  timestamp: number; // en segundos
  dancers: DancerPosition[];
  camera: CameraPosition;
  effects: VisualEffect[];
}

export interface DancerPosition {
  id: string;
  name: string;
  x: number; // posición X en el escenario
  y: number; // posición Y en el escenario
  z: number; // posición Z (profundidad)
  rotation: number; // rotación en grados
  scale: number; // escala del bailarín
  color: string; // color del traje
  isVisible: boolean;
  animation: string; // tipo de animación
}

export interface CameraPosition {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  fov: number; // campo de visión
  zoom: number;
}

export interface VisualEffect {
  type: 'lighting' | 'fog' | 'particles' | 'background';
  intensity: number;
  color: string;
  position?: { x: number; y: number; z: number };
  duration: number;
}

class VideoService {
  private videoTracks: VideoTrack[] = [];
  private formationTemplates: FormationFrame[] = [];

  constructor() {
    this.generateFormationTemplates();
    this.generateSampleVideos();
  }

  // Generate sample videos
  private generateSampleVideos(): void {
    const videoTypes = [
      { type: 'choreography', count: 8, prefix: 'Coreografía' },
      { type: 'tutorial', count: 6, prefix: 'Tutorial' },
      { type: 'performance', count: 4, prefix: 'Presentación' },
      { type: 'rehearsal', count: 3, prefix: 'Ensayo' }
    ];

    const danceStyles = [
      'Hip Hop', 'Contemporary', 'Jazz', 'Ballet', 'Modern', 'Urban',
      'Latin', 'Breakdance', 'Popping', 'Locking', 'Waacking', 'Voguing'
    ];

    const formations = [
      'Línea', 'Círculo', 'Diamante', 'Triángulo', 'Cuadrado', 'V',
      'Semicírculo', 'Escalera', 'Laberinto', 'Espiral', 'Estrella', 'Cruz'
    ];

    videoTypes.forEach(videoType => {
      for (let i = 0; i < videoType.count; i++) {
        const style = danceStyles[Math.floor(Math.random() * danceStyles.length)];
        const formation = formations[Math.floor(Math.random() * formations.length)];
        
        const video: VideoTrack = {
          id: `video-${videoType.type}-${i + 1}`,
          title: `${videoType.prefix} ${style} - ${formation}`,
          description: `Video de ${videoType.type} de ${style} con formación ${formation}. Perfecto para practicar y analizar movimientos.`,
          duration: 120 + Math.random() * 180, // 2-5 minutos
          resolution: this.getRandomResolution(),
          fps: 30,
          url: this.generateVideoUrl(videoType.type, style),
          thumbnail: this.generateThumbnailUrl(videoType.type, style),
          type: videoType.type as any,
          choreographyId: videoType.type === 'choreography' ? `choreography-${i + 1}` : undefined,
          formationData: this.generateFormationData(formation, 120 + Math.random() * 180)
        };

        this.videoTracks.push(video);
      }
    });

    console.log(`🎬 ${this.videoTracks.length} videos generated`);
  }

  // Generate formation templates
  private generateFormationTemplates(): void {
    const formations = [
      { name: 'Línea', dancers: 8, pattern: 'line' },
      { name: 'Círculo', dancers: 8, pattern: 'circle' },
      { name: 'Diamante', dancers: 5, pattern: 'diamond' },
      { name: 'Triángulo', dancers: 6, pattern: 'triangle' },
      { name: 'Cuadrado', dancers: 8, pattern: 'square' },
      { name: 'V', dancers: 8, pattern: 'v' },
      { name: 'Semicírculo', dancers: 8, pattern: 'semicircle' },
      { name: 'Escalera', dancers: 8, pattern: 'staircase' }
    ];

    formations.forEach(formation => {
      const template = this.createFormationTemplate(formation.name, formation.dancers, formation.pattern);
      this.formationTemplates.push(template);
    });

    console.log(`📐 ${this.formationTemplates.length} formation templates generated`);
  }

  // Create formation template
  private createFormationTemplate(name: string, dancerCount: number, pattern: string): FormationFrame {
    const dancers: DancerPosition[] = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

    // Generate positions based on pattern
    for (let i = 0; i < dancerCount; i++) {
      const position = this.getPositionByPattern(pattern, i, dancerCount);
      
      dancers.push({
        id: `dancer-${i + 1}`,
        name: `Bailarín ${i + 1}`,
        x: position.x,
        y: position.y,
        z: position.z,
        rotation: Math.random() * 360,
        scale: 1.0,
        color: colors[i % colors.length],
        isVisible: true,
        animation: this.getRandomAnimation()
      });
    }

    return {
      timestamp: 0,
      dancers,
      camera: {
        x: 0,
        y: 5,
        z: 10,
        rotationX: -15,
        rotationY: 0,
        rotationZ: 0,
        fov: 60,
        zoom: 1.0
      },
      effects: [
        {
          type: 'lighting',
          intensity: 0.8,
          color: '#FFFFFF',
          duration: 0
        }
      ]
    };
  }

  // Get position based on pattern
  private getPositionByPattern(pattern: string, index: number, total: number): { x: number; y: number; z: number } {
    const spacing = 2;
    
    switch (pattern) {
      case 'line':
        return {
          x: (index - total / 2) * spacing,
          y: 0,
          z: 0
        };
      
      case 'circle':
        const angle = (index / total) * 2 * Math.PI;
        const radius = 4;
        return {
          x: Math.cos(angle) * radius,
          y: 0,
          z: Math.sin(angle) * radius
        };
      
      case 'diamond':
        const diamondPositions = [
          { x: 0, y: 0, z: 3 },    // center
          { x: -2, y: 0, z: 0 },   // left
          { x: 2, y: 0, z: 0 },    // right
          { x: 0, y: 0, z: -3 },   // back
          { x: 0, y: 0, z: 0 }     // center
        ];
        return diamondPositions[index] || { x: 0, y: 0, z: 0 };
      
      case 'triangle':
        const row = Math.floor(index / 2);
        const col = index % 2;
        return {
          x: (col - 0.5) * spacing * (3 - row),
          y: 0,
          z: row * spacing
        };
      
      case 'square':
        const side = Math.floor(index / 2);
        const pos = index % 2;
        const squareSize = 3;
        switch (side) {
          case 0: return { x: -squareSize, y: 0, z: (pos - 0.5) * squareSize * 2 };
          case 1: return { x: squareSize, y: 0, z: (pos - 0.5) * squareSize * 2 };
          case 2: return { x: (pos - 0.5) * squareSize * 2, y: 0, z: -squareSize };
          case 3: return { x: (pos - 0.5) * squareSize * 2, y: 0, z: squareSize };
          default: return { x: 0, y: 0, z: 0 };
        }
      
      case 'v':
        const vRow = Math.floor(index / 2);
        const vCol = index % 2;
        return {
          x: (vCol - 0.5) * spacing * (vRow + 1),
          y: 0,
          z: vRow * spacing
        };
      
      case 'semicircle':
        const semiAngle = (index / (total - 1)) * Math.PI;
        const semiRadius = 4;
        return {
          x: Math.cos(semiAngle) * semiRadius,
          y: 0,
          z: Math.sin(semiAngle) * semiRadius
        };
      
      case 'staircase':
        return {
          x: (index - total / 2) * spacing,
          y: index * 0.5,
          z: index * 0.3
        };
      
      default:
        return { x: 0, y: 0, z: 0 };
    }
  }

  // Get random animation
  private getRandomAnimation(): string {
    const animations = [
      'idle', 'walk', 'run', 'jump', 'spin', 'wave', 'clap',
      'dance', 'pose', 'stretch', 'turn', 'slide', 'kick', 'punch'
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  }

  // Generate formation data for a video
  private generateFormationData(formationName: string, duration: number): FormationFrame[] {
    const frames: FormationFrame[] = [];
    const frameCount = Math.floor(duration * 2); // 2 frames per second
    
    // Use the first available template as base
    const baseTemplate = this.formationTemplates[0];
    if (!baseTemplate) {
      console.warn('No formation templates available');
      return frames;
    }
    
    for (let i = 0; i < frameCount; i++) {
      const timestamp = i * 0.5;
      
      // Create frame with variations in time
      const frame: FormationFrame = {
        timestamp,
        dancers: baseTemplate.dancers.map(dancer => ({
          ...dancer,
          x: dancer.x + Math.sin(timestamp * 0.5) * 0.5,
          y: dancer.y + Math.cos(timestamp * 0.3) * 0.2,
          rotation: dancer.rotation + timestamp * 10,
          animation: this.getRandomAnimation()
        })),
        camera: {
          ...baseTemplate.camera,
          x: baseTemplate.camera.x + Math.sin(timestamp * 0.2) * 2,
          rotationY: baseTemplate.camera.rotationY + timestamp * 5
        },
        effects: baseTemplate.effects.map(effect => ({
          ...effect,
          intensity: effect.intensity + Math.sin(timestamp * 0.4) * 0.2
        }))
      };
      
      frames.push(frame);
    }
    
    return frames;
  }

  // Get random resolution
  private getRandomResolution(): string {
    const resolutions = ['1920x1080', '1280x720', '854x480', '640x360'];
    return resolutions[Math.floor(Math.random() * resolutions.length)];
  }

  // Generate simulated video URL
  private generateVideoUrl(type: string, style: string): string {
    const baseUrls: { [key: string]: string } = {
      choreography: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      tutorial: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      performance: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
      rehearsal: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4'
    };
    
    return baseUrls[type] || baseUrls.choreography;
  }

  // Generate simulated thumbnail URL
  private generateThumbnailUrl(type: string, style: string): string {
    const text = encodeURIComponent(`${type} ${style}`);
    return `data:image/svg+xml;base64,${btoa(`<svg width="320" height="180" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#4ECDC4"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">${text}</text></svg>`)}`;
  }

  // Get all videos
  getAllVideos(): VideoTrack[] {
    return this.videoTracks;
  }

  // Get videos by type
  getVideosByType(type: string): VideoTrack[] {
    return this.videoTracks.filter(video => video.type === type);
  }

  // Get video by ID
  getVideoById(id: string): VideoTrack | undefined {
    return this.videoTracks.find(video => video.id === id);
  }

  // Get formation templates
  getFormationTemplates(): FormationFrame[] {
    return this.formationTemplates;
  }

  // Create custom video for choreography
  createCustomVideo(choreographyId: string, requirements: {
    title: string;
    duration: number;
    formation: string;
    dancerCount: number;
  }): VideoTrack {
    const customVideo: VideoTrack = {
      id: `custom-video-${choreographyId}-${Date.now()}`,
      title: requirements.title,
      description: `Video personalizado para ${choreographyId}`,
      duration: requirements.duration,
      resolution: '1920x1080',
      fps: 30,
      url: this.generateVideoUrl('choreography', 'custom'),
      thumbnail: this.generateThumbnailUrl('choreography', 'custom'),
      type: 'choreography',
      choreographyId,
      formationData: this.generateFormationData(requirements.formation, requirements.duration)
    };

    this.videoTracks.push(customVideo);
    return customVideo;
  }

  // Simulate video playback
  playVideo(videoId: string, onProgress?: (progress: number, frame: FormationFrame) => void): Promise<void> {
    return new Promise((resolve) => {
      const video = this.getVideoById(videoId);
      if (!video) {
        throw new Error(`Video with ID ${videoId} not found`);
      }

      console.log(`🎬 Reproduciendo: ${video.title}`);
      console.log(`⏱️ Duración: ${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`);
      console.log(`📐 Resolución: ${video.resolution}`);
      console.log(`🎭 Tipo: ${video.type}`);

      if (!video.formationData || video.formationData.length === 0) {
        console.log('⚠️ No hay datos de formación disponibles');
        resolve();
        return;
      }

      // Simulate playback progress with frames
      let currentFrame = 0;
      const totalFrames = video.formationData.length;
      
      const interval = setInterval(() => {
        const frame = video.formationData![currentFrame];
        const progress = currentFrame / totalFrames;
        
        if (onProgress) {
          onProgress(progress, frame);
        }
        
        currentFrame++;
        
        if (currentFrame >= totalFrames) {
          clearInterval(interval);
          console.log(`✅ Reproducción completada: ${video.title}`);
          resolve();
        }
      }, 500); // 2 FPS for simulation
    });
  }

  // Get all videos
  getVideoTracks(): VideoTrack[] {
    return [...this.videoTracks];
  }

  // Get video statistics
  getVideoStats(): {
    totalVideos: number;
    types: { [key: string]: number };
    totalDuration: number;
    averageDuration: number;
  } {
    const types: { [key: string]: number } = {};
    let totalDuration = 0;

    this.videoTracks.forEach(video => {
      types[video.type] = (types[video.type] || 0) + 1;
      totalDuration += video.duration;
    });

    return {
      totalVideos: this.videoTracks.length,
      types,
      totalDuration: Math.round(totalDuration),
      averageDuration: Math.round(totalDuration / this.videoTracks.length)
    };
  }
}

export const videoService = new VideoService();
export default videoService;
