import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

import './VerticalStepper.css';

const VerticalStepper = ({ pathwayData, loadingPathway }) => {
  const navigate = useNavigate();

  // Handle navigation to the full pathway
  const handleSeeFullPathway = () => {
    // Navigate to the full pathway page
    navigate('/pathway');
  };

  // Handle loading state
  if (loadingPathway || !pathwayData) {
    return (
      <Box className="verticalStepper mt-4 pb-4 sticky">
        <h3 className="mb-2">Your next steps</h3>
        <Typography>Loading pathway data...</Typography>
      </Box>
    );
  }

  // Extract steps from pathwayData
  const processSteps = Object.entries(pathwayData.process_status)
    .filter(([_, process]) => process.required === true)
    .map(([processKey, process]) => {
      return {
        key: processKey,
        label: process.name,
        description: process.description || `Complete required documents for ${process.name}`,
        status: process.status,
        percentage: process.percentage,
        isActive: process.status === "In Progress",
        isCompleted: process.status === "Complete"
      };
    })
    .sort((a, b) => {
      // Sort by status: completed first, then in progress, then pending
      if (a.isCompleted && !b.isCompleted) return -1;
      if (!a.isCompleted && b.isCompleted) return 1;
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return 0;
    });

  // Find the active step index
  const activeStepIndex = processSteps.findIndex(step => step.isActive);
  
  // If no step is active, set to the first incomplete step
  const effectiveActiveStep = activeStepIndex >= 0 ? 
    activeStepIndex : 
    processSteps.findIndex(step => !step.isCompleted);

  return (
    <Box className="verticalStepper mt-4 pb-4 sticky">
      <h3 className="mb-2">Your next steps</h3>
      
      <Stepper className="verticalStepperSteps" activeStep={effectiveActiveStep} orientation="vertical">
        {processSteps.map((step, index) => (
          <Step key={step.key}>
            <StepLabel>
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              
              {/* Show progress if available */}
              {step.percentage !== undefined && (
                <Typography variant="body2" className="mt-2">
                  Progress: {step.percentage}% complete
                </Typography>
              )}
              
              {/* Only show the button for the active step */}
              {index === effectiveActiveStep && (
                <Box sx={{ mb: 2 }}>
                  <Button 
                    onClick={handleSeeFullPathway} 
                    variant="contained" 
                    className="mt-4 cta-button"
                  >
                    See steps
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      
      {/* Show a message if all steps are complete */}
      {processSteps.every(step => step.isCompleted) && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Congratulations! All steps completed.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VerticalStepper;