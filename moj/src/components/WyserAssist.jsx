import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicIcon from '@mui/icons-material/Mic';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import GoBackButton from './GoBackButton'; // Import the GoBackButton component

const WyserAssist = ({ caseId }) => {
  const navigate = useNavigate();
  // Check for transcription data in sessionStorage when component mounts
  const storedTranscriptKey = `transcript_${caseId}`;
  const storedSummaryKey = `summary_${caseId}`;
  const storedUploadIdKey = `uploadId_${caseId}`;
  
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingToCaseDocuments, setIsUploadingToCaseDocuments] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [uploadId, setUploadId] = useState(() => {
    const stored = sessionStorage.getItem(storedUploadIdKey);
    return stored ? stored : null;
  });
  const [transcript, setTranscript] = useState(() => {
    const stored = sessionStorage.getItem(storedTranscriptKey);
    return stored ? JSON.parse(stored) : [];
  });
  const [summary, setSummary] = useState(() => {
    const stored = sessionStorage.getItem(storedSummaryKey);
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.includes('audio')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid audio file');
      setSnackbarSeverity('error');
      setSnackbarMessage('Please select a valid audio file');
      setOpenSnackbar(true);
    }
  };

  const handleUploadAndGenerateReport = async () => {
    if (!transcript || transcript.length === 0) {
      setError('No transcript available to upload');
      setSnackbarSeverity('error');
      setSnackbarMessage('No transcript available to upload');
      setOpenSnackbar(true);
      return;
    }
  
    if (!caseId) {
      setError('Case ID is required');
      setSnackbarSeverity('error');
      setSnackbarMessage('Case ID is required');
      setOpenSnackbar(true);
      return;
    }
  
    // Set combined loading state
    setIsUploadingToCaseDocuments(true);
    setIsGeneratingReport(true);
    setError(null);
  
    try {
      // First upload transcript to case documents
      await handleUploadToCaseDocumentsInternal();
      
      // Then generate report
      await fetch('/api/generateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ caseId: caseId })
      });
  
      // Show success message
      setSnackbarSeverity('success');
      setSnackbarMessage('Transcript uploaded and report generation initiated');
      setOpenSnackbar(true);
  
      // Redirect to loading page
      navigate("/loading-page");
      
      // Wait for report generation to complete (optional, depending on your flow)
      await getReportStatus(caseId);
      
      // Navigate to case details
      navigate(`/case-details/${caseId}`);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarMessage(`Error: ${err.message}`);
      setOpenSnackbar(true);
    } finally {
      setIsUploadingToCaseDocuments(false);
      setIsGeneratingReport(false);
    }
  };


  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      setSnackbarSeverity('error');
      setSnackbarMessage('Please select a file first');
      setOpenSnackbar(true);
      return;
    }

    if (!caseId) {
      setError('Case ID is required');
      setSnackbarSeverity('error');
      setSnackbarMessage('Case ID is required');
      setOpenSnackbar(true);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/voiceOfTheChild/upload?case_id=${caseId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setUploadId(data.id);
      setIsUploading(false);
      setIsProcessing(true);
      setStatusMessage('Processing audio file...');
      
      // Start streaming results once upload is complete
      streamResults(caseId, data.id);
    } catch (err) {
      setIsUploading(false);
      setError(`Error: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarMessage(`Error: ${err.message}`);
      setOpenSnackbar(true);
    }
  };

  // Stream results using Server-Sent Events
  const streamResults = (caseId, uploadId) => {
    const eventSource = new EventSource(`/api/voiceOfTheChild/stream/${caseId}/${uploadId}`);

    // Helper function to convert Python-style dict to JSON
    const pythonDictToJSON = (pythonStr) => {
      if (!pythonStr) return null;
      
      try {
        // Replace Python None with JSON null
        let jsonStr = pythonStr.replace(/None/g, 'null');
        // Replace single quotes with double quotes for keys and string values
        jsonStr = jsonStr.replace(/'/g, '"');
        return JSON.parse(jsonStr);
      } catch (err) {
        console.error('Error converting Python dict to JSON:', err);
        return null;
      }
    };
    

    eventSource.addEventListener('status', (event) => {
      try {
        // Try to parse as proper JSON first
        let statusData;
        try {
          statusData = JSON.parse(event.data);
        } catch (jsonError) {
          // If that fails, try parsing as Python dict
          statusData = pythonDictToJSON(event.data);
        }
        
        if (statusData && statusData.status) {
          setStatusMessage(`Status: ${statusData.status}`);
        } else {
          setStatusMessage(`Processing: ${event.data}`);
        }
      } catch (err) {
        console.error('Error parsing status data:', event.data);
        setStatusMessage(`Received status update: ${event.data}`);
      }
    });

    eventSource.addEventListener('results', (event) => {
        try {
          // Try to parse as proper JSON first
          let resultsData;
          try {
            resultsData = JSON.parse(event.data);
          } catch (jsonError) {
            // If that fails, try parsing as Python dict
            resultsData = pythonDictToJSON(event.data);
          }
          
          if (resultsData) {
            if (resultsData.transcript) {
              // Use resultsData.transcript directly instead of undefined processedTranscript
              setTranscript(resultsData.transcript);
              // Store in sessionStorage for persistence
              sessionStorage.setItem(storedTranscriptKey, JSON.stringify(resultsData.transcript));
            }
            setSummary(resultsData.summary);
            if (resultsData.summary) {
              sessionStorage.setItem(storedSummaryKey, JSON.stringify(resultsData.summary));
            }
            // Store uploadId for potential retrieval
            sessionStorage.setItem(storedUploadIdKey, uploadId);
          } else {
            console.warn('Results data could not be parsed:', event.data);
          }
        } catch (err) {
          console.error('Error processing results data:', err, event.data);
          setError(`Error processing results: ${err.message}`);
          setSnackbarSeverity('error');
          setSnackbarMessage(`Error processing results: ${err.message}`);
          setOpenSnackbar(true);
        } finally {
          setIsProcessing(false);
          eventSource.close();
        }
      });

    eventSource.addEventListener('error', (event) => {
      let errorMessage = 'An error occurred during processing';
      
      try {
        // First try to parse as JSON
        let errorData;
        try {
          if (event.data && typeof event.data === 'string') {
            errorData = JSON.parse(event.data);
          }
        } catch (jsonError) {
          // If JSON parsing fails, try as Python dict
          errorData = pythonDictToJSON(event.data);
        }
        
        if (errorData) {
          errorMessage = `Processing error: ${errorData.error || errorData.message || JSON.stringify(errorData)}`;
        } else if (event.data && typeof event.data === 'string') {
          // Use raw data if parsing failed
          errorMessage = `Processing error: ${event.data}`;
        }
      } catch (err) {
        errorMessage = `Processing error: ${event.data || 'Unknown error'}`;
      }
      
      setError(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setIsProcessing(false);
      setOpenSnackbar(true);
      eventSource.close();
    });

    // Handle connection closure
    eventSource.onerror = () => {
      setIsProcessing(false);
      eventSource.close();
    };
  };

  // Generate report functionality
  const generateReport = async () => {
    if (!caseId) {
      setError('Case ID is required');
      setSnackbarSeverity('error');
      setSnackbarMessage('Case ID is required');
      setOpenSnackbar(true);
      return;
    }

    setIsGeneratingReport(true);
    setError(null);

    try {
      // First upload transcript to case documents if not already done
      await handleUploadToCaseDocumentsInternal();
      
      // Then generate report
      await fetch('/api/generateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ caseId: caseId })
      });

      // Redirect to loading page
      navigate("/loading-page");
      
      // Wait for report generation to complete (optional, depending on your flow)
      await getReportStatus(caseId);
      
      // Navigate to case details
      navigate(`/case-details/${caseId}`);
    } catch (err) {
      setIsGeneratingReport(false);
      setError(`Error generating report: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarMessage(`Error generating report: ${err.message}`);
      setOpenSnackbar(true);
    }
  };

  // Function to check report status
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
            reject(new Error(data.message || 'Error generating report'));
          }
        });

        eventSource.addEventListener('error', (event) => {
          let error;
          try {
            error = JSON.parse(event.data);
          } catch (e) {
            error = 'Error in event stream';
          }
          eventSource.close();
          reject(new Error(error));
        });

        eventSource.onerror = (error) => {
          eventSource.close();
          reject(new Error('EventSource failed'));
        };
      } catch (error) {
        console.error('Error setting up EventSource:', error);
        reject(error);
      }
    });
  };

  // Save transcript as a document - internal implementation
  const handleUploadToCaseDocumentsInternal = async () => {
    if (!transcript || transcript.length === 0) {
      throw new Error('No transcript available to upload');
    }

    if (!caseId) {
      throw new Error('Case ID is required');
    }
    
    // Format transcript into text (without summary)
    let transcriptText = transcript.map((segment, index) => {      
      return `${segment.speaker || 'Speaker'}: ${segment.text}`;
    }).join('\n\n');
    
    // Create a file from the transcript text
    const fileName = `transcript_${new Date().toISOString().slice(0, 10)}.txt`;
    const transcriptFile = new File([transcriptText], fileName, { type: 'text/plain' });
    
    // Create form data
    const formData = new FormData();
    formData.append('files', transcriptFile);
    
    // Send to the upload API with case ID
    const response = await fetch(`/api/upload?case_id=${caseId}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload transcript to case documents');
    }
    
    return await response.json();
  };

  // Save transcript as a document - public method
  const handleUploadToCaseDocuments = async () => {
    setIsUploadingToCaseDocuments(true);
    
    try {
      await handleUploadToCaseDocumentsInternal();
      setSnackbarSeverity('success');
      setSnackbarMessage('Transcript uploaded to case documents successfully');
      setOpenSnackbar(true);
    } catch (err) {
      setError(`Error uploading transcript: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarMessage(`Error uploading transcript: ${err.message}`);
      setOpenSnackbar(true);
    } finally {
      setIsUploadingToCaseDocuments(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box className="transcribe-container">
        <Typography variant="h4" gutterBottom>
            Transcribe your audio files and add them to your case documents
        </Typography>
        <Typography variant="body1" paragraph>
            Upload audio recordings for transcription (Conversations from 18+ year olds only). 
        </Typography>
        
        {/* Upload Card */}
        {!transcript || transcript.length === 0 ? (
            <Card className="transcribe-card" sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MicIcon sx={{ mr: 1 }} /> Upload Audio Recording
                </Typography>
                
                <Box sx={{ mb: 3, mt: 3 }}>
                <input
                    accept="audio/*"
                    style={{ display: 'none' }}
                    id="audio-file-upload"
                    type="file"
                    onChange={handleFileChange}
                    disabled={isUploading || isProcessing}
                />
                <label htmlFor="audio-file-upload">
                    <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadFileIcon />}
                    disabled={isUploading || isProcessing}
                    className="btn-upload"
                    sx={{ mr: 2 }}
                    >
                    Select Audio File
                    </Button>
                </label>
                
                {file && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                    <AudioFileIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                        Selected file: {file.name}
                    </Typography>
                    </Box>
                )}
                
                <Box sx={{ mt: 3 }}>
                    <Button
                    variant="outlined" 
                    className="btn-upload"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!file || isUploading || isProcessing}
                    startIcon={isUploading || isProcessing ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    >
                    {isUploading ? 'Uploading...' : isProcessing ? 'Processing...' : 'Upload and Process'}
                    </Button>
                </Box>
                </Box>
                
                {(isUploading || isProcessing) && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                    {isUploading ? 'Uploading audio file...' : statusMessage}
                    </Typography>
                </Box>
                )}
            </CardContent>
            </Card>
        ) : null}
        
        {/* Transcript Display */}
        {transcript && transcript.length > 0 && (
            <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card className="transcribe-card">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                    Transcript
                    </Typography>
                    <Box className="transcript-container" sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                    <List>
                        {transcript.map((segment, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    {segment.speaker || 'Speaker'} 
                                </Typography>
                                }
                                secondary={
                                <Typography sx={{ opacity: 0.9 }}>
                                    {segment.text}
                                </Typography>
                                }
                            />
                            </ListItem>
                            {index < transcript.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                        ))}
                    </List>
                    </Box>
                </CardContent>
                </Card>
            </Grid>
            
            {/* Action Buttons */}
            <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {/* Combined Button for Upload and Generate Report */}
                    <Button 
                    variant="outlined" 
                    className="btn-upload"
                    color="primary"
                    onClick={handleUploadAndGenerateReport}
                    disabled={isGeneratingReport || isUploadingToCaseDocuments}
                    startIcon={isUploadingToCaseDocuments || isGeneratingReport ? <CircularProgress size={20} /> : <FolderIcon />}
                    >
                    {isUploadingToCaseDocuments || isGeneratingReport ? 'Processing...' : 'Upload transcript to your case documents'}
                    </Button>
                    
                    {/* Process Another Recording Button */}
                    <Button 
                    variant="outlined"
                    className="btn-upload"
                    onClick={() => {
                        setFile(null);
                        setTranscript([]);
                        setSummary(null);
                        setUploadId(null);
                    }} 
                    startIcon={<MicIcon />}
                    disabled={isGeneratingReport || isUploadingToCaseDocuments}
                    >
                    Process Another Recording
                    </Button>
                </Box>
            </Grid>
            </Grid>
        )}
        
        {/* Replace standard Snackbar with custom Snackbar that includes GoBackButton */}
        <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            action={
            <GoBackButton />
            }
        >
            <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
            </Alert>
        </Snackbar>
        </Box>
  );
};

export default WyserAssist;