export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // en segundos
  genre: string;
  tempo: number; // BPM
  url: string;
  waveform?: number[]; // datos de forma de onda simulados
  beats?: number[]; // tiempos de beats en segundos
}

export interface ChoreographyMusic {
  id: string;
  choreographyId: string;
  track: MusicTrack;
  startTime: number;
  endTime: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

class MusicService {
  private musicTracks: MusicTrack[] = [];
  private choreographyMusic: ChoreographyMusic[] = [];

  constructor() {
    this.generateSampleMusic();
  }

  // Generar música de muestra para diferentes géneros
  private generateSampleMusic(): void {
    const genres = [
      { name: 'Hip Hop', tempo: 120, style: 'urban' },
      { name: 'Pop', tempo: 128, style: 'mainstream' },
      { name: 'Jazz', tempo: 100, style: 'smooth' },
      { name: 'Electronic', tempo: 130, style: 'dance' },
      { name: 'Latin', tempo: 110, style: 'rhythmic' },
      { name: 'Contemporary', tempo: 90, style: 'emotional' },
      { name: 'Ballet', tempo: 80, style: 'classical' },
      { name: 'Modern', tempo: 95, style: 'experimental' }
    ];

    const trackTitles = [
      'Dance Revolution', 'Urban Beat', 'Rhythm of the Night', 'Digital Dreams',
      'Street Symphony', 'Electric Pulse', 'Midnight Moves', 'Cosmic Dance',
      'Neon Lights', 'Beat Drop', 'Dance Floor', 'Urban Legends',
      'Rhythm Nation', 'Digital Age', 'Night Fever', 'Dance Machine'
    ];

    const artists = [
      'DJ Heliopsis', 'Urban Beats', 'Dance Masters', 'Rhythm Factory',
      'Digital Sound', 'Beat Makers', 'Dance Collective', 'Urban Vibes',
      'Sound Wave', 'Beat Lab', 'Dance Studio', 'Rhythm Squad'
    ];

    genres.forEach((genre, genreIndex) => {
      for (let i = 0; i < 2; i++) {
        const trackIndex = genreIndex * 2 + i;
        const track: MusicTrack = {
          id: `track-${genre.name.toLowerCase()}-${i + 1}`,
          title: trackTitles[trackIndex] || `${genre.name} Track ${i + 1}`,
          artist: artists[trackIndex % artists.length],
          duration: 180 + Math.random() * 120, // 3-5 minutos
          genre: genre.name,
          tempo: genre.tempo + Math.floor(Math.random() * 20 - 10), // variación de ±10 BPM
          url: this.generateAudioUrl(genre.style, genre.tempo),
          waveform: this.generateWaveform(genre.tempo),
          beats: this.generateBeats(genre.tempo, 180 + Math.random() * 120)
        };
        this.musicTracks.push(track);
      }
    });

    console.log(`🎵 ${this.musicTracks.length} pistas de música generadas`);
  }

  // Generar URL de audio simulada
  private generateAudioUrl(style: string, tempo: number): string {
    // URLs simuladas que representan diferentes estilos de música
    const baseUrls: { [key: string]: string } = {
      urban: 'https://www.soundjay.com/misc/sounds/urban-beat.mp3',
      mainstream: 'https://www.soundjay.com/misc/sounds/pop-track.mp3',
      smooth: 'https://www.soundjay.com/misc/sounds/jazz-smooth.mp3',
      dance: 'https://www.soundjay.com/misc/sounds/electronic-dance.mp3',
      rhythmic: 'https://www.soundjay.com/misc/sounds/latin-rhythm.mp3',
      emotional: 'https://www.soundjay.com/misc/sounds/contemporary.mp3',
      classical: 'https://www.soundjay.com/misc/sounds/ballet-classical.mp3',
      experimental: 'https://www.soundjay.com/misc/sounds/modern-experimental.mp3'
    };

    return baseUrls[style] || baseUrls.urban;
  }

  // Generar forma de onda simulada
  private generateWaveform(tempo: number): number[] {
    const samples = 1000;
    const waveform: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const time = i / samples;
      const frequency = tempo / 60; // Convertir BPM a Hz
      
      // Generar una forma de onda compleja con múltiples armónicos
      let amplitude = 0;
      amplitude += Math.sin(2 * Math.PI * frequency * time) * 0.5;
      amplitude += Math.sin(2 * Math.PI * frequency * 2 * time) * 0.3;
      amplitude += Math.sin(2 * Math.PI * frequency * 3 * time) * 0.2;
      amplitude += Math.sin(2 * Math.PI * frequency * 4 * time) * 0.1;
      
      // Agregar ruido para simular instrumentos reales
      amplitude += (Math.random() - 0.5) * 0.1;
      
      // Normalizar entre -1 y 1
      amplitude = Math.max(-1, Math.min(1, amplitude));
      waveform.push(amplitude);
    }
    
