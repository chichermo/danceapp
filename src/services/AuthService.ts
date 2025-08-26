export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'teacher';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    this.initializeAuth();
  }

  // Inicializar autenticación
  private initializeAuth(): void {
    // Verificar si hay token guardado
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        this.token = savedToken;
        this.currentUser = JSON.parse(savedUser);
        this.validateToken();
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error);
        this.clearAuth();
      }
    }
  }

  // Validar token
  private async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      // Simular validación de token
      const response = await this.simulateApiCall('/auth/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.valid) {
        this.notifyListeners();
        return true;
      } else {
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Error al validar token:', error);
      this.clearAuth();
      return false;
    }
  }

  // Simular llamada a API
  private async simulateApiCall(endpoint: string, options: any): Promise<any> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular respuestas basadas en el endpoint
    switch (endpoint) {
      case '/auth/login':
        if (options.body) {
          const { email, password } = JSON.parse(options.body);
          if (email === 'admin@dance.com' && password === 'admin123') {
            return {
              success: true,
              token: 'mock-jwt-token-' + Date.now(),
              refreshToken: 'mock-refresh-token-' + Date.now(),
              user: {
                id: 'user-1',
                email: 'admin@dance.com',
                name: 'Administrador',
                role: 'admin',
                avatar: 'https://i.pravatar.cc/150?img=1',
                preferences: {
                  theme: 'light',
                  language: 'es',
                  notifications: true
                },
                permissions: ['read', 'write', 'admin'],
                lastLogin: new Date(),
                createdAt: new Date('2023-01-01')
              }
            };
          } else if (email === 'teacher@dance.com' && password === 'teacher123') {
            return {
              success: true,
              token: 'mock-jwt-token-teacher-' + Date.now(),
              refreshToken: 'mock-refresh-token-teacher-' + Date.now(),
              user: {
                id: 'user-2',
                email: 'teacher@dance.com',
                name: 'Profesor de Danza',
                role: 'teacher',
                avatar: 'https://i.pravatar.cc/150?img=2',
                preferences: {
                  theme: 'light',
                  language: 'es',
                  notifications: true
                },
                permissions: ['read', 'write'],
                lastLogin: new Date(),
                createdAt: new Date('2023-01-15')
              }
            };
          } else if (email === 'student@dance.com' && password === 'student123') {
            return {
              success: true,
              token: 'mock-jwt-token-student-' + Date.now(),
              refreshToken: 'mock-refresh-token-student-' + Date.now(),
              user: {
                id: 'user-3',
                email: 'student@dance.com',
                name: 'Estudiante de Danza',
                role: 'student',
                avatar: 'https://i.pravatar.cc/150?img=3',
                preferences: {
                  theme: 'light',
                  language: 'es',
                  notifications: true
                },
                permissions: ['read'],
                lastLogin: new Date(),
                createdAt: new Date('2023-02-01')
              }
            };
          }
        }
        return { success: false, error: 'Credenciales inválidas' };

      case '/auth/register':
        return { success: true, message: 'Usuario registrado exitosamente' };

      case '/auth/validate':
        return { valid: true };

      case '/auth/refresh':
        return {
          success: true,
          token: 'mock-refreshed-token-' + Date.now(),
          refreshToken: 'mock-refreshed-refresh-token-' + Date.now()
        };

      case '/auth/logout':
        return { success: true };

      default:
        return { success: false, error: 'Endpoint no encontrado' };
    }
  }

  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.simulateApiCall('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.success) {
        this.token = response.token;
        this.refreshToken = response.refreshToken;
        this.currentUser = response.user;

        // Guardar en localStorage si se seleccionó "recordarme"
        if (credentials.rememberMe && this.token) {
          localStorage.setItem('auth_token', this.token);
          localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
        }

        this.notifyListeners();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Registrar usuario
  async register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
      // Validaciones básicas
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Las contraseñas no coinciden' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      const response = await this.simulateApiCall('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Error al registrar usuario' };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await this.simulateApiCall('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Limpiar datos de autenticación
  private clearAuth(): void {
    this.currentUser = null;
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.notifyListeners();
  }

  // Refrescar token
  async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await this.simulateApiCall('/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (response.success) {
        this.token = response.token;
        this.refreshToken = response.refreshToken;
        
        // Actualizar token en localStorage
        if (this.token) {
          localStorage.setItem('auth_token', this.token);
        }
        
        return true;
      } else {
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      this.clearAuth();
      return false;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null;
  }

  // Verificar permisos
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }

  // Verificar rol
  hasRole(role: string): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === role;
  }

  // Obtener token
  getToken(): string | null {
    return this.token;
  }

  // Obtener estado de autenticación
  getAuthState(): AuthState {
    return {
      user: this.currentUser,
      isAuthenticated: this.isAuthenticated(),
      isLoading: false,
      error: null
    };
  }

  // Suscribirse a cambios de autenticación
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Devolver función de desuscripción
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notificar a los listeners
  private notifyListeners(): void {
    const state = this.getAuthState();
    this.listeners.forEach(listener => listener(state));
  }

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'No autenticado' };
    }

    try {
      // Simular validación de contraseña actual
      if (currentPassword !== 'current123') {
        return { success: false, error: 'Contraseña actual incorrecta' };
      }

      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { success: false, error: 'Error al cambiar contraseña' };
    }
  }

  // Actualizar perfil
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'No autenticado' };
    }

    try {
      // Simular actualización de perfil
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates };
        localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
        this.notifyListeners();
      }

      return { success: true };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, error: 'Error al actualizar perfil' };
    }
  }

  // Restablecer contraseña
  async resetPassword(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
    try {
      // Simular envío de email de restablecimiento
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, message: 'Se ha enviado un email con las instrucciones' };
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      return { success: false, error: 'Error al restablecer contraseña' };
    }
  }

  // Obtener usuarios (solo para admins)
  async getUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
    if (!this.hasRole('admin')) {
      return { success: false, error: 'No autorizado' };
    }

    try {
      // Simular obtención de usuarios
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users: User[] = [
        {
          id: 'user-1',
          email: 'admin@dance.com',
          name: 'Administrador',
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?img=1',
          preferences: {
            theme: 'light',
            language: 'es',
            notifications: true
          },
          permissions: ['read', 'write', 'admin'],
          lastLogin: new Date(),
          createdAt: new Date('2023-01-01')
        },
        {
          id: 'user-2',
          email: 'teacher@dance.com',
          name: 'Profesor de Danza',
          role: 'teacher',
          avatar: 'https://i.pravatar.cc/150?img=2',
          preferences: {
            theme: 'light',
            language: 'es',
            notifications: true
          },
          permissions: ['read', 'write'],
          lastLogin: new Date(),
          createdAt: new Date('2023-01-15')
        },
        {
          id: 'user-3',
          email: 'student@dance.com',
          name: 'Estudiante de Danza',
          role: 'student',
          avatar: 'https://i.pravatar.cc/150?img=3',
          preferences: {
            theme: 'light',
            language: 'es',
            notifications: true
          },
          permissions: ['read'],
          lastLogin: new Date(),
          createdAt: new Date('2023-02-01')
        }
      ];

      return { success: true, users };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { success: false, error: 'Error al obtener usuarios' };
    }
  }
}

// Instancia singleton
const authService = new AuthService();
export default authService;
