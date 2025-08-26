export interface PersistenceData {
  choreographies: any[];
  students: any[];
  formations: any[];
  settings: any;
  lastSaved: string;
}

class PersistenceService {
  private readonly STORAGE_KEY = 'heliopsis-dance-data';
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 segundos
  private autoSaveTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startAutoSave();
  }

  // Guardar datos en localStorage
  saveData(data: Partial<PersistenceData>): void {
    try {
      const existingData = this.loadData();
      const updatedData = {
        ...existingData,
        ...data,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
      console.log('💾 Datos guardados exitosamente');
    } catch (error) {
      console.error('❌ Error al guardar datos:', error);
    }
  }

  // Cargar datos desde localStorage
  loadData(): PersistenceData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        console.log('📂 Datos cargados exitosamente');
        return parsedData;
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    }
    
    return {
      choreographies: [],
      students: [],
      formations: [],
      settings: {},
      lastSaved: new Date().toISOString()
    };
  }

  // Guardar coreografías
  saveChoreographies(choreographies: any[]): void {
    this.saveData({ choreographies });
  }

  // Cargar coreografías
  loadChoreographies(): any[] {
    const data = this.loadData();
    return data.choreographies || [];
  }

  // Guardar estudiantes
  saveStudents(students: any[]): void {
    this.saveData({ students });
  }

  // Cargar estudiantes
  loadStudents(): any[] {
    const data = this.loadData();
    return data.students || [];
  }

  // Guardar formaciones
  saveFormations(formations: any[]): void {
    this.saveData({ formations });
  }

  // Cargar formaciones
  loadFormations(): any[] {
    const data = this.loadData();
    return data.formations || [];
  }

  // Guardar configuraciones
  saveSettings(settings: any): void {
    this.saveData({ settings });
  }

  // Cargar configuraciones
  loadSettings(): any {
    const data = this.loadData();
    return data.settings || {};
  }

  // Iniciar guardado automático
  startAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setInterval(() => {
      this.autoSave();
    }, this.AUTO_SAVE_INTERVAL);
  }

  // Detener guardado automático
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // Guardado automático
  private autoSave(): void {
    // Este método se puede extender para guardar datos específicos
    console.log('🔄 Guardado automático ejecutado');
  }

  // Limpiar todos los datos
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Todos los datos han sido eliminados');
    } catch (error) {
      console.error('❌ Error al limpiar datos:', error);
    }
  }

  // Exportar datos
  exportData(): string {
    const data = this.loadData();
    return JSON.stringify(data, null, 2);
  }

  // Importar datos
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
      console.log('📥 Datos importados exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error al importar datos:', error);
      return false;
    }
  }

  // Obtener estadísticas de almacenamiento
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

// Instancia singleton
const persistenceService = new PersistenceService();
export default persistenceService;
