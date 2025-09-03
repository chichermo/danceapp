# 🎭 Heliopsis Dance Academy - Professional Dance App

## 🎯 **Overview**

> **Professional web application for Heliopsis Dance Academy** - A complete platform for creating, editing and synchronizing choreographies with advanced video analysis tools and real-time collaboration.

## ✨ **Key Features**

### **Core Functionality:**
- ✅ **Choreography Management** - Create, edit and organize dance routines
- ✅ **Student and participant management**
- ✅ **Categorization by level and dance type**
- ✅ **Music synchronization** with precise timing
- ✅ **3D stage view** for dance choreography
- ✅ **Real-time collaboration** with comments and annotations
- ✅ **Video analysis** with frame-by-frame review
- ✅ **Formation templates** for different dance styles

### **Advanced Tools:**
- ✅ **AI-powered suggestions** for choreography optimization
- ✅ **Performance analytics** and progress tracking
- ✅ **Social feed** for sharing achievements
- ✅ **Custom dance theme**
- ✅ **Responsive design** for all devices

## 🚀 **Getting Started**

### **Prerequisites:**
- Node.js 16+ 
- npm or yarn
- Modern web browser

### **Installation:**
```bash
# Clone the repository
git clone https://github.com/your-username/heliopsis-dance-app.git

# Navigate to the project directory
cd heliopsis-dance-app

# Install dependencies
npm install

# Start the development server
npm start
```

### **Environment Variables:**
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

## 🎭 **Usage Guide**

### **Creating Choreographies:**
1. Navigate to the **Choreography** section
2. Click **"New Choreography"**
3. **Select participating students**
4. **Set music track** and timing
5. **Create formations** and movements
6. **Save and share** with students

### **Student Management:**
1. Go to **Students** section
2. **Import student list** from CSV
3. **Organize by groups** and levels
4. **Track progress** and attendance
5. **Share with students**

## 🏗️ **Project Structure**

```
src/
├── components/           # Reusable UI components
│   ├── AIAssistant.tsx      # AI-powered suggestions
│   ├── AnalyticsDashboard.tsx   # Analytics and metrics
│   ├── CollaborationPanel.tsx   # Real-time collaboration
│   ├── FileImporter.tsx        # File import functionality
│   ├── Formation3DPlayer.tsx   # 3D formation player
│   ├── MusicTimeline.tsx       # Music synchronization
│   ├── PerformanceOptimizer.tsx # Performance optimization
│   ├── SocialFeed.tsx          # Social interactions
│   └── UserProfile.tsx         # User profile management
├── pages/               # Main application pages
│   ├── Calendar.tsx           # Class and event calendar
│   ├── Choreography.tsx       # Choreography management
│   ├── Classes.tsx            # Class management
│   ├── Coaches.tsx            # Coach profiles
│   ├── Dashboard.tsx          # Main dashboard
│   └── Students.tsx           # Student management
├── services/            # Business logic and API calls
│   ├── AIService.ts           # AI and optimization
│   ├── AuthService.ts         # Authentication
│   ├── MetricsService.ts      # Analytics and metrics
│   ├── MusicService.ts        # Music management
│   ├── PersistenceService.ts  # Data persistence
│   ├── RealtimeService.ts     # Real-time features
│   ├── SocialService.ts       # Social interactions
│   ├── StudentService.ts      # Student data
│   └── VideoService.ts        # Video analysis
├── theme/               # Custom theme and styling
│   └── customTheme.ts         # Application theme
└── Layout.tsx           # Application layout
```

## 🎨 **Customization**

The application uses a custom Material-UI theme with dance-inspired colors:

### **Color Palette:**
- **Primary:** Dance Pink (#FF6B9D)
- **Secondary:** Stage Blue (#4ECDC4)
- **Accent:** Performance Gold (#FFE66D)
- **Neutral:** Professional Grays

### **Typography:**
- **Headings:** Inter (Bold, Modern)
- **Body:** Roboto (Readable, Clean)
- **Special:** Poppins (Creative, Dance-inspired)

## 🔧 **Development**

### **Available Scripts:**
```bash
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run eject      # Eject from Create React App
```

### **Code Style:**
- **ESLint** for code quality
- **Prettier** for formatting
- **TypeScript** for type safety
- **Material-UI** for components

## 🌟 **Inspiration**

This application is inspired by professional tools like:

- **Dance Studio Pro** - Professional choreography management
- **Coach's Eye** - Video analysis and feedback
- **Final Cut Pro** - Timeline and synchronization
- **Spotify** - Music management and playlists

## 🤝 **Contributing**

We welcome contributions! Please read our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### **Community:**
- **Dance community** developers
- **Open source** enthusiasts
- **Educational** technology experts
- **School:** Heliopsis Dance Academy

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Heliopsis Dance Academy** for inspiration and support
- **Material-UI** team for the excellent component library
- **React** community for the amazing framework
- **Open source** contributors worldwide

---

**Made with ❤️ for the dance community**
