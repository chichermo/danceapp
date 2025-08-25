import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Tooltip, Chip } from '@mui/material';
import { 
  ViewInAr, 
  ZoomIn, 
  ZoomOut, 
  RotateLeft, 
  RotateRight,
  Layers,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface Stage3DProps {
  dancers: Array<{
    id: string;
    name: string;
    x: number;
    y: number;
    z: number;
    color: string;
    isVisible: boolean;
    formation?: string;
  }>;
  onDancerMove: (id: string, x: number, y: number, z: number) => void;
  onDancerSelect: (id: string) => void;
  selectedDancer?: string;
  currentFormation?: string;
}

const Stage3D: React.FC<Stage3DProps> = ({
  dancers,
  onDancerMove,
  onDancerSelect,
  selectedDancer,
  currentFormation
}) => {
  const [viewMode, setViewMode] = useState<'top' | 'front' | 'side' | '3d'>('3d');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  
  const stageRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (viewMode === '3d' && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      mouseX.set(event.clientX - centerX);
      mouseY.set(event.clientY - centerY);
    }
  };

  const handleDancerDrag = (id: string, info: any) => {
    const newX = Math.max(0, Math.min(800, info.point.x));
    const newY = Math.max(0, Math.min(600, info.point.y));
    const newZ = dancers.find(d => d.id === id)?.z || 0;
    
    onDancerMove(id, newX, newY, newZ);
  };

  const getViewTransform = () => {
    switch (viewMode) {
      case 'top':
        return { rotateX: 0, rotateY: 0, rotateZ: 0 };
      case 'front':
        return { rotateX: 90, rotateY: 0, rotateZ: 0 };
      case 'side':
        return { rotateX: 0, rotateY: 90, rotateZ: 0 };
      case '3d':
        return { 
          rotateX: rotateX.get(), 
          rotateY: rotateY.get(), 
          rotateZ: rotation 
        };
      default:
        return { rotateX: 0, rotateY: 0, rotateZ: 0 };
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Controles de Vista */}
      <Box sx={{ 
        position: 'absolute', 
        top: 16, 
        left: 16, 
        zIndex: 10,
        display: 'flex',
        gap: 1,
        flexDirection: 'column'
      }}>
        <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Vista
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Vista Superior">
              <IconButton 
                size="small" 
                onClick={() => setViewMode('top')}
                color={viewMode === 'top' ? 'primary' : 'default'}
              >
                <ViewInAr />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vista Frontal">
              <IconButton 
                size="small" 
                onClick={() => setViewMode('front')}
                color={viewMode === 'front' ? 'primary' : 'default'}
              >
                <ViewInAr />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vista Lateral">
              <IconButton 
                size="small" 
                onClick={() => setViewMode('side')}
                color={viewMode === 'side' ? 'primary' : 'default'}
              >
                <ViewInAr />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vista 3D">
              <IconButton 
                size="small" 
                onClick={() => setViewMode('3d')}
                color={viewMode === '3d' ? 'primary' : 'default'}
              >
                <ViewInAr />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Zoom
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Acercar">
              <IconButton size="small" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Alejar">
              <IconButton size="small" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Rotación
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Rotar Izquierda">
              <IconButton size="small" onClick={() => setRotation(rotation - 15)}>
                <RotateLeft />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rotar Derecha">
              <IconButton size="small" onClick={() => setRotation(rotation + 15)}>
                <RotateRight />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Opciones
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Mostrar/Ocultar Cuadrícula">
              <IconButton size="small" onClick={() => setShowGrid(!showGrid)}>
                <Layers />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mostrar/Ocultar Capas">
              <IconButton size="small" onClick={() => setShowLayers(!showLayers)}>
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Box>

      {/* Escenario 3D */}
      <Box
        ref={stageRef}
        onMouseMove={handleMouseMove}
        sx={{
          width: '100%',
          height: '600px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Cuadrícula del Escenario */}
        {showGrid && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              opacity: 0.3,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          />
        )}

        {/* Líneas de Guía del Escenario */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #FF6B9D, transparent)',
            opacity: 0.6,
            transform: `scale(${zoom}) translateY(-50%)`
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '2px',
            background: 'linear-gradient(180deg, transparent, #4ECDC4, transparent)',
            opacity: 0.6,
            transform: `scale(${zoom}) translateX(-50%)`
          }}
        />

        {/* Contenedor 3D */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `
              translate(-50%, -50%) 
              scale(${zoom})
              rotateX(${getViewTransform().rotateX}deg) 
              rotateY(${getViewTransform().rotateY}deg) 
              rotateZ(${getViewTransform().rotateZ}deg)
            `,
            transformStyle: 'preserve-3d',
            width: '800px',
            height: '600px'
          }}
        >
          {/* Bailarines */}
          {dancers.filter(d => d.isVisible).map((dancer) => (
            <motion.div
              key={dancer.id}
              drag={viewMode === 'top'}
              dragMomentum={false}
              dragElastic={0}
              onDragEnd={(event, info) => handleDancerDrag(dancer.id, info)}
              onClick={() => onDancerSelect(dancer.id)}
              style={{
                position: 'absolute',
                left: dancer.x,
                top: dancer.y,
                zIndex: dancer.z,
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.1, z: 20 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Sombra del Bailarín */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '20px',
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
                  borderRadius: '50%',
                  opacity: 0.6
                }}
              />
              
              {/* Cuerpo del Bailarín */}
              <Box
                sx={{
                  width: '40px',
                  height: '60px',
                  background: `linear-gradient(135deg, ${dancer.color} 0%, ${dancer.color}dd 100%)`,
                  borderRadius: '20px 20px 10px 10px',
                  border: selectedDancer === dancer.id ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.3)',
                  boxShadow: `
                    0 4px 8px rgba(0,0,0,0.3),
                    0 0 20px ${dancer.color}40,
                    inset 0 1px 0 rgba(255,255,255,0.2)
                  `,
                  position: 'relative',
                  transform: `translateZ(${dancer.z}px)`,
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Cabeza */}
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    background: `linear-gradient(135deg, #FFE4C4 0%, #DEB887 100%)`,
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
                
                {/* Brazos */}
                <Box
                  sx={{
                    width: '8px',
                    height: '30px',
                    background: `linear-gradient(135deg, ${dancer.color} 0%, ${dancer.color}dd 100%)`,
                    borderRadius: '4px',
                    position: 'absolute',
                    top: '10px',
                    left: '-4px',
                    transform: 'rotate(-15deg)',
                    transformOrigin: 'top center'
                  }}
                />
                <Box
                  sx={{
                    width: '8px',
                    height: '30px',
                    background: `linear-gradient(135deg, ${dancer.color} 0%, ${dancer.color}dd 100%)`,
                    borderRadius: '4px',
                    position: 'absolute',
                    top: '10px',
                    right: '-4px',
                    transform: 'rotate(15deg)',
                    transformOrigin: 'top center'
                  }}
                />
              </Box>

              {/* Nombre del Bailarín */}
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  zIndex: 100
                }}
              >
                {dancer.name}
              </Typography>

              {/* Indicador de Formación */}
              {dancer.formation && (
                <Chip
                  label={dancer.formation}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,107,157,0.9)',
                    color: 'white',
                    fontSize: '8px',
                    height: '16px'
                  }}
                />
              )}
            </motion.div>
          ))}

          {/* Marcadores de Posición */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
              borderRadius: '50%',
              border: '3px solid #FFF',
              boxShadow: '0 0 20px #FFD700, 0 0 40px #FFD70040',
              opacity: 0.8,
              zIndex: 50
            }}
          />
        </Box>

        {/* Información de Vista */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="caption">
            Vista: {viewMode.toUpperCase()} | Zoom: {zoom.toFixed(1)}x | Rotación: {rotation}°
          </Typography>
        </Box>

        {/* Indicador de Formación Actual */}
        {currentFormation && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(255,107,157,0.4)'
            }}
          >
            Formación: {currentFormation}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Stage3D;
