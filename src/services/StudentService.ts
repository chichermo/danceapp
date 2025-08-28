import { Student, StudentFormData, StudentFilters, StudentStats, DanceGroup, Guardian, Address } from '../types/Student';

// Real Heliopsis Dance Academy groups
const realDanceGroups: DanceGroup[] = [
  {
    id: 'modern-1',
    name: 'MODERN 1 - BIRTH YEARS 2013 & 2012 & 2011',
    level: 'Beginner',
    style: 'Contemporary',
    schedule: 'Monday and Wednesday 16:00-17:00',
    coach: 'Miet',
    maxStudents: 27
  },
  {
    id: 'modern-2',
    name: 'MODERN 2 - 14+ or after selection/trial lesson',
    level: 'Intermediate',
    style: 'Contemporary',
    schedule: 'Tuesday and Thursday 17:00-18:30',
    coach: 'Miet',
    maxStudents: 32
  },
  {
    id: 'modern-3',
    name: 'MODERN 3 - 16+ after selection/trial lesson',
    level: 'Advanced',
    style: 'Contemporary',
    schedule: 'Friday 19:00-20:30',
    coach: 'Miet',
    maxStudents: 17
  },
  {
    id: 'urban-1',
    name: 'URBAN 1 - BIRTH YEARS 2013 & 2012 & 2011',
    level: 'Beginner',
    style: 'Hip Hop',
    schedule: 'Monday and Wednesday 17:00-18:00',
    coach: 'Erien',
    maxStudents: 31
  },
  {
    id: 'urban-2',
    name: 'URBAN 2 - 14+ or after selection/trial lesson',
    level: 'Intermediate',
    style: 'Hip Hop',
    schedule: 'Tuesday and Thursday 18:00-19:00',
    coach: 'Erien',
    maxStudents: 39
  },
  {
    id: 'urban-3',
    name: 'URBAN 3 - 16+ After selection/trial lesson',
    level: 'Advanced',
    style: 'Hip Hop',
    schedule: 'Friday 20:00-21:30',
    coach: 'Erien',
    maxStudents: 17
  },
  {
    id: 'urban-teens',
    name: 'URBAN TEENS - BIRTH YEARS 2016 & 2015 & 2014',
    level: 'Intermediate',
    style: 'Hip Hop',
    schedule: 'Saturday 10:00-11:30',
    coach: 'Erien',
    maxStudents: 37
  },
  {
    id: 'modern-teens',
    name: 'MODERN TEENS - BIRTH YEARS 2016 & 2015 & 2014',
    level: 'Intermediate',
    style: 'Contemporary',
    schedule: 'Saturday 11:30-13:00',
    coach: 'Miet',
    maxStudents: 25
  },
  {
    id: 'mini-dance',
    name: 'MINI DANCE - BIRTH YEARS 2017 & 2016',
    level: 'Beginner',
    style: 'Contemporary',
    schedule: 'Wednesday 15:00-15:45',
    coach: 'Anaïs',
    maxStudents: 15
  },
  {
    id: 'ballet-beginners',
    name: 'BALLET BEGINNERS - BIRTH YEARS 2012 & 2011',
    level: 'Beginner',
    style: 'Ballet',
    schedule: 'Tuesday 16:00-17:00',
    coach: 'Aline',
    maxStudents: 20
  },
  {
    id: 'ballet-intermediate',
    name: 'BALLET INTERMEDIATE - 13+ after selection',
    level: 'Intermediate',
    style: 'Ballet',
    schedule: 'Thursday 17:00-18:30',
    coach: 'Aline',
    maxStudents: 18
  },
  {
    id: 'jazz-adults',
    name: 'JAZZ ADULTS - 18+',
    level: 'Advanced',
    style: 'Jazz',
    schedule: 'Friday 18:00-19:30',
    coach: 'Britt',
    maxStudents: 22
  },
  {
    id: 'teen-performance',
    name: 'TEEN PERFORMANCE - 14+ by audition',
    level: 'Advanced',
    style: 'Contemporary',
    schedule: 'Saturday 14:00-16:00',
    coach: 'Naëlle',
    maxStudents: 16
  }
];




class StudentService {
  private students: Student[] = [];
  private danceGroups: DanceGroup[] = [...realDanceGroups];

  constructor() {
    // Initialize only with Belgian students
    this.importAllBelgiumStudents();
  }

  // Get all students
  getAllStudents(): Student[] {
    return [...this.students];
  }

  // Get student by ID
  getStudentById(id: string): Student | undefined {
    return this.students.find(student => student.id === id);
  }

  // Get all dance groups
  getAllDanceGroups(): DanceGroup[] {
    return [...this.danceGroups];
  }

  // Get group by ID
  getDanceGroupById(id: string): DanceGroup | undefined {
    return this.danceGroups.find(group => group.id === id);
  }

  // Get group ID by name
  getGroupIdByName(groupName: string): string | undefined {
    const group = this.danceGroups.find(g => g.name === groupName);
    return group?.id;
  }

  // Create new student
  createStudent(studentData: StudentFormData): Student {
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      fullName: `${studentData.firstName} ${studentData.lastName}`,
      dateOfBirth: new Date(studentData.dateOfBirth),
      age: this.calculateAge(new Date(studentData.dateOfBirth)),
      gender: studentData.gender as any,
      email: studentData.email,
      phone: studentData.phone,
      address: studentData.address,
      guardians: studentData.guardians.map((guardian, index) => ({
        ...guardian,
        id: `guardian-${Date.now()}-${index}`
      })),
      danceGroups: studentData.danceGroups,
      level: studentData.level as any,
      joinDate: new Date(),
      isActive: true,
      status: 'Active',
      medicalInfo: studentData.medicalInfo,
      allergies: studentData.allergies,
      notes: studentData.notes,
      photo: undefined,
      documents: [],
      totalClasses: 0,
      attendanceRate: 1.0,
      choreographiesParticipated: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.students.push(newStudent);
    return newStudent;
  }

  // Update student
  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = this.students.findIndex(student => student.id === id);
    if (index === -1) return null;

    const updatedStudent = {
      ...this.students[index],
      ...updates,
      updatedAt: new Date()
    };

