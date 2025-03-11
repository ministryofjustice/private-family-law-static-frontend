import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalculateIcon from '@mui/icons-material/Calculate';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TranscribeIcon from '@mui/icons-material/Transcribe';

import GoBackButton from '../components/GoBackButton';
import SummaryCardActions from '../components/SummaryCardActions';
import SummaryCardDocuments from '../components/SummaryCardDocuments';
import CaseSummary from '../components/CaseSummary';
import SuccessfulCases from '../components/SuccessfulCases';
import VideoGallery from '../components/VideoGallery';
import VerticalStepper from '../components/VerticalStepper';
import QuestionsAnswers from '../components/QuestionsAnswers';

// Define colors for each service to use across the application
export const serviceColors = {
  adviceFinder: '#810f7c', // Yellow
  betterOff: '#2c7fb8',   // Blue
  wyserAssist: '#31a354'    // Green
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [pathwayData, setPathwayData] = useState(null);
  const [loadingPathway, setLoadingPathway] = useState(false);
  const [pathwayError, setPathwayError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  
  // Navigation functions for external services
  const navigateToService = (serviceName) => {
    if (caseId) {
      navigate(`/dashboard/${caseId}/service/${serviceName}`);
    } else {
      // If no caseId is provided, we need to handle this case
      // You could either redirect to a case selection page or show an error
      setSnackbar({
        open: true,
        message: 'Please select a case first',
        severity: 'warning'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const fetchPathwayStatus = useCallback(async () => {
    try {
      setLoadingPathway(true);
      console.log("case id = ", caseId);
      const response = await fetch(`/api/pathway/${caseId}/status`);
      console.log("response = ", response);
      if (!response.ok) {
        throw new Error('Failed to fetch pathway status');
      }
      
      const data = await response.json();
      console.log("data = ", data);
      setPathwayData(data);
    } catch (error) {
      console.error('Error fetching pathway status:', error);
      setPathwayError(error.message);
    } finally {
      setLoadingPathway(false);
    }
  }, [caseId]);
    
  // Fetch pathway data when component mounts or caseId changes
  useEffect(() => {
    if (caseId) {
      fetchPathwayStatus();
    }
  }, [caseId, fetchPathwayStatus]);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        if (!caseId) {
          console.log('No case ID provided, skipping data fetch');
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

  // Component for Support Services sidebar
  const SupportServices = () => (
    <Box sx={{ p: 2 }}>
      <h3 className="mb-2">
        Support Services
      </h3>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button 
          variant="contained"
          fullWidth
          onClick={() => navigateToService('advice-finder')}
          sx={{ 
            py: 2, 
            textTransform: 'none',
            backgroundColor: serviceColors.adviceFinder,
            '&:hover': {
              backgroundColor: serviceColors.adviceFinder,
              opacity: 0.9
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="subtitle1">Advice Finder</Typography>
          <LocationOnIcon sx={{ fontSize: 36 }} />
        </Button>
        
        <Button 
          variant="contained"
          fullWidth
          onClick={() => navigateToService('better-off')}
          sx={{ 
            py: 2, 
            textTransform: 'none',
            backgroundColor: serviceColors.betterOff,
            '&:hover': {
              backgroundColor: serviceColors.betterOff,
              opacity: 0.9
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="subtitle1">Better Off Calculator</Typography>
          <CalculateIcon sx={{ fontSize: 36 }} />
        </Button>
        
        <Button 
          variant="contained"
          fullWidth
          onClick={() => navigateToService('service-3')}
          sx={{ 
            py: 2, 
            textTransform: 'none',
            backgroundColor: serviceColors.wyserAssist,
            '&:hover': {
              backgroundColor: serviceColors.wyserAssist,
              opacity: 0.9
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="subtitle1">Wyser Assist</Typography>
          <TranscribeIcon sx={{ fontSize: 36 }} />
        </Button>
      </Box>
    </Box>
  );
  const updateCaseData = async (newQuery) => {
    setCaseData(prevData => ({
      ...prevData,
      queries: [...(prevData?.queries || []), newQuery]
    }));
  };

  return (
    <>
      <GoBackButton />

      <Box sx={{ flexGrow: 1 }}>
        <Grid className="container" container spacing={2}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <h2>Your case details</h2>
            <p>Below, you'll find an overview of your journey, a summary of your case, similar successful cases, and any relevant videos, all analysed and generated by our AI system based on your uploaded file.</p>
          </Grid>
        </Grid>
        
        {/* Main layout with support services on the left */}
        <Grid container spacing={3}>
          {/* Left sidebar for Support Services */}
          <Grid size={{ xs: 12, md: 3, lg: 2 }}>
            <SupportServices />
          </Grid>
          
          {/* Main content area */}
          <Grid size={{ xs: 12, md: 9, lg: 10 }}>
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
                <Grid size={{ xs: 12, lg: 8 }}>
                  {(() => {
                    try {
                      return <CaseSummary caseSummary={caseData?.case_summary}/>;
                    } catch (error) {
                      console.error('Error rendering CaseSummary:', error);
                      return <div>Error loading case summary</div>;
                    }
                  })()}
                  {(() => {
                    try {
                      return <SuccessfulCases caseSummary={caseData?.case_summary} caseId={caseId}/>;
                    } catch (error) {
                      console.error('Error rendering SuccessfulCases:', error);
                      return <div>Error loading successful cases</div>;
                    }
                  })()}
                  {(() => {
                    try {
                      return <VideoGallery title={pathwayData?.pending_documents[0]?.process_name} stepId={pathwayData?.pending_documents[0]?.process_key + '_' + pathwayData?.pending_documents[0]?.step_id} />;
                    } catch (error) {
                      console.error('Error rendering VideoGallery:', error);
                      return <div>Error loading video gallery</div>;
                    }
                  })()}
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  {(() => {
                    try {
                      return <VerticalStepper 
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
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 12 }}>
                <QuestionsAnswers 
                  queries={caseData?.queries} 
                  caseId={caseId} 
                  onQueryAdded={updateCaseData}
                />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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