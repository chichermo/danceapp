export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: 'Padre' | 'Madre' | 'Tutor' | 'Apoderado' | 'Otro';
  phone: string;
  email: string;
  emergencyContact: boolean;
  canPickUp: boolean;
}

export interface DanceGroup {
  id: string;
  name: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
  style: 'Contemporáneo' | 'Hip Hop' | 'Ballet' | 'Jazz' | 'Salsa' | 'Otro';
  schedule: string;
  coach: string;
  maxStudents: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  age: number;
  gender: 'Femenino' | 'Masculino' | 'No binario' | 'Prefiero no decir';
  
  // Contacto
  email?: string;
  phone?: string;
  
  // Dirección
  address: Address;
  
  // Apoderados
  guardians: Guardian[];
  
  // Información Académica
  danceGroups: string[]; // IDs de los grupos
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
  joinDate: Date;
  lastClassDate?: Date;
  
  // Estado
  isActive: boolean;
  status: 'Activo' | 'Inactivo' | 'Suspendido' | 'Graduado';
  
  // Información Adicional
  medicalInfo?: string;
  allergies?: string[];
  notes?: string;
  
  // Archivos
  photo?: string;
  documents?: string[];
  
  // Estadísticas
  totalClasses: number;
  attendanceRate: number;
  choreographiesParticipated: number;
  
  // Fechas
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: Address;
  guardians: Omit<Guardian, 'id'>[];
  danceGroups: string[];
  level: string;
  medicalInfo: string;
  allergies: string[];
  notes: string;
}

export interface StudentFilters {
  search: string;
  level: string;
  status: string;
  danceGroups: string[];
  ageRange: [number, number];
  isActive: boolean;
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  studentsByLevel: Record<string, number>;
  studentsByGroup: Record<string, number>;
  averageAge: number;
  newStudentsThisMonth: number;
  attendanceRate: number;
}
