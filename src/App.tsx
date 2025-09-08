import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Choreography from './pages/Choreography';
import Students from './pages/Students';
import Coaches from './pages/Coaches';
import Classes from './pages/Classes';
import DanceNotebook from './pages/DanceNotebook';

function App() {
  return (
    <ThemeProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/choreography" element={<Choreography />} />
            <Route path="/students" element={<Students />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/notebook" element={<DanceNotebook />} />
          </Routes>
        </Layout>
      </Box>
    </ThemeProvider>
  );
}

export default App;
