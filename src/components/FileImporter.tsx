import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CloudUpload,
  FileUpload,
  CheckCircle,
  Error,
  Warning,
  ExpandMore,
  Download,
  TableChart
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface FileImporterProps {
  onImportComplete: (data: any[]) => void;
  acceptedFormats?: string[];
  maxFileSize?: number; // en MB
}

interface ImportResult {
  success: number;
  errors: string[];
  warnings: string[];
  data: any[];
}

const FileImporter: React.FC<FileImporterProps> = ({
  onImportComplete,
  acceptedFormats = ['.csv', '.xlsx', '.xls', '.json'],
  maxFileSize = 10
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validar tipo de archivo
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!acceptedFormats.some(format => format.includes(fileExtension || ''))) {
      setImportResult({
        success: 0,
        errors: [`Unsupported file format: ${fileExtension}`],
        warnings: [],
        data: []
      });
      return;
    }

    // Validar tamaño
    if (file.size > maxFileSize * 1024 * 1024) {
      setImportResult({
        success: 0,
        errors: [`File too large. Maximum: ${maxFileSize}MB`],
        warnings: [],
        data: []
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      let data: any[] = [];
      let errors: string[] = [];
      let warnings: string[] = [];

      if (fileExtension === 'csv') {
        const csvData = await parseCSV(file);
        data = csvData.data;
        errors = csvData.errors;
        warnings = csvData.warnings;
      } else if (fileExtension === 'json') {
        const jsonData = await parseJSON(file);
        data = jsonData.data;
        errors = jsonData.errors;
        warnings = jsonData.warnings;
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Para Excel necesitaríamos una librería como xlsx
        errors = ['Excel format not implemented yet. Please export as CSV.'];
      }

      const result: ImportResult = {
        success: data.length,
        errors,
        warnings,
        data
      };

      setImportResult(result);

      if (data.length > 0) {
        onImportComplete(data);
      }
    } catch (error) {
      setImportResult({
        success: 0,
        errors: [`Error processing file: ${error}`],
        warnings: [],
        data: []
      });
    } finally {
      setIsImporting(false);
    }
  };

           const parseCSV = async (file: File): Promise<{ data: any[]; errors: string[]; warnings: string[] }> => {
           return new Promise((resolve) => {
             const reader = new FileReader();
             reader.onload = (e) => {
               const text = e.target?.result as string;
               const lines = text.split('\n').filter(line => line.trim());

               if (lines.length < 2) {
                 resolve({ data: [], errors: ['Empty CSV file or no data'], warnings: [] });
                 return;
               }

               const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
               const data: any[] = [];
               const errors: string[] = [];
               const warnings: string[] = [];

               console.log('Detected headers:', headers);
               console.log('Total lines:', lines.length);

               for (let i = 1; i < lines.length; i++) {
                 try {
                   const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                   if (values.length !== headers.length) {
                     warnings.push(`Row ${i + 1}: Inconsistent number of columns (${values.length} vs ${headers.length})`);
                     continue;
                   }

                   const row: any = {};
                   headers.forEach((header, index) => {
                     row[header] = values[index] || '';
                   });

                   // Only add rows that have at least one non-empty data
                   if (Object.values(row).some(value => value && value.toString().trim().length > 0)) {
                     data.push(row);
                   }

                   // Basic validations
                   if (!row['Nombre'] && !row['nombre'] && !row['firstName'] && !row['FirstName']) {
                     warnings.push(`Row ${i + 1}: Missing name. Available columns: ${Object.keys(row).join(', ')}`);
                   }
                 } catch (error) {
                   errors.push(`Row ${i + 1}: Format error - ${error}`);
                 }
               }

               console.log('Processed data:', data);
               console.log('Errors:', errors);
               console.log('Warnings:', warnings);

               resolve({ data, errors, warnings });
             };
             reader.readAsText(file);
           });
         };

  const parseJSON = async (file: File): Promise<{ data: any[]; errors: string[]; warnings: string[] }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          let data: any[] = [];
          const errors: string[] = [];
          const warnings: string[] = [];

          if (Array.isArray(jsonData)) {
            data = jsonData;
          } else if (jsonData.students && Array.isArray(jsonData.students)) {
            data = jsonData.students;
          } else if (jsonData.data && Array.isArray(jsonData.data)) {
            data = jsonData.data;
          } else {
            errors.push('Unrecognized JSON format. Expected: array of students or object with "students" property');
          }

          resolve({ data, errors, warnings });
        } catch (error) {
          resolve({ data: [], errors: [`Error parsing JSON: ${error}`], warnings: [] });
        }
      };
      reader.readAsText(file);
    });
  };

  const downloadTemplate = () => {
    const template = [
      'FirstName,LastName,BirthDate,Gender,Email,Phone,Address,Group,Level',
              'Ana,Garcia,2010-05-15,Female,ana@email.com,+56912345678,Av. Providencia 1234,Mini Ballet,Beginner',
        'Carlos,Rodriguez,2009-08-22,Male,carlos@email.com,+56923456789,Calle Las Condes 567,Teen Hip Hop,Intermediate'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-estudiantes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileUpload color="primary" />
          Import Students
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Drag and drop your file here, or click to select. 
          Supported formats: {acceptedFormats.join(', ')}
        </Typography>

        {/* Área de Drop */}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${dragActive ? 'primary.main' : 'grey.300'}`,
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: dragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {isImporting ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={40} />
              <Typography>Processing file...</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h6">
                {dragActive ? 'Drop the file here' : 'Drag file here or click'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum {maxFileSize}MB
              </Typography>
            </Box>
          )}
        </Box>

        {/* Botón de descarga de plantilla */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            startIcon={<Download />}
            onClick={downloadTemplate}
            variant="outlined"
            size="small"
          >
            Download CSV Template
          </Button>
        </Box>
      </Paper>

      {/* Resultados de importación */}
      {importResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableChart color="primary" />
              Import Results
            </Typography>

            {/* Resumen */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                icon={<CheckCircle />}
                label={`${importResult.success} students imported`}
                color="success"
                variant="outlined"
              />
              {importResult.errors.length > 0 && (
                <Chip
                  icon={<Error />}
                  label={`${importResult.errors.length} errors`}
                  color="error"
                  variant="outlined"
                />
              )}
              {importResult.warnings.length > 0 && (
                <Chip
                  icon={<Warning />}
                  label={`${importResult.warnings.length} warnings`}
                  color="warning"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Errores */}
            {importResult.errors.length > 0 && (
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Error color="error" />
                    Errors ({importResult.errors.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {importResult.errors.map((error, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Error color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={error} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Warnings */}
            {importResult.warnings.length > 0 && (
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning color="warning" />
                    Warnings ({importResult.warnings.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {importResult.warnings.map((warning, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Warning color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={warning} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Datos importados */}
            {importResult.data.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" />
                    Imported Data ({importResult.data.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      {importResult.data.slice(0, 10).map((row, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${row.Nombre || row.firstName || 'N/A'} ${row.Apellido || row.lastName || ''}`}
                            secondary={`${row.Email || row.email || 'No email'} • ${row.Grupo || row.group || 'No group'}`}
                          />
                        </ListItem>
                      ))}
                      {importResult.data.length > 10 && (
                        <ListItem>
                          <ListItemText
                            primary={`... and ${importResult.data.length - 10} more students`}
                            color="text.secondary"
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default FileImporter;
