import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate, useParams } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
  'text/plain', // txt
];

// Define a mapping of MIME types to readable file formats
const FILE_TYPE_DISPLAY = {
  'application/msword': 'MS Word (DOC)',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'MS Word (DOCX)',
  'application/pdf': 'PDF',
  'text/plain': 'TXT',
};

export default function FileUpload() {
  const navigate = useNavigate();
  const { caseId: existingCaseId } = useParams(); // Get caseId from URL if present
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  
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
  
  const uploadFiles = async (caseId = null) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
      }
      
      // Build the URL with query parameter if caseId exists
      let url = '/api/upload';
      if (caseId) {
        url = `${url}?case_id=${caseId}`;
      }
  
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = await response.json();
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
      return;
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
      // Pass existingCaseId if it exists
      const caseId = await uploadFiles(existingCaseId);
      await generateReport(caseId);
      await getReportStatus(caseId);
      setIsLoading(false);
      navigate(`/case-details/${caseId}`);
    } catch (error) {
      alert('Failed to process files. Please try again.');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRequirements = () => {
    setShowRequirements(!showRequirements);
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
            
            <h3 className='mt-3'>Upload your files</h3>
            <p>{existingCaseId ? 'Upload additional files to your existing case' : 'Your documents will upload when you click "Continue".'}</p>

            <Button className="btn-upload cta-button"
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Choose file
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
                accept={ALLOWED_FILE_TYPES.join(',')}
              />
            </Button>

            {/* File Requirements Section */}
            <div className="file-requirements-container mt-3">
              <div 
                className="file-requirements-header" 
                onClick={toggleRequirements}
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#0072ce',
                  marginBottom: '10px'
                }}
              >
                {showRequirements ? 
                  <KeyboardArrowUpIcon style={{ marginRight: '5px' }} /> : 
                  <KeyboardArrowDownIcon style={{ marginRight: '5px' }} />
                }
                <span style={{ fontWeight: 500 }}>File upload requirements</span>
              </div>
              
              {showRequirements && (
                <div className="file-requirements-content" style={{ marginLeft: '20px' }}>
                  <ul className="requirements-list" style={{ 
                    paddingLeft: '20px', 
                    margin: '10px 0',
                    listStyleType: 'disc' 
                  }}>
                    <li>File formats: {Object.values(FILE_TYPE_DISPLAY).join(', ')}</li>
                    <li>File size per document: up to 20 megabytes (MB)</li>
                    <li>Files cannot be password protected</li>
                    <li>Do not use the following (reserved) characters in the filename: *, ?, +, %, &, {}, [], &lt;&gt;, -, =, and ? as these may result in a problem uploading the file or retrieving the file once uploaded</li>
                    <li>Do not use spaces and full stops ('.') at the start or end of the filename as this may result in a problem uploading the file or retrieving the file once uploaded</li>
                    <li>If invalid characters are left within the filename, the system will attempt to remove these, resulting in the uploaded filename being different to the filename at the point of upload. A problem may also be encountered when retrieving the file once uploaded</li>
                  </ul>
                </div>
              )}
            </div>

            <h3 className="mediumText mt-3">Uploaded files:</h3>
              <List className="fileList">
                {selectedFiles.length > 0 ? (
                  selectedFiles.map((file, index) => {
                    const fileSizeInKB = (file.size / 1024).toFixed(0); // Rounding file size to 2 decimal places
                    return (
                      <ListItem key={index} secondaryAction={
                        <IconButton edge="end" onClick={() => handleDeleteFile(file.name)}>
                          <DeleteIcon />
                        </IconButton>
                      }>
                        <ListItemText className="fileDetails"
                          primary={file.name} 
                          secondary={`Size: ${fileSizeInKB} KB`} 
                        />
                      </ListItem>
                    );
                  })
                ) : (
                  <p>No files chosen.</p>
                )}
              </List>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Button 
                  onClick={handleContinue} 
                  variant="contained" 
                  color="success" 
                  className='cta-button'
                  style={{ backgroundColor: '#00703c' }}
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