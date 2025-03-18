import React, { useState } from "react";
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import '../App.css';

export default function FileUpload() {

  const [files, setFiles] = useState([]);

  // Handle file selection
  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  // Handle file deletion
  const handleDeleteFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const navigate = useNavigate(); // hook to navigate programmatically
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);  // Start the loading state
    setTimeout(() => {
      navigate("/loading-page");  // Navigate to page two after a delay
    }, 100);  // Simulate a 2 second delay before navigation
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
              <Button className="btn-upload cta-button"
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
                />
              </Button>

              <h3 className="mediumText mt-3">Uploaded files:</h3>
              <List className="fileList">
                {files.length > 0 ? (
                  files.map((file, index) => {
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
                  <p>No files uploaded yet.</p>
                )}
              </List>
            </div>

            {loading ? (
              <div></div> // Display "Loading..." while waiting to navigate
            ) : (
              <div>
              <Button onClick={handleContinue} variant="contained" color="success" className='mt-4 cta-button'>
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