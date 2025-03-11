import React, { useState } from "react";
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import CircularProgress from '@mui/material/CircularProgress';
import '../App.css';
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
const ALLOWED_FILE_TYPES = [
  'application/msword', // doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/pdf', // pdf
];
export default function FileUpload() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Handle file deletion
  const handleDeleteFile = (fileName) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const invalidFiles = [];
  
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} is too large (max 20MB)`);
        return false;
      }
  
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} has an invalid file type`);
        return false;
      }
      return true;
    });
  
    if (invalidFiles.length > 0) {
      alert(`The following files cannot be uploaded:\n${invalidFiles.join('\n')}`);
    }
  
    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
};
  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = await response.json()
      return data.caseId;
      
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };
  const generateReport = async (caseId) => {
    try {
      await fetch('/api/generateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ caseId: caseId })
      });
      return
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };
  const getReportStatus = (caseId) => {
    return new Promise((resolve, reject) => {
      try {
        const eventSource = new EventSource(`/api/generate_report/stream-status/${caseId}`);
  
        eventSource.addEventListener('status', (event) => {
          const data = JSON.parse(event.data);
          if (data.status === 'Completed') {
            eventSource.close();
            resolve(data);
          } else if (data.status === 'error') {
            eventSource.close();
            reject(new Error(data.status));
          }
        });
  
        eventSource.addEventListener('error', (event) => {
          const error = JSON.parse(event.data);
          eventSource.close();
          reject(new Error(error));
        });
  
        eventSource.onerror = (error) => {
          eventSource.close();
          reject(new Error('EventSource failed:', error));
        };
  
      } catch (error) {
        console.error('Error setting up EventSource:', error);
        reject(error);
      }
    });
  };
  
  const handleContinue = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files first');
      return;
    }
  
    setIsLoading(true);
    
    // Navigate to loading page first
    navigate("/loading-page");
  
    try {
      const caseId = await uploadFiles();
      console.log(caseId);
      await generateReport(caseId);
      await getReportStatus(caseId);
      setIsLoading(false);
      navigate(`/dashboard/${caseId}`);
    } catch (error) {
      alert('Failed to process files. Please try again.');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <GoBackButton />
      
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <div className='container'>
            <h2>Your account</h2>
            <p>You can use our new AI dashboard to find information about your case. By uploading your case file, our AI tool will generate a comprehensive case summary, featuring information from similar cases that match your file.</p>
            <p>Additionally, you can find your action list, submitted documents, and support tools. The AI Q&A tool is also available to assist with any questions you may have.</p>
            
            <h3 className='mt-3'>Upload your file</h3>
            <p>You can upload your file here</p>
            <div>
              <Button 
                className="btn-upload cta-button"
                variant="outlined"
                component="label"
                color="primary"
                startIcon={<CloudUploadIcon />}
                sx={{ marginBottom: 2 }}
              >
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                  accept={ALLOWED_FILE_TYPES.join(',')}
                />
              </Button>
              <h3 className="mediumText mt-3">Uploaded files:</h3>
              <List className="fileList">
                {selectedFiles.length > 0 ? (
                  selectedFiles.map((file, index) => {
                    const fileSizeInKB = (file.size / 1024).toFixed(0);
                    return (
                      <ListItem 
                        key={index} 
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleDeleteFile(file.name)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText 
                          className="fileDetails"
                          primary={file.name} 
                          secondary={`Size: ${fileSizeInKB} KB`} 
                        />
                      </ListItem>
                    );
                  })
                ) : (
                  <p>No files uploaded yet.</p>
                )}
              </List>
            </div>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <div>
                <Button 
                  onClick={handleContinue} 
                  variant="contained" 
                  color="success" 
                  className='mt-4 cta-button'
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}