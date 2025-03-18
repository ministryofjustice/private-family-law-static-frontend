import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

// Import the service colors from Dashboard
import { serviceColors } from '../utils/constants';

// Import service components
import AdviceFinder from '../components/AdviceFinder';
import BetterOffCalculator from '../components/BetterOffCalculator';
import AudioUploadComponent from '../components/WyserAssist';

// Service configuration with titles, colors, and components
const serviceConfig = {
  'advice-finder': {
    title: 'Advice Finder',
    color: serviceColors.adviceFinder,
    component: AdviceFinder
  },
  'better-off': {
    title: 'Better Off Calculator',
    color: serviceColors.betterOff,
    component: BetterOffCalculator
  },
  'transcribe': {
    title: 'Transcribe',
    color: serviceColors.transcribe,
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
    color: '#616161',
    component: () => <div>Service not found</div>
  };
  
  // Get the component to render
  const ServiceComponent = service.component;
  
  // Custom back handler specifically for service pages
  const handleBackToDashboard = () => {
    navigate(`/case-details/${caseId}`);
  };
  
  return (
    <>
      {/* Colored AppBar that matches the service button color */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: service.color,
          marginBottom: 4
        }}
      >
        <Toolbar>
          {/* Custom back button that goes directly to dashboard */}
          <IconButton
            color="inherit"
            aria-label="back to dashboard"
            onClick={handleBackToDashboard}
            edge="start"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {service.title}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          {/* This will render the specific service component */}
          <ServiceComponent caseId={caseId} />
        </Box>
      </Container>
    </>
  );
};

export default ServicePage;