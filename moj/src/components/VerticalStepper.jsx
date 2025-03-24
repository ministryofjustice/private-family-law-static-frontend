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

const VerticalStepper = ({ pathwayData, loadingPathway, caseId }) => {
  const navigate = useNavigate();

  // Define the correct process order
  const processOrder = [
    "mediationProcess", // Mediation (1st)
    "applicationProcess", // Application Submission Process (2nd)
    "caseSetUpProcess", // Case Setup Phase (3rd)
    "fhdraProcess" // FHDRA Phase (4th)
  ];

  // Helper function to find the target step ID for a given process
  const findTargetStepForProcess = (processKey) => {
    // Check if the current process has an active step specified in current_phase
    if (pathwayData.current_phase) {
      // Does this current_phase belong to our clicked process?
      const currentPhaseProcess = [
        ...pathwayData.completed_documents,
        ...pathwayData.pending_documents
      ].find(doc => doc.step_id === pathwayData.current_phase)?.process_key;
      
      if (currentPhaseProcess === processKey) {
        // The current_phase belongs to this process, so use it
        return pathwayData.current_phase;
      }
    }
    
    // Get all steps for this process
    const stepsForProcess = [
      ...new Set([
        ...pathwayData.completed_documents
          .filter(doc => doc.process_key === processKey)
          .map(doc => doc.step_id),
        ...pathwayData.pending_documents
          .filter(doc => doc.process_key === processKey)
          .map(doc => doc.step_id)
      ])
    ];
    
    // Find the first incomplete step
    for (const stepId of stepsForProcess) {
      const stepData = pathwayData.step_progress[stepId];
      if (stepData && stepData.status !== "Complete") {
        return stepId;
      }
    }
    
    // If all steps are complete or we couldn't find a step, use the first step
    if (stepsForProcess.length > 0) {
      return stepsForProcess[0];
    }
    
    return null;
  };

  // Handle navigation to the full pathway
  const handleNavigateToPathway = (processKey) => {
    const targetStepId = findTargetStepForProcess(processKey);
    
    // Navigate to the pathway page with state
    navigate(`/pathway/${caseId}`, { 
      state: { 
        caseId: caseId,
        pathwayData: pathwayData,
        targetProcessKey: processKey,
        targetStepId: targetStepId,
        hasPathwayData: true
      }
    });
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
  
  // Find the active process (In Progress)
  const activeProcess = Object.entries(pathwayData.process_status)
    .find(([_, process]) => process.status === "In Progress");
    
  const activeProcessKey = activeProcess ? activeProcess[0] : null;
  const activeProcessIndex = activeProcessKey ? processOrder.indexOf(activeProcessKey) : -1;
  
  // Function to determine if a process should be displayed
  const shouldDisplayProcess = (processKey) => {
    const processStatus = pathwayData.process_status[processKey];
    
    if (!processStatus) return false;
    
    // If the process is already required, display it
    if (processStatus.required === true) {
      return true;
    }
    
    // If it's in pending documents and the current process is "greater" (comes later)
    const isPending = pathwayData.pending_documents.some(doc => doc.process_key === processKey);
    
    if (isPending) {
      const processIndex = processOrder.indexOf(processKey);
      // Show if this process comes before or is equal to the active process
      return activeProcessIndex >= processIndex;
    }
    
    return false;
  };

  // Get all process keys from the data
  const allProcessKeys = processOrder.filter(key => pathwayData.process_status[key]);
  
  // Construct the steps array
  const processSteps = allProcessKeys
    .filter(shouldDisplayProcess)
    .map(processKey => {
      const process = pathwayData.process_status[processKey];
      
      // Check if there are any pending documents for this process
      const hasPendingDocuments = pathwayData.pending_documents.some(
        doc => doc.process_key === processKey
      );
      
      // A process should not be marked as completed if it has pending documents
      const isReallyCompleted = process.status === "Complete" && !hasPendingDocuments;
      
      return {
        key: processKey,
        label: process.name,
        description: process.description || `Complete required documents for ${process.name}`,
        status: hasPendingDocuments ? "In Progress" : process.status, // Override status if pending
        percentage: process.percentage,
        isActive: process.status === "In Progress" || hasPendingDocuments, // Include both conditions
        hasPendingDocuments,
        isCompleted: isReallyCompleted,
        order: processOrder.indexOf(processKey) // For sorting
      };
    })
    .sort((a, b) => a.order - b.order); // Sort by the defined order

  // Find the first index with pending docs to set as active in stepper
  const firstPendingIndex = processSteps.findIndex(step => step.hasPendingDocuments);
  const firstActiveIndex = processSteps.findIndex(step => step.isActive);
  
  // Use the first pending or active index, fallback to first incomplete
  const effectiveActiveStep = firstPendingIndex >= 0 ? 
    firstPendingIndex : 
    (firstActiveIndex >= 0 ? 
      firstActiveIndex : 
      processSteps.findIndex(step => !step.isCompleted));

  return (
    <Box className="verticalStepper mt-4 pb-4 sticky">
      <h3 className="mb-2">Your next steps</h3>
      
      <Stepper className="verticalStepperSteps" activeStep={effectiveActiveStep} orientation="vertical">
        {processSteps.map((step) => (
          <Step key={step.key} expanded={true} active={step.isActive}>
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
              
              {/* Show buttons for any step that is active or has pending documents */}
              {(step.isActive || step.hasPendingDocuments) && (
                <Box sx={{ mb: 2 }}>
                  <Button 
                    onClick={() => handleNavigateToPathway(step.key)} 
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