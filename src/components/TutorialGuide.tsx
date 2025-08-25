import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  PlayArrow,
  MusicNote,
  VideoLibrary,
  Group,
  ViewInAr,
  Timeline,
  Videocam,
  Brush,
  Assessment,
  Close,
  CheckCircle,
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TutorialGuideProps {
  open: boolean;
  onClose: () => void;
}

const TutorialGuide: React.FC<TutorialGuideProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: '🎭 Crear Nueva Coreografía',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Paso 1:</strong> Comienza creando una nueva coreografía con todos los elementos necesarios.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><PlayArrow color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Haz clic en 'Nueva Coreografía'" 
                secondary="Botón verde en la parte superior de la página"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><MusicNote color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Sube tu archivo de música" 
                secondary="MP3, WAV, AAC, OGG (máx. 50MB) - ¡OBLIGATORIO!"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><VideoLibrary color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Sube video de referencia (opcional)" 
                secondary="MP4, MOV, AVI, MKV (máx. 500MB) para análisis"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Group color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Selecciona estudiantes" 
                secondary="Haz clic en los chips para seleccionar participantes"
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            💡 <strong>Tip:</strong> La música es esencial para la sincronización del escenario 3D y timeline
          </Alert>
        </Box>
      )
    },
    {
      label: '🎭 Crear Escenario 3D',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Paso 2:</strong> Una vez creada la coreografía, ve al escenario 3D para posicionar bailarines.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><ViewInAr color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Ve a la pestaña '🎭 Escenario 3D'" 
                secondary="Primera pestaña en la vista de coreografía"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><PlayArrow color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Haz clic en 'Nueva Formación'" 
                secondary="Botón verde con gradiente en el escenario"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Group color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Arrastra bailarines en el canvas" 
                secondary="Cada estudiante aparece como un círculo de color"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Guarda la formación" 
                secondary="Define el nombre y timestamp en segundos"
              />
            </ListItem>
          </List>
          <Alert severity="success" sx={{ mt: 2 }}>
            ✨ <strong>¡Genial!</strong> Puedes crear múltiples formaciones en diferentes tiempos
          </Alert>
        </Box>
      )
    },
    {
      label: '🎵 Sincronizar con Música',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Paso 3:</strong> Sincroniza tus formaciones con la música usando el timeline.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Timeline color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Ve a la pestaña '🎵 Timeline Musical'" 
                secondary="Controles avanzados de música y marcadores"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><PlayArrow color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Reproduce la música" 
                secondary="Usa los controles de velocidad (0.25x - 2x)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assessment color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Agrega marcadores" 
                secondary="Marca momentos clave: técnica, formación, corrección"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><ViewInAr color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Las formaciones cambian automáticamente" 
                secondary="Según el tiempo actual de reproducción"
              />
            </ListItem>
          </List>
          <Alert severity="warning" sx={{ mt: 2 }}>
            ⚠️ <strong>Importante:</strong> Los timestamps de formaciones deben coincidir con la música
          </Alert>
        </Box>
      )
    },
    {
      label: '🎥 Análisis de Video',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Paso 4:</strong> Analiza videos de práctica con herramientas profesionales.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Videocam color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Ve a la pestaña '🎥 Análisis de Video'" 
                secondary="Funcionalidad estilo Coach's Eye"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><VideoLibrary color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Sube o graba video" 
                secondary="Usa el botón de grabar o sube archivo existente"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Brush color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Usa herramientas de telestración" 
                secondary="Dibuja sobre el video: líneas, círculos, flechas"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assessment color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Agrega marcadores de análisis" 
                secondary="Marca errores técnicos y mejoras"
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            🎬 <strong>Pro Tip:</strong> Usa cámara lenta para análisis detallado de técnica
          </Alert>
        </Box>
      )
    },
    {
      label: '💬 Colaboración y Compartir',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Paso 5:</strong> Colabora con estudiantes y otros profesores.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Group color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Ve a la pestaña '💬 Colaboración'" 
                secondary="Sistema de comentarios en tiempo real"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assessment color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Agrega comentarios por tipo" 
                secondary="Instrucciones, preguntas, notas, recordatorios"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><ViewInAr color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Marca posiciones específicas" 
                secondary="Comenta sobre posiciones exactas del escenario"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Comparte con estudiantes" 
                secondary="Los estudiantes pueden ver y responder"
              />
            </ListItem>
          </List>
          <Alert severity="success" sx={{ mt: 2 }}>
            🌟 <strong>¡Perfecto!</strong> Ya dominas todas las funcionalidades de la app
          </Alert>
        </Box>
      )
    }
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
                 <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
           📚 Guía Completa - Heliopsis Dance Academy
         </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
                   <Typography variant="h5" sx={{ mb: 1 }}>
           Tutorial Paso a Paso: Cómo Usar Tu App de Danza Profesional
         </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Aprende a crear coreografías, escenarios 3D, análisis de video y más
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper sx={{ 
                    p: 2, 
                    background: 'rgba(255,255,255,0.95)', 
                    color: 'black',
                    borderRadius: 2
                  }}>
                    {step.content}
                  </Paper>
                </motion.div>
                
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ 
                      mt: 1, 
                      mr: 1,
                      background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #E55A8A, #43B5B0)'
                      }
                    }}
                    endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
                  >
                    {activeStep === steps.length - 1 ? '¡Completado!' : 'Siguiente'}
                  </Button>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1, color: 'white' }}
                    startIcon={<ArrowBack />}
                  >
                    Anterior
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ 
              p: 3, 
              mt: 2, 
              textAlign: 'center',
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: 'black'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                🎉 ¡Felicitaciones!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ya conoces todas las funcionalidades profesionales de tu app de danza.
                ¡Comienza a crear coreografías increíbles!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  onClick={handleReset}
                  variant="outlined"
                  sx={{ color: 'black', borderColor: 'black' }}
                >
                  Revisar Tutorial
                </Button>
                <Button
                  onClick={onClose}
                  variant="contained"
                  sx={{ 
                    background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
                    color: 'white'
                  }}
                >
                  ¡Empezar a Crear!
                </Button>
              </Box>
            </Paper>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TutorialGuide;
