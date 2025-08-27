export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Legal Representative' | 'Other';
  phone: string;
  email: string;
  emergencyContact: boolean;
  canPickUp: boolean;
}

export interface DanceGroup {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  style: 'Contemporary' | 'Hip Hop' | 'Ballet' | 'Jazz' | 'Salsa' | 'Other';
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
  gender: 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  
  // Contact
  email?: string;
  phone?: string;
  
  // Address
  address: Address;
  
  // Guardians
  guardians: Guardian[];
  
  // Academic Information
  danceGroups: string[]; // Group IDs
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  joinDate: Date;
  lastClassDate?: Date;
  
  // Status
  isActive: boolean;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Graduated';
  
  // Additional Information
  medicalInfo?: string;
  allergies?: string[];
  notes?: string;
  
  // Files
  photo?: string;
  documents?: string[];
  
  // Statistics
  totalClasses: number;
  attendanceRate: number;
  choreographiesParticipated: number;
  
  // Dates
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
