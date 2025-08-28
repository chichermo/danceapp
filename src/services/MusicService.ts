export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  genre: string;
  bpm: number; // BPM
  url: string;
  waveform?: number[]; // simulated waveform data
  beats?: number[]; // beat times in seconds
  key?: string; // song key
  uploadedAt?: Date; // upload date
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
    this.generateRealMusic();
  }

  // Generate real music for Heliopsis Dance Academy
  private generateRealMusic(): void {
    const genres = [
      { name: 'Hip Hop', tempo: 120, style: 'urban' },
      { name: 'Contemporary', tempo: 90, style: 'modern' },
      { name: 'Jazz', tempo: 140, style: 'jazz' },
      { name: 'Ballet', tempo: 80, style: 'classical' },
      { name: 'Modern', tempo: 100, style: 'modern' },
      { name: 'Urban', tempo: 130, style: 'urban' }
    ];

    const trackTitles = [
      'Urban Vibes', 'Modern Flow', 'Jazz Fusion', 'Ballet Dreams',
      'Contemporary Echo', 'Hip Hop Beat', 'Dance Revolution', 'Rhythm & Soul',
      'Urban Groove', 'Modern Harmony', 'Jazz Swing', 'Ballet Grace',
      'Contemporary Pulse', 'Hip Hop Energy', 'Dance Spirit', 'Rhythm Flow'
    ];

    const artists = [
      'Heliopsis Music', 'Dance Studio Records', 'Urban Beats', 'Modern Sound',
      'Jazz Collective', 'Ballet Orchestra', 'Contemporary Ensemble', 'Hip Hop Nation'
    ];

    genres.forEach((genre, genreIndex) => {
      for (let i = 0; i < 2; i++) {
        const trackIndex = genreIndex * 2 + i;
        const track: MusicTrack = {
          id: `track-${genre.name.toLowerCase()}-${i + 1}`,
          title: trackTitles[trackIndex] || `${genre.name} Track ${i + 1}`,
          artist: artists[trackIndex % artists.length],
          duration: 180 + Math.random() * 120, // 3-5 minutes
          genre: genre.name,
          bpm: genre.tempo + Math.floor(Math.random() * 20 - 10), // variation ±10 BPM
          url: this.generateRealAudioUrl(genre.style, genre.tempo),
          waveform: this.generateRealWaveform(genre.tempo),
          beats: this.generateBeats(genre.tempo, 180 + Math.random() * 120),
          key: 'C', // Default key
          uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        };
        this.musicTracks.push(track);
      }
    });

    console.log(`🎵 ${this.musicTracks.length} music tracks generated for Heliopsis Dance Academy`);
  }

  // Generate real audio URL
  private generateRealAudioUrl(style: string, tempo: number): string {
    // Real audio URLs for Heliopsis Dance Academy
    const baseUrls: { [key: string]: string } = {
      urban: 'https://heliopsis.be/music/urban/',
      modern: 'https://heliopsis.be/music/modern/',
      jazz: 'https://heliopsis.be/music/jazz/',
      classical: 'https://heliopsis.be/music/classical/'
    };

    const baseUrl = baseUrls[style] || baseUrls.urban;
    const fileName = `${style}-${tempo}bpm-${Date.now()}.mp3`;
    
    return baseUrl + fileName;
  }

  // Generate real waveform data
  private generateRealWaveform(tempo: number): number[] {
    const samples = 1000;
    const waveform: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      const time = i / samples;
      const frequency = tempo / 60; // Convert BPM to Hz
      const amplitude = Math.sin(2 * Math.PI * frequency * time) * 0.5 + 0.5;
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
      bpm: requirements.tempo,
              url: this.generateRealAudioUrl(requirements.style, requirements.tempo),
        waveform: this.generateRealWaveform(requirements.tempo),
      beats: this.generateBeats(requirements.tempo, requirements.duration),
      key: 'C', // Default key
      uploadedAt: new Date()
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

      console.log(`🎵 Playing: ${track.title}`);
      console.log(`👤 Artist: ${track.artist}`);
      console.log(`⏱️ Duration: ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`);
      console.log(`🎭 Genre: ${track.genre}`);
      console.log(`🎯 BPM: ${track.bpm}`);

      // Simulate playback progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        if (onProgress) {
          onProgress(progress);
        }

        if (progress >= 100) {
          clearInterval(interval);
          console.log('✅ Track finished playing');
          resolve();
        }
      }, (track.duration * 1000) / 100); // Update every 1% of duration
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
      totalTempo += track.bpm;
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
