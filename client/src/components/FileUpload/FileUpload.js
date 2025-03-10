// src/components/FileUpload/FileUpload.js
import { useState } from 'react';
import { 
  Button, 
  Box, 
  LinearProgress, 
  Typography,
  IconButton,
  List,
  ListItem,
  Paper,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const FileUpload = ({ onSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleGenerateReport = async (caseNumber) => {
    setIsGeneratingReport(true);
    try {
      await fetch('/api/generateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caseNumber })
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Generate report error:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setSelectedFiles([]);
      
      // Pass the new case number to generate report
      await handleGenerateReport(data.caseNumber);

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (isGeneratingReport) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          border: '1px dashed #ccc',
          borderRadius: 1,
          width: '100%',
          maxWidth: 800,
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Creating New Case...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we process your files
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        backgroundColor: 'background.paper',
        border: '1px dashed #ccc',
        borderRadius: 1,
        width: '100%',
        maxWidth: 800,
        mt: 2
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <input
          type="file"
          id="file-upload"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        
        <Box sx={{ textAlign: 'center' }}>
          <label htmlFor="file-upload">
            <Button
              component="span"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ mr: 1 }}
            >
              Select Files
            </Button>
          </label>
          
          <Button
            variant="outlined"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            sx={{ ml: 1 }}
          >
            Create Case {selectedFiles.length > 0 && `(${selectedFiles.length} files)`}
          </Button>
        </Box>

        <List sx={{ 
          width: '100%',
          maxHeight: '300px',
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: 1
        }}>
          {selectedFiles.map((file, index) => (
            <ListItem 
              key={`selected-${index}`}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                borderBottom: '1px solid #e0e0e0',
                mb: 0
              }}
            >
              <Typography sx={{ flexGrow: 1 }}>
                {file.name}
              </Typography>
              <IconButton 
                onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))} 
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        {uploading && <LinearProgress sx={{ width: '100%' }} />}
      </Box>
    </Paper>
  );
};

export default FileUpload;