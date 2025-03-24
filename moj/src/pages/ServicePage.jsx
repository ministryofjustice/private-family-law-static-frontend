import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';

// Import service components
import AdviceFinder from '../components/AdviceFinder';
import BetterOffCalculator from '../components/BetterOffCalculator';
import AudioUploadComponent from '../components/WyserAssist';
import GoBackButton from '../components/GoBackButton';
import SupportTools from '../components/SupportTools'; // Import the SupportTools component

// Import CSS files for each service
import '../components/AdviceFinder.css';
import '../components/BetterOffCalculator.css';
import '../components/WyserAssist.css';
import './ServicePage.css';

// Service configuration with titles and components
const serviceConfig = {
  'advice-finder': {
    title: 'Advice Finder',
    appBarClass: 'app-bar-advice-finder',
    component: AdviceFinder
  },
  'better-off': {
    title: 'Better Off Calculator',
    appBarClass: 'app-bar-better-off',
    component: BetterOffCalculator
  },
  'transcribe': {
    title: 'Transcribe Hearings',
    appBarClass: 'app-bar-transcribe',
    component: AudioUploadComponent
  }
};

// This is the main service page component that will render the appropriate service
const ServicePage = () => {
  const { caseId, serviceName } = useParams();
  const navigate = useNavigate();
  
  // Get service config or use fallback values
  const service = serviceConfig[serviceName] || {
    title: 'Unknown Service',
    appBarClass: '',
    component: () => <div>Service not found</div>
  };
  
  // Get the component to render
  const ServiceComponent = service.component;
  
  return (
    <>
      <GoBackButton />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="static" 
          className={`serviceAppBar ${service.appBarClass}`}
          style={{ marginBottom: '32px' }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              style={{ flexGrow: 1, color: 'white' }}
            >
              {service.title}
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* Main layout with support services on the left */}
        <Grid container spacing={3}>
          {/* Left sidebar for Support Tools */}
          <Grid size={{ xs: 12, md: 3, lg: 2 }}>
            <SupportTools />
          </Grid>
          
          {/* Main content area */}
          <Grid className="contentArea" size={{ xs: 12, md: 9, lg: 10 }}>
            <Container>
              <Box sx={{ mb: 4 }}>
                <ServiceComponent caseId={caseId} />
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ServicePage;