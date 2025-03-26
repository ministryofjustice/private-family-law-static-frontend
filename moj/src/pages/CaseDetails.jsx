import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton } from '@mui/material';


import GoBackButton from '../components/GoBackButton';
import SupportTools from '../components/SupportTools'; // Import the new component
import SummaryCardActions from '../components/SummaryCardActions';
import SummaryCardDocuments from '../components/SummaryCardDocuments';
import CaseSummary from '../components/CaseSummary';
import SuccessfulCases from '../components/SuccessfulCases';
import VideoGallery from '../components/VideoGallery';
import VerticalStepper from '../components/VerticalStepper';
import QuestionsAnswers from '../components/QuestionsAnswers';

export default function CaseDetails() {
  const navigate = useNavigate();
  const [pathwayData, setPathwayData] = useState(null);
  const [loadingPathway, setLoadingPathway] = useState(false);
  const [pathwayError, setPathwayError] = useState(null);
  const [qaVisible, setQaVisible] = useState(true);
  const [qaMinimized, setQaMinimized] = useState(true);
  const containerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);

  // Add this function to toggle the Q&A visibility
  const toggleQaVisibility = () => {
    setQaVisible(!qaVisible);
  };

  // Add this function to toggle minimized state
  const toggleQaMinimized = () => {
    setQaMinimized(!qaMinimized);
  };
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
    
  // Fetch pathway data when component mounts or caseId changes
  const fetchPathwayStatus = async () => {
    // Skip if already loading or if we have data for this case
    if (loadingPathway || (pathwayData && pathwayData.case_id === caseId)) return;
    
    try {
      setLoadingPathway(true);
      const response = await fetch(`/api/pathway/${caseId}/status`);
      if (!response.ok) {
        throw new Error('Failed to fetch pathway status');
      }
      
      const data = await response.json();
      setPathwayData(data);
    } catch (error) {
      console.error('Error fetching pathway status:', error);
      setPathwayError(error.message);
    } finally {
      setLoadingPathway(false);
    }
  };
  
  useEffect(() => {
    const updateContainerWidth = () => {
      // Try to get the contentArea element specifically
      const contentArea = document.querySelector('.contentArea');
      if (contentArea) {
        setContainerWidth(contentArea.offsetWidth);
      } else if (containerRef.current) {
        // Fallback to the container width
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    // Initial measurement
    updateContainerWidth();
    
    // Update on window resize and after a short delay for layout to complete
    window.addEventListener('resize', updateContainerWidth);
    
    // Also measure after a slight delay to ensure all components are rendered
    const timeoutId = setTimeout(updateContainerWidth, 500);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateContainerWidth);
      clearTimeout(timeoutId);
    };
  }, []);

  // Simplify the useEffect
  useEffect(() => {
    if (caseId) {
      fetchPathwayStatus();
    }
    // Only depend on caseId
  }, [caseId]);

  useEffect(() => {
    const fetchCaseData = async () => {

      if (caseData && caseData.id === caseId) return;
      try {
        if (!caseId) {
          return;
        }
        
        const response = await fetch(`/api/cases/${caseId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch case data: ${response.status}`);
        }
        
        const data = await response.json();
        setCaseData(data?.case);
      } catch (error) {
        console.error('Error fetching case data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load case data. Please try again.',
          severity: 'error'
        });
      }
    };

    if (caseId) {
      fetchCaseData();
    }
  }, [caseId]);

  // If no caseId is provided, show a message
  if (!caseId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          No Case Selected
        </Typography>
        <Typography variant="body1" paragraph>
          Please select a case to view its details and access support services.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/file-upload')}
          sx={{ mt: 2 }}
        >
          Upload a New Case
        </Button>
      </Box>
    );
  }

  const updateCaseData = async (newQuery) => {
    setCaseData(prevData => ({
      ...prevData,
      queries: [...(prevData?.queries || []), newQuery]
    }));
  };

  return (
    <>
      <GoBackButton />

      <Box 
        ref={containerRef} // Add the ref here
        className="caseDetailsWrapper" 
        sx={{ 
          flexGrow: 1,
          paddingBottom: qaMinimized ? '60px' : '70vh', // Keep this to prevent content from being hidden
        }}
      >
        <Grid className="container" container spacing={2}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <h2>Your case details</h2>
            <p>Below, you'll find an overview of your journey, a summary of your case, similar successful cases, and any relevant videos, all analysed and generated by our AI system based on your uploaded file.</p>
          </Grid>
        </Grid>
        
        {/* Main layout with support services on the left */}
        <Grid container spacing={3}>
          {/* Left sidebar for Support Services - Now using the SupportTools component */}
          <Grid size={{ xs: 12, md: 3 }}>
            <SupportTools />
          </Grid>
          
          {/* Main content area */}
          <Grid className="contentArea" size={{ xs: 12, md: 9 }}>
            <Grid container spacing={3}>
              {/* Case Summary Cards */}
              <Grid size={{ xs: 12, lg: 6 }}>
                {(() => {
                  try {
                    return <SummaryCardActions />;
                  } catch (error) {
                    console.error('Error rendering SummaryCardActions:', error);
                    return <div>Error loading actions</div>;
                  }
                })()}
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                {(() => {
                  try {
                    return <SummaryCardDocuments caseFiles={caseData?.files}/>;
                  } catch (error) {
                    console.error('Error rendering SummaryCardDocuments:', error);
                    return <div>Error loading documents</div>;
                  }
                })()}
              </Grid>
              
              {/* Case Details and Pathway */}
              <Grid size={{ xs: 12 }} container spacing={3}>
                {/* Left column for Case Summary and Successful Cases */}
                <Grid size={{ xs: 12, lg: 8 }} container direction="column" spacing={3}>
                  {/* Case Summary */}
                  <Grid size={{ xs: 12 }}>
                    {(() => {
                      try {
                        return <CaseSummary caseSummary={caseData?.case_summary}/>;
                      } catch (error) {
                        console.error('Error rendering CaseSummary:', error);
                        return <div>Error loading case summary</div>;
                      }
                    })()}
                  </Grid>
                  
                  {/* Successful Cases - Now directly below Case Summary */}
                  <Grid size={{ xs: 12 }}>
                    {(() => {
                      try {
                        return <SuccessfulCases caseSummary={caseData?.case_summary} caseId={caseId}/>;
                      } catch (error) {
                        console.error('Error rendering SuccessfulCases:', error);
                        return <div>Error loading successful cases</div>;
                      }
                    })()}
                  </Grid>
                </Grid>
                
                {/* Right column for Vertical Stepper */}
                <Grid size={{ xs: 12, lg: 4 }}>
                  {(() => {
                    try {
                      return <VerticalStepper 
                        caseId={caseId}
                        pathwayData={pathwayData} 
                        loadingPathway={loadingPathway} 
                      />;
                    } catch (error) {
                      console.error('Error rendering VerticalStepper:', error);
                      return <div>Error loading pathway steps</div>;
                    }
                  })()}
                </Grid>
              </Grid>

              {/* Video Gallery */}
              <Grid size={{ xs: 12 }} container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  {(() => {
                    try {
                      // Safely access nested properties
                      const documentData = pathwayData?.pending_documents?.[0];
                      const title = documentData?.process_name || 'Prepare for mediation';
                      
                      // Only construct stepId if both values exist, otherwise use default
                      let stepId = 'mediationProcess_mediation_preparation'; // Default value
                      if (documentData?.process_key && documentData?.step_id) {
                        stepId = `${documentData.process_key}_${documentData.step_id}`;
                      }
                      
                      return <VideoGallery title={title} stepId={stepId} />;
                    } catch (error) {
                      console.error('Error rendering VideoGallery:', error);
                      return <div>Error loading video gallery</div>;
                    }
                  })()}
                </Grid>
              </Grid>
              
            </Grid>
          </Grid>
        </Grid>
        {!qaVisible && (
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed', // Keep as fixed
          bottom: 20,
          right: 20,
          zIndex: 1050,
        }}
        onClick={toggleQaVisibility}
      >
        <ChatIcon />
      </Fab>
    )}

    {/* Floating Q&A Panel - Keep as fixed but constrain width */}
    <Slide direction="up" in={qaVisible} mountOnEnter unmountOnExit>
      <Box
        className={`floating-qa-panel ${qaVisible ? 'entering' : ''}`}
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0, // Align to right edge
          margin: '0 20px', // Add some margin from the edge
          width: '700px', // Controlled width - adjust as needed
          maxWidth: 'calc(100vw - 40px)', // Ensure it doesn't overflow screen
          zIndex: 1000,
          height: qaMinimized ? '60px' : '59vh',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          // Optional: add a shadow for better visibility
          boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Rest of your slide content remains the same */}
        {/* Header bar with title and controls */}
        <Box
          className="floating-qa-header"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            minHeight: '60px',
          }}
          onClick={toggleQaMinimized}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            Query your documents
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              sx={{ color: 'inherit', mr: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleQaMinimized();
              }}
            >
              {qaMinimized ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ color: 'inherit' }}
              onClick={(e) => {
                e.stopPropagation();
                toggleQaVisibility();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        
        {/* Main content area */}
        {!qaMinimized && (
          <Box
            className="qa-scrollable-area floating-context"
            sx={{
              flexGrow: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <QuestionsAnswers 
              queries={caseData?.queries} 
              caseId={caseId} 
              onQueryAdded={updateCaseData}
            />
          </Box>
        )}
      </Box>
    </Slide>
    </Box>

      {/* Add Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}