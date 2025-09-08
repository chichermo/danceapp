export interface PersistenceData {
  choreographies: any[];
  students: any[];
  formations: any[];
  coaches: any[];
  settings: any;
  lastSaved: string;
  notes: any[];
}

class PersistenceService {
  private readonly STORAGE_KEY = 'heliopsis-dance-data';
  private readonly AUTO_SAVE_INTERVAL = 120000; // 2 minutes instead of 1 minute
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private lastDataHash: string = '';
  private isAutoSaveEnabled: boolean = true;

  constructor() {
    this.startAutoSave();
  }

  // Save data to localStorage
  saveData(data: Partial<PersistenceData>): void {
    try {
      const existingData = this.loadData();
      const updatedData = {
        ...existingData,
        ...data,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
      this.lastDataHash = this.generateDataHash(updatedData);
      console.log('💾 Data saved successfully');
    } catch (error) {
      console.error('❌ Error saving data:', error);
    }
  }

  // Load data from localStorage
  loadData(): PersistenceData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        // Only log once per session
        if (!this.lastDataHash) {
          console.log('📂 Data loaded successfully');
        }
        return parsedData;
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
    }
    
    return {
      choreographies: [],
      students: [],
      formations: [],
      coaches: [],
      settings: {},
      lastSaved: new Date().toISOString(),
      notes: []
    };
  }

  // Save choreographies
  saveChoreographies(choreographies: any[]): void {
    this.saveData({ choreographies });
  }

  // Load choreographies
  loadChoreographies(): any[] {
    const data = this.loadData();
    return data.choreographies || [];
  }

  // Save students
  saveStudents(students: any[]): void {
    this.saveData({ students });
  }

  // Load students
  loadStudents(): any[] {
    const data = this.loadData();
    return data.students || [];
  }

  // Save formations
  saveFormations(formations: any[]): void {
    this.saveData({ formations });
  }

  // Load formations
  loadFormations(): any[] {
    const data = this.loadData();
    return data.formations || [];
  }

  // Save coaches
  saveCoaches(coaches: any[]): void {
    this.saveData({ coaches });
  }

  // Load coaches
  loadCoaches(): any[] {
    const data = this.loadData();
    return data.coaches || [];
  }

  // Save notes
  saveNotes(notes: any[]): void {
    this.saveData({ notes });
  }

  // Load notes
  loadNotes(): any[] {
    const data = this.loadData();
    return data.notes || [];
  }

  // Save settings
  saveSettings(settings: any): void {
    this.saveData({ settings });
  }

  // Load settings
  loadSettings(): any {
    const data = this.loadData();
    return data.settings || {};
  }

  // Start auto-save
  startAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setInterval(() => {
      if (this.isAutoSaveEnabled) {
        this.autoSave();
      }
    }, this.AUTO_SAVE_INTERVAL);
  }

  // Stop auto-save
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // Enable/disable auto-save
  setAutoSaveEnabled(enabled: boolean): void {
    this.isAutoSaveEnabled = enabled;
    if (enabled && !this.autoSaveTimer) {
      this.startAutoSave();
    } else if (!enabled && this.autoSaveTimer) {
      this.stopAutoSave();
    }
  }

  // Auto-save with change detection (silent)
  private autoSave(): void {
    try {
      const currentData = this.loadData();
      const currentHash = this.generateDataHash(currentData);
      
      // Only save if data has actually changed
      if (currentHash !== this.lastDataHash) {
        this.saveData(currentData);
        // No console log for auto-save to reduce spam
      }
      // Remove all auto-save console logs to eliminate spam
    } catch (error) {
      console.error('❌ Error during auto-save:', error);
    }
  }

  // Generate a simple hash for change detection
  private generateDataHash(data: PersistenceData): string {
    try {
      const { lastSaved, ...dataWithoutTimestamp } = data;
      const jsonString = JSON.stringify(dataWithoutTimestamp);
      return btoa(jsonString).slice(0, 16); // Simple hash
    } catch {
      return '';
    }
  }

  // Clear all data
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.lastDataHash = '';
      console.log('🗑️ All data has been cleared');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
    }
  }

  // Export data
  exportData(): string {
    const data = this.loadData();
    return JSON.stringify(data, null, 2);
  }

  // Import data
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      console.log('📥 Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }

  // Get storage statistics
  getStorageStats(): {
    totalSize: number;
    lastSaved: string;
    itemCount: number;
  } {
    const data = this.loadData();
    const jsonString = JSON.stringify(data);
    
    return {
      totalSize: new Blob([jsonString]).size,
      lastSaved: data.lastSaved,
      itemCount: Object.keys(data).length
    };
  }

  // Cleanup method
  destroy(): void {
    this.stopAutoSave();
  }
}

// Singleton instance
const persistenceService = new PersistenceService();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    persistenceService.destroy();
  });
}

export default persistenceService;
