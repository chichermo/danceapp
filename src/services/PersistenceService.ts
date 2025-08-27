export interface PersistenceData {
  choreographies: any[];
  students: any[];
  formations: any[];
  settings: any;
  lastSaved: string;
}

class PersistenceService {
  private readonly STORAGE_KEY = 'heliopsis-dance-data';
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  private autoSaveTimer: NodeJS.Timeout | null = null;

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
        console.log('📂 Data loaded successfully');
        return parsedData;
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
    }
    
    return {
      choreographies: [],
      students: [],
      formations: [],
      settings: {},
      lastSaved: new Date().toISOString()
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
      this.autoSave();
    }, this.AUTO_SAVE_INTERVAL);
  }

  // Stop auto-save
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // Auto-save
  private autoSave(): void {
    // This method can be extended to save specific data
    console.log('🔄 Auto-save executed');
  }

  // Clear all data
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
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
}

// Singleton instance
const persistenceService = new PersistenceService();
export default persistenceService;