    return waveform;
  }

  // Generar beats simulados
  private generateBeats(tempo: number, duration: number): number[] {
    const beats: number[] = [];
    const beatInterval = 60 / tempo; // segundos entre beats
    
    for (let time = 0; time < duration; time += beatInterval) {
      beats.push(time);
    }
    
    return beats;
  }

  // Obtener todas las pistas de música
  getAllTracks(): MusicTrack[] {
    return this.musicTracks;
  }

  // Obtener pistas por género
  getTracksByGenre(genre: string): MusicTrack[] {
    return this.musicTracks.filter(track => 
      track.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  // Obtener pista por ID
  getTrackById(id: string): MusicTrack | undefined {
    return this.musicTracks.find(track => track.id === id);
  }

  // Asociar música con coreografía
  assignMusicToChoreography(choreographyId: string, trackId: string, startTime: number = 0): ChoreographyMusic {
    const track = this.getTrackById(trackId);
    if (!track) {
      throw new Error(`Track with ID ${trackId} not found`);
    }

    const choreographyMusic: ChoreographyMusic = {
      id: `choreography-music-${choreographyId}-${Date.now()}`,
      choreographyId,
      track,
      startTime,
      endTime: startTime + track.duration,
      volume: 1.0,
      fadeIn: 2.0,
      fadeOut: 2.0
    };

    this.choreographyMusic.push(choreographyMusic);
    return choreographyMusic;
  }

  // Obtener música de una coreografía
  getChoreographyMusic(choreographyId: string): ChoreographyMusic | undefined {
    return this.choreographyMusic.find(cm => cm.choreographyId === choreographyId);
  }

  // Generar música personalizada para una coreografía
  generateCustomTrack(choreographyId: string, requirements: {
    genre: string;
    tempo: number;
    duration: number;
    style: string;
  }): MusicTrack {
    const customTrack: MusicTrack = {
      id: `custom-${choreographyId}-${Date.now()}`,
      title: `Custom Track for ${choreographyId}`,
      artist: 'AI Generated',
      duration: requirements.duration,
      genre: requirements.genre,
      tempo: requirements.tempo,
      url: this.generateAudioUrl(requirements.style, requirements.tempo),
      waveform: this.generateWaveform(requirements.tempo),
      beats: this.generateBeats(requirements.tempo, requirements.duration)
    };

    this.musicTracks.push(customTrack);
    return customTrack;
  }

  // Simular reproducción de música
  playTrack(trackId: string, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve) => {
      const track = this.getTrackById(trackId);
      if (!track) {
        throw new Error(`Track with ID ${trackId} not found`);
      }

      console.log(`🎵 Reproduciendo: ${track.title} - ${track.artist}`);
      console.log(`⏱️ Duración: ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`);
      console.log(`🎼 Tempo: ${track.tempo} BPM`);
      console.log(`🎭 Género: ${track.genre}`);

      // Simular progreso de reproducción
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.1;
        if (onProgress) {
          onProgress(progress / track.duration);
        }
        
        if (progress >= track.duration) {
          clearInterval(interval);
          console.log(`✅ Reproducción completada: ${track.title}`);
          resolve();
        }
      }, 100);
    });
  }

  // Obtener todas las pistas de música
  getMusicTracks(): MusicTrack[] {
    return [...this.musicTracks];
  }

  // Obtener estadísticas de música
  getMusicStats(): {
    totalTracks: number;
    genres: { [key: string]: number };
    averageTempo: number;
    totalDuration: number;
  } {
    const genres: { [key: string]: number } = {};
    let totalTempo = 0;
    let totalDuration = 0;

    this.musicTracks.forEach(track => {
      genres[track.genre] = (genres[track.genre] || 0) + 1;
      totalTempo += track.tempo;
      totalDuration += track.duration;
    });

    return {
      totalTracks: this.musicTracks.length,
      genres,
      averageTempo: Math.round(totalTempo / this.musicTracks.length),
      totalDuration: Math.round(totalDuration)
    };
  }
}

export const musicService = new MusicService();
export default musicService;
