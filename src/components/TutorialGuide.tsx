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
      label: '🎭 Create New Choreography',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Step 1:</strong> Start by creating a new choreography with all necessary elements.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><PlayArrow color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Click on 'New Choreography'" 
                secondary="Green button at the top of the page"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><MusicNote color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Upload your music file" 
                secondary="MP3, WAV, AAC, OGG (max 50MB) - REQUIRED!"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><VideoLibrary color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Upload reference video (optional)" 
                secondary="MP4, MOV, AVI, MKV (max 500MB) for analysis"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Group color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Select students" 
                secondary="Click on chips to select participants"
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            💡 <strong>Tip:</strong> Music is essential for 3D stage synchronization and timeline
          </Alert>
        </Box>
      )
    },
    {
      label: '🎭 Create 3D Stage',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Step 2:</strong> Once the choreography is created, go to the 3D stage to position dancers.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><ViewInAr color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Go to the '🎭 3D Stage' tab" 
                secondary="First tab in the choreography view"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><PlayArrow color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Click on 'New Formation'" 
                secondary="Green button with gradient on the stage"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Group color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Drag dancers on the canvas" 
                secondary="Each student appears as a colored circle"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Save the formation" 
                secondary="Define the name and timestamp in seconds"
              />
            </ListItem>
          </List>
          <Alert severity="success" sx={{ mt: 2 }}>
            ✨ <strong>Great!</strong> You can create multiple formations at different times
          </Alert>
        </Box>
      )
    },
    {
      label: '🎵 Sync with Music',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Step 3:</strong> Synchronize your formations with music using the timeline.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Timeline color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Go to the '🎵 Musical Timeline' tab" 
                secondary="Advanced music controls and markers"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><PlayArrow color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Play the music" 
                secondary="Use speed controls (0.25x - 2x)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assessment color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Add markers" 
                secondary="Mark key moments: technique, formation, correction"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><ViewInAr color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Formations change automatically" 
                secondary="According to the current playback time"
              />
            </ListItem>
          </List>
          <Alert severity="warning" sx={{ mt: 2 }}>
            ⚠️ <strong>Important:</strong> Formation timestamps must match the music
          </Alert>
        </Box>
      )
    },
    {
      label: '🎥 Video Analysis',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Step 4:</strong> Analyze practice videos with professional tools.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Videocam color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Go to the '🎥 Video Analysis' tab" 
                secondary="Coach's Eye functionality"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><VideoLibrary color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Upload or record video" 
                secondary="Use the record button or upload existing file"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Brush color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Use telestrator tools" 
                secondary="Draw on the video: lines, circles, arrows"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assessment color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Add analysis markers" 
                secondary="Mark technical errors and improvements"
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            🎬 <strong>Pro Tip:</strong> Use slow motion for detailed technique analysis
          </Alert>
        </Box>
      )
    },
    {
      label: '💬 Collaboration and Sharing',
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Step 5:</strong> Collaborate with students and other teachers.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Group color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Go to the '💬 Collaboration' tab" 
                secondary="Real-time comment system"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assessment color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Add comments by type" 
                secondary="Instructions, questions, notes, reminders"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><ViewInAr color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Mark specific positions" 
                secondary="Comment on exact stage positions"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Share with students" 
                secondary="Students can view and respond"
              />
            </ListItem>
          </List>
          <Alert severity="success" sx={{ mt: 2 }}>
            🌟 <strong>Perfect!</strong> You now master all professional features of your dance app
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
           📚 Complete Guide - Heliopsis Dance Academy
         </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
                   <Typography variant="h5" sx={{ mb: 1 }}>
           Step-by-Step Tutorial: How to Use Your Professional Dance App
         </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Learn how to create choreographies, 3D stages, video analysis, and more
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
                    {activeStep === steps.length - 1 ? '¡Completed!' : 'Next'}
                  </Button>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1, color: 'white' }}
                    startIcon={<ArrowBack />}
                  >
                    Previous
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
                🎉 Congratulations!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You now know all the professional features of your dance app.
                Start creating amazing choreographies!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  onClick={handleReset}
                  variant="outlined"
                  sx={{ color: 'black', borderColor: 'black' }}
                >
                  Review Tutorial
                </Button>
                <Button
                  onClick={onClose}
                  variant="contained"
                  sx={{ 
                    background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
                    color: 'white'
                  }}
                >
                  ¡Start Creating!
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
