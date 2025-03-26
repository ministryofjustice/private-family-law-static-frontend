import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// Import service components
import AdviceFinder from '../components/AdviceFinder';
import BetterOffCalculator from '../components/BetterOffCalculator';
import AudioUploadComponent from '../components/WyserAssist';
import GoBackButton from '../components/GoBackButton';
import SupportTools from '../components/SupportTools';

// Import CSS files for each service
import '../components/AdviceFinder.css';
import '../components/BetterOffCalculator.css';
import '../components/WyserAssist.css';
import './ServicePage.css';

// Service configuration with titles and components
const serviceConfig = {
  'advice-finder': {
    title: 'Advice Finder',
    description: 'Find legal advice resources based on your case details.',
    component: AdviceFinder
  },
  'better-off': {
    title: 'Better Off Calculator',
    description: 'Calculate potential financial outcomes for your case.',
    component: BetterOffCalculator
  },
  'transcribe': {
    title: 'Transcribe Hearings',
    description: 'Upload and transcribe audio from your hearings for easier reference.',
    component: AudioUploadComponent
  }
};

const ServicePage = () => {
  const { caseId, serviceName } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Get service config or use fallback values
  const service = serviceConfig[serviceName] || {
    title: 'Unknown Service',
    description: 'This service is not available.',
    component: () => <div>Service not found</div>
  };
  
  // Get the component to render
  const ServiceComponent = service.component;
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
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

  // Check if case ID is provided for services that require it
  useEffect(() => {
    if (!caseId && ['advice-finder', 'better-off'].includes(serviceName)) {
      setSnackbar({
        open: true,
        message: 'No case selected. Some features may be limited.',
        severity: 'warning'
      });
    }
  }, [caseId, serviceName]);

  return (
    <>
      <GoBackButton />

      <Box 
        ref={containerRef}
        className="servicePageWrapper" 
        sx={{ 
          flexGrow: 1,
        }}
      >
        <Grid className="container" container spacing={2}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </Grid>
        </Grid>
        
        {/* Main layout with support services on the left */}
        <Grid container spacing={3}>
          {/* Left sidebar for Support Tools */}
          <Grid size={{ xs: 12, md: 3 }}>
            <SupportTools />
          </Grid>
          
          {/* Main content area */}
          <Grid className="contentArea" size={{ xs: 12, md: 9 }}>
            {/* Service-specific colored bar with controlled width */}
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 3 }}>
              <Box sx={{ width: '100%' }}> {/* Adjust this percentage to control width */}
                <AppBar 
                  position="static" 
                  className={`serviceAppBar app-bar-${serviceName}`}
                  sx={{
                    height: '8px',
                    minHeight: '8px',
                    boxShadow: 'none',
                  }}
                >
                  <Toolbar sx={{ minHeight: '8px !important', height: '8px', padding: 0 }} />
                </AppBar>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              {/* Wrap the service component in a try-catch for error handling */}
              {(() => {
                try {
                  return <ServiceComponent caseId={caseId} />;
                } catch (error) {
                  console.error(`Error rendering ${service.title}:`, error);
                  return (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="h6" color="error">
                        Error loading {service.title}
                      </Typography>
                      <Typography variant="body1">
                        Please try refreshing the page or contact support.
                      </Typography>
                    </Box>
                  );
                }
              })()}
            </Box>
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
};

export default ServicePage;