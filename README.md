# 🎭 Heliopsis Dance Academy - App Profesional de Danza

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14-blue.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Aplicación web profesional para la escuela de danza Heliopsis** - Una plataforma completa para crear, editar y sincronizar coreografías con herramientas avanzadas de análisis de video y colaboración en tiempo real.

## ✨ Características Principales

### 🎭 **Gestión de Coreografías**
- ✅ Crear y editar coreografías completas
- ✅ Subir archivos de música (MP3, WAV, AAC, OGG)
- ✅ Subir videos de referencia (MP4, MOV, AVI, MKV)
- ✅ Gestión de estudiantes y participantes
- ✅ Categorización por nivel y tipo de danza

### 🌟 **Escenario 3D Interactivo**
- ✅ Vista tridimensional del escenario de danza
- ✅ Posicionamiento drag & drop de bailarines
- ✅ Múltiples formaciones con timestamps
- ✅ Controles de vista: superior, frontal, lateral, 3D
- ✅ Zoom, rotación y cuadrícula de referencia

### 🎵 **Timeline Musical Avanzado**
- ✅ Sincronización perfecta música ↔ coreografía
- ✅ Controles de velocidad (0.25x - 2x)
- ✅ Marcadores de tiempo para formaciones
- ✅ Reproducción con controles profesionales
- ✅ Transiciones automáticas entre formaciones

### 🎥 **Análisis de Video Profesional**
- ✅ Herramientas estilo Coach's Eye
- ✅ Telestración: dibujar sobre videos
- ✅ Marcadores de análisis técnico
- ✅ Reproducción en cámara lenta
- ✅ Herramientas de dibujo: líneas, círculos, flechas

### 💬 **Colaboración en Tiempo Real**
- ✅ Sistema de comentarios por tipo
- ✅ Marcadores posicionales en el escenario
- ✅ Comunicación estudiante-profesor
- ✅ Historial de comentarios y respuestas

### 📱 **Diseño Responsivo**
- ✅ Funciona en PC, tablet y móvil
- ✅ Interfaz moderna y profesional
- ✅ Tema personalizado para danza
- ✅ Animaciones fluidas con Framer Motion

## 🚀 Tecnologías Utilizadas

- **Frontend:** React 18 + TypeScript
- **UI Framework:** Material-UI (MUI) v5
- **Animaciones:** Framer Motion
- **Routing:** React Router v6
- **Estado:** React Hooks
- **Estilos:** CSS-in-JS con MUI System
- **Build Tool:** Create React App

## 📦 Instalación

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Pasos de Instalación

```bash
# Clonar el repositorio
git clone https://github.com/chichermo/danceapp.git
cd danceapp

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Construir para producción
npm run build
```

## 🎯 Cómo Usar

### 1. **Crear Nueva Coreografía**
- Haz clic en "📚 Tutorial" para guía completa
- Haz clic en "Nueva Coreografía"
- Sube archivo de música (OBLIGATORIO)
- Selecciona estudiantes participantes
- Guarda la coreografía

### 2. **Diseñar Escenario 3D**
- Ve a la pestaña "🎭 Escenario 3D"
- Haz clic en "Nueva Formación"
- Arrastra bailarines en el canvas
- Define nombre y timestamp
- Guarda la formación

### 3. **Sincronizar con Música**
- Ve a "🎵 Timeline Musical"
- Reproduce la música
- Agrega marcadores importantes
- Las formaciones cambian automáticamente

### 4. **Analizar Videos**
- Ve a "🎥 Análisis de Video"
- Sube video de práctica
- Usa herramientas de telestración
- Marca correcciones técnicas

### 5. **Colaborar**
- Ve a "💬 Colaboración"
- Agrega comentarios por tipo
- Marca posiciones específicas
- Comparte con estudiantes

## 🏗️ Estructura del Proyecto

```
danceapp/
├── public/                 # Archivos públicos
│   ├── index.html         # HTML principal
│   ├── manifest.json      # PWA manifest
│   └── favicon.ico        # Icono de la app
├── src/                   # Código fuente
│   ├── components/        # Componentes reutilizables
│   │   ├── Stage3D.tsx           # Escenario 3D
│   │   ├── MusicTimeline.tsx     # Timeline musical
│   │   ├── VideoAnalysis.tsx     # Análisis de video
│   │   ├── CollaborationPanel.tsx # Panel de colaboración
│   │   └── TutorialGuide.tsx     # Guía interactiva
│   ├── pages/            # Páginas principales
│   │   ├── Dashboard.tsx         # Dashboard principal
│   │   ├── Choreography.tsx      # Gestión de coreografías
│   │   ├── Classes.tsx           # Gestión de clases
│   │   ├── Students.tsx          # Gestión de estudiantes
│   │   ├── Coaches.tsx           # Gestión de coaches
│   │   └── Calendar.tsx          # Calendario de clases
│   ├── App.tsx           # Componente principal
│   ├── index.tsx         # Punto de entrada
│   └── Layout.tsx        # Layout de la aplicación
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript
└── README.md             # Este archivo
```

## 🎨 Temas y Personalización

La aplicación utiliza un tema personalizado de Material-UI con colores inspirados en la danza:

- **Primario:** #FF6B9D (Rosa vibrante)
- **Secundario:** #4ECDC4 (Turquesa)
- **Fondo:** Gradientes profesionales
- **Tipografía:** Poppins + Roboto

## 🔧 Scripts Disponibles

```bash
npm start          # Inicia en modo desarrollo
npm run build      # Construye para producción
npm run test       # Ejecuta tests
npm run eject      # Expone configuración de CRA
```

## 📱 Características PWA

- ✅ Instalable como app nativa
- ✅ Funciona offline
- ✅ Manifest personalizado
- ✅ Iconos adaptativos

## 🌟 Inspiración

Esta aplicación está inspirada en herramientas profesionales como:
- **FORMI Studio** - Para funcionalidades 3D y colaboración
- **Coach's Eye** - Para análisis de video y telestración
- **Spotify** - Para timeline musical y sincronización

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Heliopsis Dance Academy** - *Desarrollo inicial*
- **Contribuidores** - *Mejoras y funcionalidades*

## 🙏 Agradecimientos

- Material-UI por el framework de componentes
- Framer Motion por las animaciones fluidas
- React Team por la biblioteca principal
- Comunidad de desarrolladores de danza

## 📞 Contacto

- **Escuela:** Heliopsis Dance Academy
- **GitHub:** [@chichermo](https://github.com/chichermo)
- **Proyecto:** [danceapp](https://github.com/chichermo/danceapp)

---

⭐ **Si este proyecto te ayuda, ¡dale una estrella en GitHub!** ⭐