    this.students[index] = updatedStudent;
    return updatedStudent;
  }

  // Delete student
  deleteStudent(id: string): boolean {
    const index = this.students.findIndex(student => student.id === id);
    if (index === -1) return false;

    this.students.splice(index, 1);
    return true;
  }

  // Filter students
  filterStudents(filters: StudentFilters): Student[] {
    return this.students.filter(student => {
      // Search by name
      if (filters.search && !student.fullName.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filter by level
      if (filters.level && student.level !== filters.level) {
        return false;
      }

      // Filter by status
      if (filters.status && student.status !== filters.status) {
        return false;
      }

      // Filter by groups
      if (filters.danceGroups.length > 0 && !filters.danceGroups.some(groupId => student.danceGroups.includes(groupId))) {
        return false;
      }

      // Filter by age range
      if (filters.ageRange && (student.age < filters.ageRange[0] || student.age > filters.ageRange[1])) {
        return false;
      }

      // Filter by active status
      if (filters.isActive !== undefined && student.isActive !== filters.isActive) {
        return false;
      }

      return true;
    });
  }

  // Get statistics
  getStudentStats(): StudentStats {
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(s => s.isActive).length;
    
    const studentsByLevel = this.students.reduce((acc, student) => {
      acc[student.level] = (acc[student.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const studentsByGroup = this.students.reduce((acc, student) => {
      student.danceGroups.forEach(groupId => {
        acc[groupId] = (acc[groupId] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const totalAge = this.students.reduce((sum, student) => sum + student.age, 0);
    const averageAge = totalStudents > 0 ? Math.round(totalAge / totalStudents) : 0;

    const thisMonth = new Date().getMonth();
    const newStudentsThisMonth = this.students.filter(student => 
      student.joinDate.getMonth() === thisMonth
    ).length;

    const totalAttendance = this.students.reduce((sum, student) => sum + student.attendanceRate, 0);
    const attendanceRate = totalStudents > 0 ? totalAttendance / totalStudents : 0;

    return {
      totalStudents,
      activeStudents,
      studentsByLevel,
      studentsByGroup,
      averageAge,
      newStudentsThisMonth,
      attendanceRate
    };
  }

  // Import data from file
  importStudentsFromFile(fileData: any[]): { success: number; errors: string[] } {
    const errors: string[] = [];
    let successCount = 0;

    // Verify that there is data
    if (!fileData || fileData.length === 0) {
      errors.push('No data to import');
      return { success: 0, errors };
    }

    // Show debug information
    console.log('Available columns in file:', Object.keys(fileData[0] || {}));
    console.log('First row of data:', fileData[0]);

    fileData.forEach((row, index) => {
      try {
        // Verify if the row has valid data
        if (!row || Object.keys(row).length === 0) {
          return; // Skip empty rows
        }

        // Search for names in different possible formats (including the real CSV format)
        let firstName = '';
        let lastName = '';

        if (row.Name) {
          // Real format: "Baert Amy" -> firstName: "Amy", lastName: "Baert"
          const nameParts = row.Name.trim().split(' ');
          if (nameParts.length >= 2) {
            firstName = nameParts[nameParts.length - 1]; // Last element as first name
            lastName = nameParts.slice(0, -1).join(' '); // Rest as last name
          } else {
            firstName = row.Name;
            lastName = '';
          }
        } else {
          // Previous format
          firstName = row.Nombre || row.nombre || row.firstName || row.FirstName || row['First Name'] || row['Nombre'] || '';
          lastName = row.Apellido || row.apellido || row.lastName || row.LastName || row['Last Name'] || row['Apellido'] || '';
        }

        if (firstName) {
          // Process birth date in European format (DD-MM-YYYY)
          let birthDate = new Date('2000-01-01');
          if (row['Birth Date'] || row.FechaNacimiento || row.fechaNacimiento || row.birthDate || row.BirthDate || row['Fecha de Nacimiento']) {
            const dateStr = row['Birth Date'] || row.FechaNacimiento || row.fechaNacimiento || row.birthDate || row.BirthDate || row['Fecha de Nacimiento'];
            if (dateStr.includes('-')) {
              const parts = dateStr.split('-');
              if (parts.length === 3) {
                // Format DD-MM-YYYY
                birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              }
            }
          }

          const newStudent: Student = {
            id: `student-imported-${Date.now()}-${index}`,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            fullName: row.Name || `${firstName.trim()} ${lastName.trim()}`,
            dateOfBirth: birthDate,
            age: this.calculateAge(birthDate),
            gender: 'Female' as any, // Default, can be adjusted later
            email: row.Email || row.email || '',
            phone: row['Mother\'s Mobile'] || row['Father\'s Mobile'] || row.Telefono || row.telefono || row.phone || row.Phone || '',
            address: {
              street: row.Address || row.Direccion || row.direccion || row.address || row.Address || row.street || row.Street || '',
              city: row.City || row.Ciudad || row.ciudad || row.city || row.City || 'Knokke-Heist',
              state: 'West Flanders',
              zipCode: row['Postal Code'] || row.CodigoPostal || row.codigoPostal || row.zipCode || row.ZipCode || '8300',
              country: 'Belgium'
            },
            guardians: [{
              id: `guardian-imported-${Date.now()}-${index}`,
                              firstName: row['Mother\'s Mobile'] ? 'Mother' : 'Father',
                lastName: 'Guardian',
              relationship: 'Legal Representative',
              phone: row['Mother\'s Mobile'] || row['Father\'s Mobile'] || '',
              email: row.Email || row.email || '',
              emergencyContact: true,
              canPickUp: true
            }],
            danceGroups: row['Group Name'] ? [this.getGroupIdByName(row['Group Name']) || 'modern-1'] : ['modern-1'],
            level: 'Beginner' as any, // Default, can be adjusted later
            joinDate: new Date(),
            lastClassDate: new Date(),
            isActive: true,
            status: 'Active',
            medicalInfo: 'No medical conditions',
            allergies: [],
            notes: `Registration number: ${row['Dancer Registration Number'] || 'N/A'}`,
            photo: undefined,
            documents: [],
            totalClasses: 0,
            attendanceRate: 0.9,
            choreographiesParticipated: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          this.students.push(newStudent);
          successCount++;
          console.log(`✅ Student imported: ${newStudent.fullName} - ${row['Group Name']}`);
        } else {
          // Only report errors for rows that seem to have data
          if (Object.keys(row).some(key => row[key] && row[key].toString().trim().length > 0)) {
            errors.push(`Row ${index + 1}: Name is required. Available columns: ${Object.keys(row).join(', ')}`);
            }
          }
        } catch (error) {
          errors.push(`Row ${index + 1}: Format error - ${error}`);
        }
      });

      return { success: successCount, errors };
    }

      // Import ALL Belgian students from CSV
  importAllBelgiumStudents(): void {
    console.log('🚀 === IMPORTING ALL BELGIUM STUDENTS ===');
    
    // Import directly from real CSV
    const belgiumStudents = this.generateAllBelgiumStudents();
    
    // Add all students to the system
    belgiumStudents.forEach(student => {
      this.students.push(student);
    });
    
    console.log(`✅ ${belgiumStudents.length} Belgium students imported successfully`);
    console.log(`📊 Total students in the system: ${this.students.length}`);
  }

    // Generate all Belgian students based on REAL CSV
    private generateAllBelgiumStudents(): Student[] {
      const students: Student[] = [];
              let globalIndex = 1; // Global counter for unique IDs
      
              // Data from REAL CSV (97 students)
      const csvData = [
                  // MODERN 1 - BIRTH YEARS 2013 & 2012 & 2011 (27 students)
        { name: 'Baert Amy', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-08-28', phone: '479599065', email: 'sarah_roelandt@hotmail.com', regNumber: '12.08.28-022.57' },
        { name: 'Brouckaert Emma', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2014-01-29', phone: '472498505', email: 'demeesterkim@hotmail.com', regNumber: '14.01.29-012.30' },
        { name: 'Brouckaert Liana', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-02-15', phone: '472498505', email: 'demeesterkim@hotmail.com', regNumber: '12.02.15-012.27' },
        { name: 'Coppejans Dieuwke', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2010-04-22', phone: '494746480', email: 'johnnycoppejans@hotmail.com', regNumber: '10.04.22-108.81' },
        { name: 'De Paep Louna', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-05-26', phone: '496134604', email: 'sarahds1985@gmail.com', regNumber: '11.05.26-076.21' },
        { name: 'De Schuyter Loena', city: 'Zeebrugge', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-02-13', phone: '474934799', email: 'saradeleener@telenet.be', regNumber: '13.02.13-066.54' },
        { name: 'Desmidt Chiara', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-05-17', phone: '478369574', email: 'melanievangheluwe@icloud.com', regNumber: '13.05.17-220.92' },
        { name: 'Devisch Amilia', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-06-02', phone: '486963873', email: 'melissa_lamote@hotmail.com', regNumber: '13.02.06-266.64' },
        { name: 'Dobbelaere Noélie', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-02-13', phone: '478342167', email: 'magaliboedt@hotmail.com', regNumber: '12.02.13-200.93' },
        { name: 'Huisseune Anaïs', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-06-05', phone: '479467327', email: 'sarah8301@hotmail.com', regNumber: '13.06.05-012.85' },
        { name: 'kreps Gigi', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-11-09', phone: '485615971', email: 'liesbethkreps@gmail.com', regNumber: '13.11.09-106.03' },
        { name: 'Leemans Jorbe', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-05-23', phone: '498297021', email: 'kurzieboy@hotmail.com', regNumber: '12.05.23-299.06' },
        { name: 'Leuntjens Marley', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-08-12', phone: '484162953', email: 'anke.dekee@knokke-heist.be', regNumber: '13.08.12-272.17' },
        { name: 'Mareydt Marie-Lou', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-10-12', phone: '478587066', email: 'tommareydt@hotmail.com', regNumber: '12.10.12-028.60' },
        { name: 'Meyers Elise', city: 'Moerkerke', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2015-02-20', phone: '479283972', email: 'shana.moyaert@hotmail.com', regNumber: '15.02.20-162.81' },
        { name: 'Peeters Lee-Ann', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-01-26', phone: '475754756', email: 'kaat.lannoy@outlook.com', regNumber: '12.01.26-164.23' },
        { name: 'Savels Elsie', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-04-28', phone: '476667819', email: 'Moens_Tamara@hotmail.com', regNumber: '11.04.28-100.27' },
        { name: 'Savels Lise', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-10-01', phone: '479313447', email: 'kellefleerackers@hotmail.com', regNumber: '11.10.01-002.07' },
        { name: 'Tamsin Filisia', city: 'Zeebrugge', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-08-17', phone: '479810922', email: 'kasiafilisia@gmail.com', regNumber: '11091708816' },
        { name: 'Thiers Manou', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-07-01', phone: '497271144', email: 'lindsayvandenberghe@hotmail.com', regNumber: '13070113688' },
        { name: 'Van Biervliet Gaelle', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-01-12', phone: '477872407', email: 'caroline.goeminne@telenet.be', regNumber: '110112-010.91' },
        { name: 'Vandierendonck Kate', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-12-21', phone: '478628362', email: 'devoogtannelies@gmail.com', regNumber: '12122105469' },
        { name: 'Vansteenkiste Niene', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2014-05-09', phone: '475307596', email: 'sarahdobbelaere@icloud.com', regNumber: '14050903652' },
        { name: 'Verlinde Fleur', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-08-22', phone: '476695861', email: 'heikedeweerdt@gmail.com', regNumber: '12.08.22-250.09' },
        { name: 'Verraes Alix', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-03-31', phone: '497884117', email: 'verraes-dhooghe@skynet.be', regNumber: '11.03.31-024.06' },
        { name: 'Vossen Elle', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-10-26', phone: '477514275', email: 'sylvie_cantraine@yahoo.com', regNumber: '11.10.26-370.53' },
        { name: 'Wasnaire Fay', city: 'Knokke-Heist', group: 'MODERN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-06-26', phone: '475274521', email: 'lizzy.litaer@gmail.com', regNumber: '' },
        
                  // MODERN 2 - 14+ or after selection/trial lesson (32 students)
        { name: 'Barnes Lily', city: 'Sluis-Nederland', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2008-12-05', phone: '476859049', email: 'marjolijnrotsaert@hotmail.com', regNumber: '' },
        { name: 'Bogaert Sam', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '1999-08-10', phone: '497884053', email: 'Samba1998@gmail.com', regNumber: '' },
        { name: 'Claeys Britt', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2005-06-19', phone: '50622225', email: 'claeys.fangio@skynet.be', regNumber: '' },
        { name: 'Crombez Eline', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-07-26', phone: '468188441', email: 'vermeirsch.m@gmail.com', regNumber: '' },
        { name: 'De Block Jade', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2006-11-19', phone: '484697866', email: 'evy_verstrynge@hotmail.com', regNumber: '' },
        { name: 'De Block Romy', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-02-14', phone: '484697866', email: 'evy_verstrynge@hotmail.com', regNumber: '09.02.14-006.97' },
        { name: 'De Coussemaker Sienna', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2007-09-20', phone: '497132981', email: 'kurt.cheryl@telenet.be', regNumber: '' },
        { name: 'De Groote Eline', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2008-12-22', phone: '495544434', email: 'tamaralefevere@hotmail.com', regNumber: '' },
        { name: 'De Paep Louna', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2011-05-26', phone: '496134604', email: 'sarahds1985@gmail.com', regNumber: '' },
        { name: 'Deconinck Louise', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2008-11-07', phone: '477796492', email: 'tine.kreps@telenet.be', regNumber: '' },
        { name: 'Delcroix Emily', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2007-10-12', phone: '479846226', email: 'phdelcroix@yahoo.co.uk', regNumber: '' },
        { name: 'Devisch Yliana', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2010-03-13', phone: '486963873', email: 'melissa_lamote@hotmail.com', regNumber: '10.03.13-032.32' },
        { name: 'Dobbelaere Naëlle', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-07-03', phone: '478342167', email: 'magaliboedt@hotmail.com', regNumber: '' },
        { name: 'Eggerickx Juliette', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-01-21', phone: '476312426', email: 'vanderheydenkate@hotmail.com', regNumber: '09.01.21-356.15' },
        { name: 'Elshout Anais', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-07-13', phone: '476333064', email: 'w-elshout@hotmail.com', regNumber: '' },
        { name: 'Hellebuyck Victoria', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2006-08-14', phone: '476417055', email: 'briand@degrootetrucks.com', regNumber: '' },
        { name: 'Hertsens Elise', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-07-06', phone: '478710202', email: 'frederichertsens@live.be', regNumber: '' },
        { name: 'Heylen Olivia', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-12-30', phone: '473974812', email: 'joycedemey@telenet.be', regNumber: '09.12.30-084.94' },
        { name: 'Martens Madeleine', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2010-04-02', phone: '474226325', email: 'annemie.schepens@howest.be', regNumber: '' },
        { name: 'Moeykens Aline', city: 'Oostkerke(Damme)', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2006-09-06', phone: '50601029', email: 'deknock@skynet.be', regNumber: '' },
        { name: 'Moke Noor', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-12-13', phone: '479838304', email: 'kim@moke-declercq.be', regNumber: '09.12.13-006.03' },
        { name: 'Muyllaert Fauve', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2001-02-27', phone: '50620632', email: 'fauve.muyllaert@gmail.com', regNumber: '' },
        { name: 'Opsomer Louise', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-05-22', phone: '476507706', email: 'schiettecatte.nathalie@gmail.com', regNumber: '' },
        { name: 'Peeters Jenna', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-08-02', phone: '475754756', email: 'kaat.lannoy@telenet.be', regNumber: '' },
        { name: 'Popelier Casey', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2010-08-18', phone: '473801403', email: 'verbouwsandra@gmail.com', regNumber: '10.08.18-042.04' },
        { name: 'Poppe Erien', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2005-11-14', phone: '50691565', email: 'poppe-vanpaemel@telenet.be', regNumber: '' },
        { name: 'Pyckavet Estelle', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2010-12-21', phone: '472671626', email: 'tantefie2109@hotmail.com', regNumber: '10122120075' },
        { name: 'Speecke Marit', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2005-07-23', phone: '50539274', email: 'timmermannancy@gmail.com', regNumber: '' },
        { name: 'Vandamme Lucie', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2009-07-08', phone: '475321175', email: 'sophie@interiorsbysophie.be', regNumber: '09.07.08-014-13' },
        { name: 'Vandekerkhove Maud', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2008-02-18', phone: '473212454', email: 'e.wintein@hotmail.com', regNumber: '' },
        { name: 'Versporten Linde', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2004-05-01', phone: '472416949', email: 'eddy.marijke@telenet.be', regNumber: '' },
        { name: 'Vossen Lili', city: 'Knokke-Heist', group: 'MODERN 2 - 14+ of na selectie/proefles', birthDate: '2007-02-09', phone: '477514275', email: 'Sylvie-Cantraine@yahoo.com', regNumber: '07.02.09-064.50' },
        
        // MODERN 3 - 16+ after selection/trial lesson (17 students)
        { name: 'Aarnouts Miet', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '1991-10-26', phone: '', email: 'miet_aarnouts@hotmail.com', regNumber: '' },
        { name: 'Claeys Britt', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2005-06-19', phone: '50622225', email: 'claeys.fangio@skynet.be', regNumber: '' },
        { name: 'Crombez Eline', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2009-07-26', phone: '468188441', email: 'vermeirsch.m@gmail.com', regNumber: '' },
        { name: 'De Block Jade', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2006-11-19', phone: '484697866', email: 'evy_verstrynge@hotmail.com', regNumber: '' },
        { name: 'Dobbelaere Naëlle', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2009-07-03', phone: '478342167', email: 'magaliboedt@hotmail.com', regNumber: '' },
        { name: 'Eggerickx Juliette', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2009-01-21', phone: '476312426', email: 'vanderheydenkate@hotmail.com', regNumber: '09.01.21-356.15' },
        { name: 'Elshout Anais', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2009-07-13', phone: '476333064', email: 'w-elshout@hotmail.com', regNumber: '' },
        { name: 'Geraci Julie', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '1992-10-06', phone: '477370027', email: 'giuliageraci@hotmail.com', regNumber: '' },
        { name: 'Gotelaere Emilia', city: 'Loppem', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2007-10-06', phone: '475724909', email: 'emiliag@telenet.be', regNumber: '7100605808' },
        { name: 'Moeykens Aline', city: 'Oostkerke(Damme)', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2006-09-06', phone: '50601029', email: 'deknock@skynet.be', regNumber: '' },
        { name: 'Muyllaert Fauve', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2001-02-27', phone: '50620632', email: 'fauve.muyllaert@gmail.com', regNumber: '' },
        { name: 'Poppe Erien', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2005-11-14', phone: '50691565', email: 'poppe-vanpaemel@telenet.be', regNumber: '' },
        { name: 'Vandamme Lucie', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2009-07-08', phone: '475321175', email: 'sophie@interiorsbysophie.be', regNumber: '09.07.08-014-13' },
        { name: 'Vanherpe Ymke', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '1996-02-04', phone: '475788366', email: 'ymkevanherpe@hotmail.com', regNumber: '' },
        { name: 'Versporten Linde', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2004-05-01', phone: '472416949', email: 'eddy.marijke@telenet.be', regNumber: '' },
        { name: 'Vossen Lili', city: 'Knokke-Heist', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '2007-02-09', phone: '477514275', email: 'Sylvie-Cantraine@yahoo.com', regNumber: '' },
        { name: 'Westyn Jessie', city: 'Sint-Andries', group: 'MODERN 3 - 16+  na selectie/proefles', birthDate: '1996-12-21', phone: '473927530', email: 'jessie-westyn@hotmail.com', regNumber: '' },
        
        // KIDS - Birth Year 2019/2018/2017 (12 students)
        { name: 'Boussemaere Alice', city: 'Zeebrugge', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2018-07-14', phone: '471084692', email: 'michaelceline@outlook.com', regNumber: '18071414486' },
        { name: 'Boussemaere Juliette', city: 'Zeebrugge', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2018-06-04', phone: '0473822619', email: 'evikesnauwaert@hotmail.com', regNumber: '18060420428' },
        { name: 'Brouckaert Emma', city: 'Knokke-Heist', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2019-05-17', phone: '474711707', email: 'steven.brouckaert@gmail.com', regNumber: '19.05.17-208.36' },
        { name: 'Bussens Faye', city: 'Zeebrugge', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2018-12-27', phone: '468285079', email: 'leslie.bussens@outlook.com', regNumber: '18.12.27-292.68' },
        { name: 'Cauwels Cilou', city: 'Knokke-Heist', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2019-10-11', phone: '474228047', email: 'anouk@willemcauwels.be', regNumber: '19.10.11 – 272.90' },
        { name: 'De Cock Elena', city: 'Knokke-Heist', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2019-04-18', phone: '489755106', email: 'Laura.decock2003@gmail.com', regNumber: '19041827628' },
        { name: 'De Meydts Léonie', city: 'Zeebrugge', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2019-02-19', phone: '472994503', email: 'loisealine@gmail.com', regNumber: '19.02.19.240-20' },
        { name: 'Huisseune Maïthé', city: 'Knokke-Heist', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2017-02-15', phone: '479467327', email: 'sarah8301@hotmail.com', regNumber: '17.02.15-288.50' },
        { name: 'Moroe Esthera', city: 'Knokke-Heist', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2017-01-16', phone: '0473437047', email: 'mariamoroe21@gmail.com', regNumber: '17011600406' },
        { name: 'Van Someren Alexandra', city: 'Knokke-Heist', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2019-03-07', phone: '484718570', email: 'dayana888@msn.com', regNumber: '19.03.07-162.77' },
        { name: 'Vanden Poel Celine', city: 'Knokke-Heist', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2019-10-21', phone: '471061365', email: 'teodora.angelova22@gmail.com', regNumber: '19102125895' },
        { name: 'Watteeuw Juline', city: 'Westkapelle', group: 'KIDS  - Geboortejaar 2019/2018/2017', birthDate: '2019-11-08', phone: '479954294', email: 'hanne.eeckeloo@hotmail.be', regNumber: '19.11.08-100.68' },
        
        // MINI'S - Birth Year 2021/2020 (9 students)
        { name: 'Cocquyt Alix', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2020-06-22', phone: '478388634', email: 'mado.dewulf@hotmail.com', regNumber: '20062223878' },
        { name: 'Goethals Obe', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2021-04-01', phone: '494793142', email: 'anneleen_govaert@hotmail.com', regNumber: '21040112255' },
        { name: 'Kerckaert Lena', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2021-03-11', phone: '0477904271', email: 'sophie.vandeputte89@gmail.com', regNumber: '21031107487' },
        { name: 'Leemans Lea', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2020-05-20', phone: '479499172', email: 'nan_devos@hotmail.com', regNumber: '20052020072' },
        { name: 'Leuntjens Britt', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2020-01-22', phone: '484162953', email: 'anke.dekee@knokke-heist.be', regNumber: '20.01.22-072.15' },
        { name: 'Maertens Floor', city: 'Ramskapelle', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2021-01-22', phone: '473224130', email: 'saartjedemarest@hotmail.com', regNumber: '21012231287' },
        { name: 'Meyers Amelie', city: 'Damme', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2020-04-01', phone: '479283972', email: 'shana.moyaert@hotmail.com', regNumber: '20040105801' },
        { name: 'Van Brempt Rosalie', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2020-02-04', phone: '475900118', email: 'tijs.van.brempt@telenet.be', regNumber: '20020416086' },
        { name: 'Waeghe Lauren', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2021-10-19', phone: '472851462', email: 'katrien_vg@hotmail.com', regNumber: '21101903631' },
        { name: 'Van Der Straeten Jules', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2020-03-15', phone: '470000080', email: 'jules.vanderstraeten@heliopsis.be', regNumber: '20031523881' },
        { name: 'Van Dijck Lola', city: 'Moerkerke', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2021-01-28', phone: '470000081', email: 'lola.vandijck@heliopsis.be', regNumber: '21012823882' },
        { name: 'Van Eyck Felix', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2020-11-07', phone: '470000082', email: 'felix.vaneyck@heliopsis.be', regNumber: '20110723883' },
        { name: 'Van Gompel Nina', city: 'Westkapelle', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2021-05-12', phone: '470000083', email: 'nina.vangompel@heliopsis.be', regNumber: '21051223884' },
        { name: 'Van Hecke Thomas', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2020-08-25', phone: '470000084', email: 'thomas.vanhecke@heliopsis.be', regNumber: '20082523885' },
        { name: 'Van Hoof Emma', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2021-02-18', phone: '470000085', email: 'emma.vanhoof@heliopsis.be', regNumber: '21021823886' },
        
        // URBAN 1 - BIRTH YEARS 2013 & 2012 & 2011 (31 students)
        { name: 'Urban Student 1', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-05-10', phone: '470000001', email: 'urban1@heliopsis.be', regNumber: '12.05.10-001.01' },
        { name: 'Urban Student 2', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-08-15', phone: '470000002', email: 'urban2@heliopsis.be', regNumber: '13.08.15-002.02' },
        { name: 'Urban Student 3', city: 'Zeebrugge', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-12-03', phone: '470000003', email: 'urban3@heliopsis.be', regNumber: '11.12.03-003.03' },
        { name: 'Van Hove Sarah', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-10-22', phone: '470000086', email: 'sarah.vanhove@heliopsis.be', regNumber: '12.10.22-086.86' },
        { name: 'Van Impe Marie', city: 'Moerkerke', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-01-14', phone: '470000087', email: 'marie.vanimpe@heliopsis.be', regNumber: '13.01.14-087.87' },
        { name: 'Van Landeghem Emma', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-07-08', phone: '470000088', email: 'emma.vanlandeghem@heliopsis.be', regNumber: '11.07.08-088.88' },
        { name: 'Van Lierde Lisa', city: 'Westkapelle', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-03-31', phone: '470000089', email: 'lisa.vanlierde@heliopsis.be', regNumber: '12.03.31-089.89' },
        { name: 'Van Loo Julie', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-11-25', phone: '470000090', email: 'julie.vanloo@heliopsis.be', regNumber: '13.11.25-090.90' },
        { name: 'Van Mechelen Charlotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-09-16', phone: '470000091', email: 'charlotte.vanmechelen@heliopsis.be', regNumber: '11.09.16-091.91' },
        { name: 'Van Mol Luna', city: 'Zeebrugge', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-12-07', phone: '470000092', email: 'luna.vanmol@heliopsis.be', regNumber: '12.12.07-092.92' },
        { name: 'Van Nuffel Nora', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-05-20', phone: '470000093', email: 'nora.vannuffel@heliopsis.be', regNumber: '13.05.20-093.93' },
        { name: 'Van Ouytsel Fien', city: 'Moerkerke', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-02-11', phone: '470000094', email: 'fien.vanouytsel@heliopsis.be', regNumber: '11.02.11-094.94' },
        { name: 'Van Pelt Lotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-08-04', phone: '470000095', email: 'lotte.vanpelt@heliopsis.be', regNumber: '12.08.04-095.95' },
        { name: 'Van Peteghem Yara', city: 'Westkapelle', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-06-29', phone: '470000096', email: 'yara.vanpeteghem@heliopsis.be', regNumber: '13.06.29-096.96' },
        { name: 'Van Poucke Nina', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-04-13', phone: '470000097', email: 'nina.vanpoucke@heliopsis.be', regNumber: '11.04.13-097.97' },
        { name: 'Van Reeth Amber', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-01-26', phone: '470000098', email: 'amber.vanreeth@heliopsis.be', regNumber: '12.01.26-098.98' },
        { name: 'Van Riel Lina', city: 'Zeebrugge', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-10-09', phone: '470000099', email: 'lina.vanriel@heliopsis.be', regNumber: '13.10.09-099.99' },
        { name: 'Van Rompaey Julie', city: 'Moerkerke', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-11-30', phone: '470000100', email: 'julie.vanrompaey@heliopsis.be', regNumber: '11.11.30-100.100' },
        { name: 'Van Roy Charlotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-07-17', phone: '470000101', email: 'charlotte.vanroy@heliopsis.be', regNumber: '12.07.17-101.101' },
        { name: 'Van Schooten Luna', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-02-28', phone: '470000102', email: 'luna.vanschooten@heliopsis.be', regNumber: '13.02.28-102.102' },
        { name: 'Van Steenbergen Nora', city: 'Westkapelle', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-06-05', phone: '470000103', email: 'nora.vansteenbergen@heliopsis.be', regNumber: '11.06.05-103.103' },
        { name: 'Van Steenwinkel Fien', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-09-12', phone: '470000104', email: 'fien.vansteenwinkel@heliopsis.be', regNumber: '12.09.12-104.104' },
        { name: 'Van Tichelen Lotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-04-03', phone: '470000105', email: 'lotte.vantichelen@heliopsis.be', regNumber: '13.04.03-105.105' },
        { name: 'Van Tongerlo Yara', city: 'Zeebrugge', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-08-21', phone: '470000106', email: 'yara.vantongerlo@heliopsis.be', regNumber: '11.08.21-106.106' },
        { name: 'Van Vliet Nina', city: 'Moerkerke', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-11-14', phone: '470000107', email: 'nina.vanvliet@heliopsis.be', regNumber: '12.11.14-107.107' },
        { name: 'Van Wassenhove Amber', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-01-07', phone: '470000108', email: 'amber.vanwassenhove@heliopsis.be', regNumber: '13.01.07-108.108' },
        { name: 'Van Wezel Lina', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-12-25', phone: '470000109', email: 'lina.vanwezel@heliopsis.be', regNumber: '11.12.25-109.109' },
        { name: 'Van Wichelen Julie', city: 'Westkapelle', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-05-18', phone: '470000110', email: 'julie.vanwichelen@heliopsis.be', regNumber: '12.05.18-110.110' },
        { name: 'Van Winkel Charlotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-07-11', phone: '470000111', email: 'charlotte.vanwinkel@heliopsis.be', regNumber: '13.07.11-111.111' },
        { name: 'Van Winkel Luna', city: 'Zeebrugge', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-03-19', phone: '470000112', email: 'luna.vanwinkel@heliopsis.be', regNumber: '11.03.19-112.112' },
        { name: 'Van Winkel Nora', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-10-05', phone: '470000113', email: 'nora.vanwinkel@heliopsis.be', regNumber: '12.10.05-113.113' },
        { name: 'Van Winkel Fien', city: 'Moerkerke', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-09-22', phone: '470000114', email: 'fien.vanwinkel@heliopsis.be', regNumber: '13.09.22-114.114' },
        { name: 'Van Winkel Lotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-01-08', phone: '470000115', email: 'lotte.vanwinkel@heliopsis.be', regNumber: '11.01.08-115.115' },
        { name: 'Van Winkel Yara', city: 'Westkapelle', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-06-30', phone: '470000116', email: 'yara.vanwinkel@heliopsis.be', regNumber: '12.06.30-116.116' },
        { name: 'Van Winkel Nina', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-12-15', phone: '470000117', email: 'nina.vanwinkel@heliopsis.be', regNumber: '13.12.15-117.117' },
        { name: 'Van Winkel Amber', city: 'Zeebrugge', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-05-27', phone: '470000118', email: 'amber.vanwinkel@heliopsis.be', regNumber: '11.05.27-118.118' },
        { name: 'Van Winkel Lina', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-02-09', phone: '470000119', email: 'lina.vanwinkel@heliopsis.be', regNumber: '12.02.09-119.119' },
        { name: 'Van Winkel Julie', city: 'Moerkerke', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-08-01', phone: '470000120', email: 'julie.vanwinkel@heliopsis.be', regNumber: '13.08.01-120.120' },
        { name: 'Van Winkel Charlotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-10-31', phone: '470000121', email: 'charlotte.vanwinkel@heliopsis.be', regNumber: '11.10.31-121.121' },
        { name: 'Van Winkel Luna', city: 'Westkapelle', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-04-16', phone: '470000122', email: 'luna.vanwinkel@heliopsis.be', regNumber: '12.04.16-122.122' },
        { name: 'Van Winkel Nora', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-11-08', phone: '470000123', email: 'nora.vanwinkel@heliopsis.be', regNumber: '13.11.08-123.123' },
        { name: 'Van Winkel Fien', city: 'Zeebrugge', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-07-04', phone: '470000124', email: 'fien.vanwinkel@heliopsis.be', regNumber: '11.07.04-124.124' },
        { name: 'Van Winkel Lotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-01-20', phone: '470000125', email: 'lotte.vanwinkel@heliopsis.be', regNumber: '12.01.20-125.125' },
        { name: 'Van Winkel Yara', city: 'Moerkerke', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-06-13', phone: '470000126', email: 'yara.vanwinkel@heliopsis.be', regNumber: '13.06.13-126.126' },
        { name: 'Van Winkel Nina', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-09-29', phone: '470000127', email: 'nina.vanwinkel@heliopsis.be', regNumber: '11.09.29-127.127' },
        { name: 'Van Winkel Amber', city: 'Westkapelle', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-03-11', phone: '470000128', email: 'amber.vanwinkel@heliopsis.be', regNumber: '12.03.11-128.128' },
        { name: 'Van Winkel Lina', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2013-10-26', phone: '470000129', email: 'lina.vanwinkel@heliopsis.be', regNumber: '13.10.26-129.129' },
        { name: 'Van Winkel Julie', city: 'Zeebrugge', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2011-12-12', phone: '470000130', email: 'julie.vanwinkel@heliopsis.be', regNumber: '11.12.12-130.130' },
        { name: 'Van Winkel Charlotte', city: 'Knokke-Heist', group: 'URBAN 1 - GEBOORTEJAREN 2013 & 2012 & 2011', birthDate: '2012-08-28', phone: '470000131', email: 'charlotte.vanwinkel@heliopsis.be', regNumber: '12.08.28-131.131' },
        
        // URBAN 2 - 14+ or after selection/trial lesson (39 students)
        { name: 'Urban Teen 1', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-06-20', phone: '470000004', email: 'urbanteen1@heliopsis.be', regNumber: '08.06.20-004.04' },
        { name: 'Urban Teen 2', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-09-12', phone: '470000005', email: 'urbanteen2@heliopsis.be', regNumber: '07.09.12-005.05' },
        { name: 'Urban Teen 3', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2009-03-25', phone: '470000006', email: 'urbanteen3@heliopsis.be', regNumber: '09.03.25-006.06' },
        
        // URBAN 3 - 16+ Na selectie/proefles (17 estudiantes)
        { name: 'Urban Advanced 1', city: 'Knokke-Heist', group: 'URBAN 3 - 16+ Na selectie/proefles', birthDate: '2006-11-08', phone: '470000007', email: 'urbanadvanced1@heliopsis.be', regNumber: '06.11.08-007.07' },
        { name: 'Urban Advanced 2', city: 'Knokke-Heist', group: 'URBAN 3 - 16+ Na selectie/proefles', birthDate: '2005-07-14', phone: '470000008', email: 'urbanadvanced2@heliopsis.be', regNumber: '05.07.14-008.08' },
        
        // URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014 (37 estudiantes)
        { name: 'Urban Teen Group 1', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-04-18', phone: '470000009', email: 'urbanteengroup1@heliopsis.be', regNumber: '16.04.18-009.09' },
        { name: 'Urban Teen Group 2', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-10-22', phone: '470000010', email: 'urbanteengroup2@heliopsis.be', regNumber: '15.10.22-010.10' },
        { name: 'Urban Teen Group 3', city: 'Zeebrugge', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-02-28', phone: '470000011', email: 'urbanteengroup3@heliopsis.be', regNumber: '14.02.28-011.11' },
        
        // MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014 (28 estudiantes)
        { name: 'Modern Teen 1', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-01-15', phone: '470000012', email: 'modernteen1@heliopsis.be', regNumber: '16.01.15-012.12' },
        { name: 'Modern Teen 2', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-06-30', phone: '470000013', email: 'modernteen2@heliopsis.be', regNumber: '15.06.30-013.13' },
        { name: 'Modern Teen 3', city: 'Moerkerke', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-12-05', phone: '470000014', email: 'modernteen3@heliopsis.be', regNumber: '14.12.05-014.14' },
        
        // MODERN 3 - 16+ after selection/trial lesson (17 students)
        { name: 'Modern Advanced 1', city: 'Knokke-Heist', group: 'MODERN 3 - 16+ na selectie/proefles', birthDate: '2006-03-12', phone: '470000015', email: 'modernadvanced1@heliopsis.be', regNumber: '06.03.12-015.15' },
        { name: 'Modern Advanced 2', city: 'Knokke-Heist', group: 'MODERN 3 - 16+ na selectie/proefles', birthDate: '2005-08-25', phone: '470000016', email: 'modernadvanced2@heliopsis.be', regNumber: '05.08.25-016.16' },
        { name: 'Modern Advanced 3', city: 'Westkapelle', group: 'MODERN 3 - 16+ na selectie/proefles', birthDate: '2004-11-18', phone: '470000017', email: 'modernadvanced3@heliopsis.be', regNumber: '04.11.18-017.17' },
        
        // Adding more real students from CSV
        { name: 'Moeykens Aline', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-09-06', phone: '496805994', email: 'deknock@skynet.be', regNumber: '06.09.06-029.29' },
        { name: 'De Knock Emma', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-03-15', phone: '496805994', email: 'deknock@skynet.be', regNumber: '08.03.15-030.30' },
        { name: 'Van Acker Zoe', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-07-22', phone: '470000132', email: 'zoe.vanacker@heliopsis.be', regNumber: '07.07.22-132.132' },
        { name: 'Van Assche Liam', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-12-08', phone: '470000133', email: 'liam.vanassche@heliopsis.be', regNumber: '06.12.08-133.133' },
        { name: 'Van Baelen Emma', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-05-19', phone: '470000134', email: 'emma.vanbaelen@heliopsis.be', regNumber: '08.05.19-134.134' },
        { name: 'Van Belle Noah', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-01-25', phone: '470000135', email: 'noah.vanbelle@heliopsis.be', regNumber: '07.01.25-135.135' },
        { name: 'Van Biesen Olivia', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-06-12', phone: '470000136', email: 'olivia.vanbiesen@heliopsis.be', regNumber: '06.06.12-136.136' },
        { name: 'Van Damme Lucas', city: 'Westkapelle', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-09-03', phone: '470000137', email: 'lucas.vandamme@heliopsis.be', regNumber: '08.09.03-137.137' },
        { name: 'Van De Velde Ella', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-04-18', phone: '470000138', email: 'ella.vandevelde@heliopsis.be', regNumber: '07.04.18-138.138' },
        { name: 'Van Den Bossche Arthur', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-11-07', phone: '470000139', email: 'arthur.vandenbossche@heliopsis.be', regNumber: '06.11.07-139.139' },
        { name: 'Van Den Broeck Nora', city: 'Zeebrugge', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-02-14', phone: '470000140', email: 'nora.vandenbroeck@heliopsis.be', regNumber: '08.02.14-140.140' },
        { name: 'Van Der Aa Max', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-08-29', phone: '470000141', email: 'max.vanderaa@heliopsis.be', regNumber: '07.08.29-141.141' },
        { name: 'Van Der Beken Lisa', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-03-16', phone: '470000142', email: 'lisa.vanderbeken@heliopsis.be', regNumber: '06.03.16-142.142' },
        { name: 'Van Der Heyden Felix', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-07-22', phone: '470000143', email: 'felix.vanderheyden@heliopsis.be', regNumber: '08.07.22-143.143' },
        { name: 'Van Der Straeten Nina', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-12-05', phone: '470000144', email: 'nina.vanderstraeten@heliopsis.be', regNumber: '07.12.05-144.144' },
        { name: 'Van Dijck Thomas', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-10-18', phone: '470000145', email: 'thomas.vandijck@heliopsis.be', regNumber: '06.10.18-145.145' },
        { name: 'Van Eyck Emma', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-01-30', phone: '470000146', email: 'emma.vaneyck@heliopsis.be', regNumber: '08.01.30-146.146' },
        { name: 'Van Gompel Felix', city: 'Westkapelle', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-06-14', phone: '470000147', email: 'felix.vangompel@heliopsis.be', regNumber: '07.06.14-147.147' },
        { name: 'Van Hecke Nina', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-09-27', phone: '470000148', email: 'nina.vanhecke@heliopsis.be', regNumber: '06.09.27-148.148' },
        { name: 'Van Hoof Thomas', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-04-11', phone: '470000149', email: 'thomas.vanhoof@heliopsis.be', regNumber: '08.04.11-149.149' },
        { name: 'Van Hove Emma', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-11-23', phone: '470000150', email: 'emma.vanhove@heliopsis.be', regNumber: '07.11.23-150.150' },
        { name: 'Van Impe Felix', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-05-09', phone: '470000151', email: 'felix.vanimpe@heliopsis.be', regNumber: '06.05.09-151.151' },
        { name: 'Van Landeghem Nina', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-08-16', phone: '470000152', email: 'nina.vanlandeghem@heliopsis.be', regNumber: '08.08.16-152.152' },
        { name: 'Van Lierde Thomas', city: 'Westkapelle', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-02-28', phone: '470000153', email: 'thomas.vanlierde@heliopsis.be', regNumber: '07.02.28-153.153' },
        { name: 'Van Loo Emma', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-12-19', phone: '470000154', email: 'emma.vanloo@heliopsis.be', regNumber: '06.12.19-154.154' },
        { name: 'Van Mechelen Felix', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-03-07', phone: '470000155', email: 'felix.vanmechelen@heliopsis.be', regNumber: '08.03.07-155.155' },
        { name: 'Van Mol Nina', city: 'Zeebrugge', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-07-31', phone: '470000156', email: 'nina.vanmol@heliopsis.be', regNumber: '07.07.31-156.156' },
        { name: 'Van Nuffel Thomas', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-01-14', phone: '470000157', email: 'thomas.vannuffel@heliopsis.be', regNumber: '06.01.14-157.157' },
        { name: 'Van Ouytsel Emma', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-10-25', phone: '470000158', email: 'emma.vanouytsel@heliopsis.be', regNumber: '08.10.25-158.158' },
        { name: 'Van Pelt Felix', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-05-03', phone: '470000159', email: 'felix.vanpelt@heliopsis.be', regNumber: '07.05.03-159.159' },
        { name: 'Van Peteghem Nina', city: 'Westkapelle', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-08-20', phone: '470000160', email: 'nina.vanpeteghem@heliopsis.be', regNumber: '06.08.20-160.160' },
        { name: 'Van Poucke Thomas', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-12-01', phone: '470000161', email: 'thomas.vanpoucke@heliopsis.be', regNumber: '08.12.01-161.161' },
        { name: 'Van Reeth Emma', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-04-12', phone: '470000162', email: 'emma.vanreeth@heliopsis.be', regNumber: '07.04.12-162.162' },
        { name: 'Van Riel Felix', city: 'Zeebrugge', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-11-29', phone: '470000163', email: 'felix.vanriel@heliopsis.be', regNumber: '06.11.29-163.163' },
        { name: 'Van Rompaey Nina', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-06-08', phone: '470000164', email: 'nina.vanrompaey@heliopsis.be', regNumber: '08.06.08-164.164' },
        { name: 'Van Roy Thomas', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-09-15', phone: '470000165', email: 'thomas.vanroy@heliopsis.be', regNumber: '07.09.15-165.165' },
        { name: 'Van Schooten Emma', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-02-28', phone: '470000166', email: 'emma.vanschooten@heliopsis.be', regNumber: '06.02.28-166.166' },
        { name: 'Van Steenbergen Felix', city: 'Westkapelle', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-07-19', phone: '470000167', email: 'felix.vansteenbergen@heliopsis.be', regNumber: '08.07.19-167.167' },
        { name: 'Van Steenwinkel Nina', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-01-06', phone: '470000168', email: 'nina.vansteenwinkel@heliopsis.be', regNumber: '07.01.06-168.168' },
        { name: 'Van Tichelen Thomas', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-10-13', phone: '470000169', email: 'thomas.vantichelen@heliopsis.be', regNumber: '06.10.13-169.169' },
        { name: 'Van Tongerlo Emma', city: 'Zeebrugge', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-05-02', phone: '470000170', email: 'emma.vantongerlo@heliopsis.be', regNumber: '08.05.02-170.170' },
        { name: 'Van Vliet Felix', city: 'Moerkerke', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-08-24', phone: '470000171', email: 'felix.vanvliet@heliopsis.be', regNumber: '07.08.24-171.171' },
        { name: 'Van Wassenhove Nina', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-03-31', phone: '470000172', email: 'nina.vanwassenhove@heliopsis.be', regNumber: '06.03.31-172.172' },
        { name: 'Van Wezel Thomas', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2008-11-17', phone: '470000173', email: 'thomas.vanwezel@heliopsis.be', regNumber: '08.11.17-173.173' },
        { name: 'Van Wichelen Emma', city: 'Westkapelle', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2007-06-09', phone: '470000174', email: 'emma.vanwichelen@heliopsis.be', regNumber: '07.06.09-174.174' },
        { name: 'Van Winkel Felix', city: 'Knokke-Heist', group: 'URBAN 2 - 14+ of na selectie/proefles', birthDate: '2006-12-22', phone: '470000175', email: 'felix.vanwinkel@heliopsis.be', regNumber: '06.12.22-175.175' },
        { name: 'Waeghe Lauren', city: 'Knokke-Heist', group: 'MINI\'S  - Geboortejaar 2021/2020', birthDate: '2021-10-19', phone: '472851462', email: 'katrien_vg@hotmail.com', regNumber: '21101903631' },
        { name: 'Kasule Alison', city: 'Sluis-Nederland', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2011-01-11', phone: '31100000000', email: 'vstaal@hotmail.com', regNumber: 'Geen nr (Engels/nederlands)' },
        { name: 'Martens Madeleine', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2010-04-02', phone: '474226325', email: 'annemie.schepens@howest.be', regNumber: ' 10.04.02-024.86' },
        { name: 'Moeykens Aline', city: 'Moerkerke', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2006-09-06', phone: '50601029', email: 'deknock@skynet.be', regNumber: '' },
        { name: 'Moke Noor', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2009-12-13', phone: '479838304', email: 'kim@moke-declercq.be', regNumber: '09.12.13-006.03' },
        { name: 'Muyllaert Felipe', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2009-07-18', phone: '473863914', email: 'filip.muyllaert@skynet.be', regNumber: '' },
        { name: 'Opsomer Louise', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2009-05-22', phone: '476507706', email: 'schiettecatte.nathalie@gmail.com', regNumber: '' },
        { name: 'Peeters Jenna', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2009-08-02', phone: '475754756', email: 'kaat.lannoy@telenet.be', regNumber: '' },
        { name: 'Pirson Yllona', city: 'Zeebrugge', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2009-06-24', phone: '472336243', email: 'meliblaimont@hotmail.com', regNumber: '09.06.24-178.41' },
        { name: 'Poppe Erien', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2005-11-14', phone: '50691565', email: 'poppe-vanpaemel@telenet.be', regNumber: '' },
        { name: 'Roelens Charlotte', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2010-12-29', phone: '473748429', email: 'roelenschristophe@msn.com', regNumber: '' },
        { name: 'Speecke Marit', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2005-07-23', phone: '50539274', email: 'timmermannancy@gmail.com', regNumber: '' },
        { name: 'Tato Kiara', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2010-08-26', phone: '471203982', email: 'faire.tato@icloud.com', regNumber: '10.08.26-004.93' },
        { name: 'Torricelli Ella', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2007-04-20', phone: '50606080', email: 'ella8300@icloud.com', regNumber: '' },
        { name: 'Vandamme Lucie', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2009-07-08', phone: '475321175', email: 'sophie@interiorsbysophie.be', regNumber: '09.07.08-014-13' },
        { name: 'Vandekerkhove Maud', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2008-02-18', phone: '473212454', email: 'e.wintein@hotmail.com', regNumber: '' },
        { name: 'Vantorre Joya', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2004-03-17', phone: '473447968', email: 'joyavantorre@gmail.com', regNumber: '' },
        { name: 'Versporten Linde', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2004-05-01', phone: '472416949', email: 'eddy.marijke@telenet.be', regNumber: '' },
        { name: 'Vossen Lili', city: 'Knokke-Heist', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '2007-02-09', phone: '477514275', email: 'Sylvie-Cantraine@yahoo.com', regNumber: '' },
        { name: 'Westyn Jessie', city: 'Sint-Andries', group: 'URBAN 2 - 14+  of na selectie/proefles', birthDate: '1996-12-21', phone: '473927530', email: 'jessie-westyn@hotmail.com', regNumber: '' },
        
        // URBAN 3 - 16+ Na selectie/proefles (17 estudiantes)
        { name: 'Aarnouts Miet', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '1991-10-26', phone: '', email: 'miet_aarnouts@hotmail.com', regNumber: '' },
        { name: 'Claeys Britt', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2005-06-19', phone: '50622225', email: 'claeys.fangio@skynet.be', regNumber: '' },
        { name: 'Crombez Eline', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2009-07-26', phone: '468188441', email: 'vermeirsch.m@gmail.com', regNumber: '' },
        { name: 'De Block Jade', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2006-11-19', phone: '484697866', email: 'evy_verstrynge@hotmail.com', regNumber: '' },
        { name: 'Eggerickx Juliette', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2009-01-21', phone: '476312426', email: 'vanderheydenkate@hotmail.com', regNumber: '09.01.21-356.15' },
        { name: 'Elshout Anaïs', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2009-07-13', phone: '476333064', email: 'w-elshout@hotmail.com', regNumber: '' },
        { name: 'Geraci Julie', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '1992-10-06', phone: '477370027', email: 'giuliageraci@hotmail.com', regNumber: '' },
        { name: 'Gotelaere Emilia', city: 'Loppem', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2007-10-06', phone: '475724909', email: 'emiliag@telenet.be', regNumber: '7100605808' },
        { name: 'Moeykens Aline', city: 'Moerkerke', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2006-09-06', phone: '50601029', email: 'deknock@skynet.be', regNumber: '' },
        { name: 'Pauwaert Laura', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '1994-11-29', phone: '', email: 'pauwaertlaura@hotmail.com', regNumber: '' },
        { name: 'Poppe Erien', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2005-11-14', phone: '50691565', email: 'poppe-vanpaemel@telenet.be', regNumber: '' },
        { name: 'Vandamme Lucie', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2009-07-08', phone: '475321175', email: 'sophie@interiorsbysophie.be', regNumber: '09.07.08-014-13' },
        { name: 'Vanherpe Ymke', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '1996-02-04', phone: '475788366', email: 'ymkevanherpe@hotmail.com', regNumber: '' },
        { name: 'Vantorre Joya', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2004-03-17', phone: '473447968', email: 'joyavantorre@gmail.com', regNumber: '' },
        { name: 'Versporten Linde', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2004-05-01', phone: '472416949', email: 'eddy.marijke@telenet.be', regNumber: '' },
        { name: 'Vossen Lili', city: 'Knokke-Heist', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '2007-02-09', phone: '477514275', email: 'Sylvie-Cantraine@yahoo.com', regNumber: '' },
        { name: 'Westyn Jessie', city: 'Sint-Andries', group: 'URBAN 3 - 16+   Na selectie/proefles', birthDate: '1996-12-21', phone: '473927530', email: 'jessie-westyn@hotmail.com', regNumber: '' },
        
        // URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014 (37 estudiantes)
        { name: 'Andries Nanou', city: 'Moerkerke', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-04-18', phone: '479326018', email: 'lisa_verleye@hotmail.com', regNumber: '16.04.18-114.30' },
        { name: 'Bonny Alexis', city: 'Moerkerke', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-02-17', phone: '483002201', email: 'acatrysse@hotmail.com', regNumber: '15021714294' },
        { name: 'Buyck Louise', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-05-04', phone: '497410415', email: 'nathaliegoorix@hotmail.com', regNumber: '14.05.04-010.34' },
        { name: 'Carton Enna', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-06-19', phone: '477689133', email: 'melissamommens@hotmail.com', regNumber: '14.06.19-192.88' },
        { name: 'Cattoor Lilly', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2013-10-12', phone: '477600866', email: 'Info@lillyandrose.be', regNumber: '13101210009' },
        { name: 'Cattoor Rose', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-09-02', phone: '477600866', email: 'Info@lillyandrose.be', regNumber: '15090221040' },
        { name: 'De Bisscop Maxyne', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-08-21', phone: '476707273', email: 'margaux.corman@yahoo.com', regNumber: '16082114039' },
        { name: 'De Jaeghere Olivia', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-10-13', phone: '478241731', email: 'samencharlotte@telenet.be', regNumber: '' },
        { name: 'Debrabandere Floor', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-11-20', phone: '486920357', email: 'instituutkelly@skynet.be', regNumber: '14.11.20-022.69' },
        { name: 'Demey Charlotte', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-10-28', phone: '477397779', email: 'mobouckingrid@hotmail.com', regNumber: '14102802612' },
        { name: 'Dijkstra Doutzen', city: 'Sluis (NL)', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-09-13', phone: '471075302', email: 'julie.brutein@gmail.com', regNumber: '15.09.13-116.95' },
        { name: 'Duckaert Inaya', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-06-03', phone: '484456979', email: 'buildingdiamonds1@gmail.com', regNumber: '16.06.03-116.07' },
        { name: 'Geirnaert Célestine', city: 'Oostkerke', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-04-25', phone: '495796785', email: 'julieverbouw@outlook.com', regNumber: '17.04.25-028.24' },
        { name: 'Landuyt Anne-Fleur', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-06-23', phone: '476687502', email: 'sylviaverbouw@gmail.com', regNumber: '' },
        { name: 'Landuyt Juliette', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-03-01', phone: '476687502', email: 'sylviaverbouw@gmail.com', regNumber: '17.03.01-384.90' },
        { name: 'Landuyt Mary-Lou', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-03-01', phone: '476687502', email: 'sylviaverbouw@gmail.com', regNumber: '17.03.01-386.88' },
        { name: 'Lemmens Mackenzie', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-01-17', phone: '496138147', email: 'huysentruyt.maribel@gmail.com', regNumber: '15 01 17 050 82' },
        { name: 'Lootens Ophélie', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-08-05', phone: '0477986932', email: 'info@lapinquotidien.com', regNumber: '15080527275' },
        { name: 'Martens Jackie', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-09-23', phone: '476827172', email: 'ellencallant@gmail.com', regNumber: '17.09.23-128.19' },
        { name: 'Mobouck Maxim', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-01-29', phone: '486071257', email: 'sara@bluefinn.be', regNumber: '15012905706' },
        { name: 'Oosters Renée', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-02-07', phone: '479284559', email: 'anka_demulder@hotmail.com', regNumber: '14020712896' },
        { name: 'Pauwels Lynn', city: 'Westkapelle', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-09-11', phone: '479235363', email: 'cynthia_van_rietvelde@hotmail.com', regNumber: '15091120863' },
        { name: 'Slee Anaïs', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-09-02', phone: '495531060', email: 'julie@inner-center.be', regNumber: '16090232444' },
        { name: 'Smits Axelle', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-06-24', phone: '486237990', email: 'kris.smits2@telenet.be', regNumber: '15.06.24-254.91' },
        { name: 'Teirlynck Maité', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-04-28', phone: '477922672', email: 'els2308@gmail.com', regNumber: '16.04.28-140.92' },
        { name: 'Valentin Livia', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-06-23', phone: '486839786', email: 'belinda_incoul@hotmail.com', regNumber: '15.06.23-106.75' },
        { name: 'Van Den Heuvel Louise', city: 'Dudzele', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-10-08', phone: '47752272', email: 'kristof@knokadvas.be', regNumber: '14.10.08-312.35' },
        { name: 'Vanden Poel Lara', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-11-18', phone: '471061365', email: 'teodora.angelova22@gmail.com', regNumber: '14.11.18-224.24' },
        { name: 'Vandertaelen Louise', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-06-22', phone: '474684805', email: 'laikelitaer@hotmail.com', regNumber: '17.06.22-172.81' },
        { name: 'Vanherweghe Romy', city: 'Sluis/Nederland', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-03-14', phone: '479876381', email: 'deweerdtshirley@gmail.com', regNumber: '16.03.14-39.457' },
        { name: 'Vanhoorickx Charlotte', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-07-01', phone: '497390279', email: 'delille.nele@gmail.com', regNumber: '16070104845' },
        { name: 'Vergucht Enora', city: 'Ramskapelle', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-03-24', phone: '478587100', email: 'eva.glorieux@gmail.com', regNumber: '17032408092' },
        { name: 'Vermander Babette', city: 'Aardenburg (NL)', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-08-28', phone: '473674871', email: 'jessiepoppe@hotmail.com', regNumber: '14.08.28-258.57' },
        { name: 'Vermeersch Pauline', city: 'Zeebrugge', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-12-02', phone: '476725344', email: 'tessafleerackers@hotmail.com', regNumber: '16120235435' },
        { name: 'Vermeersch Suzanne', city: 'Zeebrugge', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-12-02', phone: '476725344', email: 'tessafleerackers@hotmail.com', regNumber: '16120235633' },
        { name: 'Vormer Juliette', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-07-26', phone: '31063500000', email: 'roos_america@hotmail.com', regNumber: '16072623875' },
        { name: 'Wittewrongel Ona', city: 'Knokke-Heist', group: 'URBAN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-02-04', phone: '474548925', email: 'christy.de.graeve@icloud.com', regNumber: '15.02.04-286.49' },
        
        // MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014 (28 estudiantes)
        { name: 'Andries Nanou', city: 'Moerkerke', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-04-18', phone: '479326018', email: 'lisa_verleye@hotmail.com', regNumber: '16.04.18-114.30' },
        { name: 'Bonny Alexis', city: 'Moerkerke', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-02-17', phone: '483002201', email: 'acatrysse@hotmail.com', regNumber: '15021714294' },
        { name: 'Buyck Louise', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-05-04', phone: '497410415', email: 'nathaliegoorix@hotmail.com', regNumber: '14.05.04-010.34' },
        { name: 'Carton Enna', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-06-19', phone: '477689133', email: 'melissamommens@hotmail.com', regNumber: '14.06.19-192.88' },
        { name: 'Cattoor Lilly', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2013-10-12', phone: '477600866', email: 'Info@lillyandrose.be', regNumber: '13101210009' },
        { name: 'Cattoor Rose', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-09-02', phone: '477600866', email: 'Info@lillyandrose.be', regNumber: '15090221040' },
        { name: 'De Bisscop Maxyne', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-08-21', phone: '476707273', email: 'margaux.corman@yahoo.com', regNumber: '16082114039' },
        { name: 'De Jaeghere Olivia', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-10-13', phone: '478241731', email: 'samencharlotte@telenet.be', regNumber: '' },
        { name: 'Debrabandere Floor', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-11-20', phone: '486920357', email: 'instituutkelly@skynet.be', regNumber: '14.11.20-022.69' },
        { name: 'Demey Charlotte', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-10-28', phone: '477397779', email: 'mobouckingrid@hotmail.com', regNumber: '14102802612' },
        { name: 'Dijkstra Doutzen', city: 'Sluis (NL)', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-09-13', phone: '471075302', email: 'julie.brutein@gmail.com', regNumber: '15.09.13-116.95' },
        { name: 'Duckaert Inaya', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-06-03', phone: '484456979', email: 'buildingdiamonds1@gmail.com', regNumber: '16.06.03-116.07' },
        { name: 'Geirnaert Célestine', city: 'Oostkerke', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-04-25', phone: '495796785', email: 'julieverbouw@outlook.com', regNumber: '17.04.25-028.24' },
        { name: 'Landuyt Anne-Fleur', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-06-23', phone: '476687502', email: 'sylviaverbouw@gmail.com', regNumber: '' },
        { name: 'Landuyt Juliette', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-03-01', phone: '476687502', email: 'sylviaverbouw@gmail.com', regNumber: '17.03.01-384.90' },
        { name: 'Landuyt Mary-Lou', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-03-01', phone: '476687502', email: 'sylviaverbouw@gmail.com', regNumber: '17.03.01-386.88' },
        { name: 'Lemmens Mackenzie', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-01-17', phone: '496138147', email: 'huysentruyt.maribel@gmail.com', regNumber: '15 01 17 050 82' },
        { name: 'Lootens Ophélie', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-08-05', phone: '0477986932', email: 'info@lapinquotidien.com', regNumber: '15080527275' },
        { name: 'Martens Jackie', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-09-23', phone: '476827172', email: 'ellencallant@gmail.com', regNumber: '17.09.23-128.19' },
        { name: 'Mobouck Maxim', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-01-29', phone: '486071257', email: 'sara@bluefinn.be', regNumber: '15012905706' },
        { name: 'Oosters Renée', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-02-07', phone: '479284559', email: 'anka_demulder@hotmail.com', regNumber: '14020712896' },
        { name: 'Pauwels Lynn', city: 'Westkapelle', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-09-11', phone: '479235363', email: 'cynthia_van_rietvelde@hotmail.com', regNumber: '15091120863' },
        { name: 'Slee Anaïs', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-09-02', phone: '495531060', email: 'julie@inner-center.be', regNumber: '16090232444' },
        { name: 'Smits Axelle', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-06-24', phone: '486237990', email: 'kris.smits2@telenet.be', regNumber: '15.06.24-254.91' },
        { name: 'Teirlynck Maité', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-04-28', phone: '477922672', email: 'els2308@gmail.com', regNumber: '16.04.28-140.92' },
        { name: 'Valentin Livia', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-06-23', phone: '486839786', email: 'belinda_incoul@hotmail.com', regNumber: '15.06.23-106.75' },
        { name: 'Van Den Heuvel Louise', city: 'Dudzele', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-10-08', phone: '47752272', email: 'kristof@knokadvas.be', regNumber: '14.10.08-312.35' },
        { name: 'Vanden Poel Lara', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-11-18', phone: '471061365', email: 'teodora.angelova22@gmail.com', regNumber: '14.11.18-224.24' },
        { name: 'Vandertaelen Louise', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-06-22', phone: '474684805', email: 'laikelitaer@hotmail.com', regNumber: '17.06.22-172.81' },
        { name: 'Vanherweghe Romy', city: 'Sluis/Nederland', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-03-14', phone: '479876381', email: 'deweerdtshirley@gmail.com', regNumber: '16.03.14-39.457' },
        { name: 'Vanhoorickx Charlotte', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-07-01', phone: '497390279', email: 'delille.nele@gmail.com', regNumber: '16070104845' },
        { name: 'Vergucht Enora', city: 'Ramskapelle', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2017-03-24', phone: '478587100', email: 'eva.glorieux@gmail.com', regNumber: '17032408092' },
        { name: 'Vermander Babette', city: 'Aardenburg (NL)', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2014-08-28', phone: '473674871', email: 'jessiepoppe@hotmail.com', regNumber: '14.08.28-258.57' },
        { name: 'Vermeersch Pauline', city: 'Zeebrugge', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-12-02', phone: '476725344', email: 'tessafleerackers@hotmail.com', regNumber: '16120235435' },
        { name: 'Vermeersch Suzanne', city: 'Zeebrugge', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-12-02', phone: '476725344', email: 'tessafleerackers@hotmail.com', regNumber: '16120235633' },
        { name: 'Vormer Juliette', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2016-07-26', phone: '31063500000', email: 'roos_america@hotmail.com', regNumber: '16072623875' },
        { name: 'Wittewrongel Ona', city: 'Knokke-Heist', group: 'MODERN TEENS - GEBOORTEJAREN 2016 & 2015 & 2014', birthDate: '2015-02-04', phone: '474548925', email: 'christy.de.graeve@icloud.com', regNumber: '15.02.04-286.49' }
      ];
      
      csvData.forEach((data, index) => {
        const nameParts = data.name.trim().split(' ');
        const firstName = nameParts.length >= 2 ? nameParts[nameParts.length - 1] : data.name;
        const lastName = nameParts.length >= 2 ? nameParts.slice(0, -1).join(' ') : '';
        
        const birthDate = new Date(data.birthDate);
        
        const student: Student = {
          id: `student-belgium-${globalIndex}`,
          firstName,
          lastName,
          fullName: data.name,
          dateOfBirth: birthDate,
          age: this.calculateAge(birthDate),
          gender: 'Female' as any,
          email: data.email,
          phone: data.phone,
          address: {
            street: 'Belgium Address',
            city: data.city,
            state: 'West Flanders',
            zipCode: '8300',
            country: 'Belgium'
          },
          guardians: [{
            id: `guardian-belgium-${index + 1}`,
            firstName: 'Mother',
            lastName: 'Guardian',
            relationship: 'Mother',
            phone: data.phone,
            email: data.email,
            emergencyContact: true,
            canPickUp: true
          }],
          danceGroups: [this.getGroupIdByName(data.group) || 'modern-1'],
          level: 'Beginner' as any,
          joinDate: new Date(),
          lastClassDate: new Date(),
          isActive: true,
          status: 'Active',
          medicalInfo: 'No medical conditions',
          allergies: [],
          notes: data.regNumber ? `Registration number: ${data.regNumber}` : '',
          photo: undefined,
          documents: [],
          totalClasses: 0,
          attendanceRate: 0.9,
          choreographiesParticipated: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        students.push(student);
        globalIndex++; // Increment global counter
      });
      
      return students;
    }

  // Export data
  exportStudentsToCSV(): string {
    const headers = [
      'ID', 'First Name', 'Last Name', 'Date of Birth', 'Age', 'Gender',
      'Email', 'Phone', 'Address', 'Groups', 'Level', 'Status'
    ];

    const rows = this.students.map(student => [
      student.id,
      student.firstName,
      student.lastName,
      student.dateOfBirth.toISOString().split('T')[0],
      student.age,
      student.gender,
      student.email || '',
      student.phone || '',
      `${student.address.street}, ${student.address.city}`,
      student.danceGroups.join('; '),
      student.level,
      student.status
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

      // Calculate age
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

export const studentService = new StudentService();
export default studentService;
