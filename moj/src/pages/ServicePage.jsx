import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

// Import service components
import AdviceFinder from '../components/AdviceFinder';
import BetterOffCalculator from '../components/BetterOffCalculator';
import AudioUploadComponent from '../components/WyserAssist';
import GoBackButton from '../components/GoBackButton'; // Import the GoBackButton component

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
    title: 'Transcribe',
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
  
  // Custom back handler specifically for service pages
  const handleBackToDashboard = () => {
    navigate(`/case-details/${caseId}`);
  };
  
  return (
    <>
      <Box sx={{ mb: 2 }}>
          <GoBackButton />
      </Box>
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
      
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <ServiceComponent caseId={caseId} />
        </Box>
      </Container>
    </>
  );
};

export default ServicePage;