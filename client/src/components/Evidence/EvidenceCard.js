import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE_URL = 'api';

const EvidenceCard = ({ file }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);

  const handleCardClick = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
  
    try {
      const filename = file.storedName;
      const response = await fetch(`${API_BASE_URL}/files/${filename}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      setFileContent({
        url: objectUrl,
        type: response.headers.get('Content-Type') || determineFileType(file.originalName)
      });
    } catch (error) {
      console.error('Error loading file:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const determineFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  };

  const handleClose = () => {
    setOpen(false);
    if (fileContent?.url) {
      URL.revokeObjectURL(fileContent.url);
    }
    setFileContent(null);
    setError(null);
  };

  const renderFileContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">
            Error loading file: {error}
          </Typography>
        </Box>
      );
    }

    if (!fileContent) {
      return (
        <Typography color="error">Unable to load file</Typography>
      );
    }

    if (fileContent.type.startsWith('image/')) {
      return (
        <img 
          src={fileContent.url} 
          alt={file.originalName}
          style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
        />
      );
    }

    if (fileContent.type === 'application/pdf') {
        return (
          <Box sx={{ width: '100%', height: '80vh' }}>
            <iframe
              src={fileContent.url}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Box>
        );
      }

    if (fileContent.type.startsWith('text/')) {
      return (
        <Box sx={{ width: '100%', height: '80vh' }}>
          <iframe
            src={`${fileContent.url}#view=FitH`}
            title={file.originalName}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            sandbox="allow-same-origin"
          />
        </Box>
      );
    }

    if (fileContent.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ mb: 2 }}>
            Word documents can't be previewed directly in the browser.
          </Typography>
          <a 
            href={fileContent.url} 
            download={file.originalName}
            style={{ color: '#1976d2', textDecoration: 'none' }}
          >
            Download Document
          </a>
        </Box>
      );
    }

    // For other file types, provide a download link
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={{ mb: 2 }}>
          This file type cannot be previewed directly.
        </Typography>
        <a 
          href={fileContent.url} 
          download={file.originalName}
          style={{ color: '#1976d2', textDecoration: 'none' }}
        >
          Download File
        </a>
      </Box>
    );
  };

  return (
    <>
      <Card 
        variant="outlined" 
        onClick={handleCardClick}
        sx={{ 
          cursor: 'pointer',
          height: '110px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <DescriptionIcon 
              sx={{ mr: 2, color: 'primary.main' }} 
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
                {file.doc_title || 'No title summary available'}            
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {file.originalName}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              {file.originalName}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ color: 'grey.500' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {renderFileContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EvidenceCard;