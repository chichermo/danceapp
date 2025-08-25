import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Choreography from './pages/Choreography';
import Students from './pages/Students';
import Coaches from './pages/Coaches';
import Classes from './pages/Classes';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/choreography" element={<Choreography />} />
          <Route path="/students" element={<Students />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/classes" element={<Classes />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;
