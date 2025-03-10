import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import './PathwayProgress.css';

const PathwayProgress = ({ pathwayData, loadingPathway, pathwayError, setUploadDialogOpen }) => {
  if (loadingPathway) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="verticalStepper">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Case Progress
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={30} />
        </Box>
      </Paper>
    );
  }

  if (pathwayError) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="verticalStepper">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Case Progress
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Alert severity="error" sx={{ mb: 2 }}>
          {pathwayError}
        </Alert>
      </Paper>
    );
  }

  if (!pathwayData) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="verticalStepper">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Case Progress
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Alert severity="info" sx={{ mb: 2 }}>
          No pathway data available for this case.
        </Alert>
      </Paper>
    );
  }

  // Get a list of all document IDs that are already shown as completed required documents
  const getCompletedRequiredDocumentIds = () => {
    return pathwayData.completed_documents
      .filter(doc => doc.required === true)
      .map(doc => doc.combined_document_id);
  };

  // Get documents for a specific step
  const getDocumentsForStep = (stepId) => {
    const completedDocs = pathwayData.completed_documents.filter(
      doc => doc.step_id === stepId && doc.required === true
    );
    
    const pendingDocs = pathwayData.pending_documents.filter(
      doc => doc.step_id === stepId && doc.required === true
    );
    
    return { completedDocs, pendingDocs };
  };

  // Get steps for a specific process
  const getStepsForProcess = (processKey) => {
    // Get step IDs from completed and pending documents that belong to this process
    const stepIdsFromDocs = [
      ...pathwayData.completed_documents
        .filter(doc => doc.process_key === processKey && doc.required === true)
        .map(doc => doc.step_id),
      ...pathwayData.pending_documents
        .filter(doc => doc.process_key === processKey && doc.required === true)
        .map(doc => doc.step_id)
    ];
    
    // Get distinct step IDs
    const uniqueStepIds = [...new Set(stepIdsFromDocs)];
    
    // Map step IDs to step objects
    return uniqueStepIds
      .map(stepId => ({
        key: stepId,
        ...pathwayData.step_progress[stepId]
      }))
      .filter(step => step.title); // Make sure the step exists
  };

  // Find the first incomplete process or process with required documents that's not complete
  const getActiveProcess = () => {
    // First, look for a process that's explicitly "In Progress"
    const inProgressProcess = Object.entries(pathwayData.process_status)
      .filter(([_, process]) => process.required === true)
      .find(([_, process]) => process.status === "In Progress");
    
    if (inProgressProcess) return inProgressProcess;
    
    // If no "In Progress" process, find the first incomplete process with pending documents
    const incompleteProcess = Object.entries(pathwayData.process_status)
      .filter(([_, process]) => process.required === true && process.status !== "Complete" && process.required_docs > 0)
      .sort((a, b) => a[1].percentage - b[1].percentage)[0];
    
    if (incompleteProcess) return incompleteProcess;
    
    // If no incomplete processes with pending docs, return the first required process
    return Object.entries(pathwayData.process_status)
      .filter(([_, process]) => process.required === true)[0] ||
      ["default", { name: "Case Progress" }];
  };

  // Get the current active process
  const currentProcess = getActiveProcess();
  const [currentProcessKey, currentProcessData] = currentProcess;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'var(--lightOrange)' }} className="verticalStepper">
      {/* Process title as main header */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        {currentProcessData.name}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box>
        {/* Process Sections - Only show incomplete processes */}
        {Object.entries(pathwayData.process_status)
          .filter(([_, process]) => process.required === true && process.status !== "Complete")
          .map(([processKey, process]) => {
            const isInProgress = process.status === "In Progress";
            
            // Get steps for this process 
            const stepsForProcess = getStepsForProcess(processKey);
            
            return (
              <Box className="verticalStepper" key={processKey} sx={{ mb: 4 }}>
                {/* Process status info */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Typography variant="body1">
                    {process.completed_docs} of {process.required_docs} required documents completed
                  </Typography>
                  <Chip 
                    label={`${process.percentage}%`}
                    color={isInProgress ? "primary" : "default"}
                    size="medium"
                  />
                </Box>
                
                {/* Process Content */}
                <Box className="verticalStepper">
                  {stepsForProcess.length > 0 ? (
                    <Stepper orientation="vertical" className="verticalStepperSteps">
                      {stepsForProcess.map((step) => {
                        const { completedDocs, pendingDocs } = getDocumentsForStep(step.key);
                        const stepCompleted = step.percentage === 100;
                        
                        return (
                          <Step key={step.key} active={!stepCompleted} completed={stepCompleted}>
                            <StepLabel 
                              StepIconProps={{ 
                                icon: stepCompleted ? <CheckCircleIcon color="success" /> : step.key, 
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'black !important' }}>
                                  {step.title}
                                  {step.required && (
                                    <Chip
                                      size="small"
                                      label="Required"
                                      color="primary"
                                      variant="outlined"
                                      sx={{ ml: 1 }}
                                    />
                                  )}
                                </Typography>
                                {stepCompleted ? (
                                  <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Complete"
                                    color="success"
                                    size="small"
                                  />
                                ) : (
                                  <Chip
                                    label={`${step.percentage}%`}
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </Box>
                            </StepLabel>
                            <StepContent>
                              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                {step.description}
                              </Typography>
                              
                              {/* Pending Documents */}
                              {pendingDocs.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'black !important' }}>
                                    Required Documents
                                  </Typography>
                                  <List dense>
                                    {pendingDocs.map(doc => (
                                      <ListItem key={doc.document_id}>
                                        <ListItemIcon>
                                          <ErrorIcon color="error" />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary={
                                            <>
                                              {doc.document_name}
                                              <Chip
                                                size="small"
                                                label="Required"
                                                color="error"
                                                sx={{ ml: 1 }}
                                              />
                                            </>
                                          }
                                          secondary={doc.document_description}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                              )}
                              
                              {/* Completed Documents */}
                              {completedDocs.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                                    Completed Documents
                                  </Typography>
                                  <List dense>
                                    {completedDocs.map(doc => {
                                      const matchingFile = pathwayData.completed_files?.find(file => 
                                        file.document_ids.some(id => id.id === doc.combined_document_id)
                                      );
                                      
                                      return (
                                        <ListItem key={doc.document_id}>
                                          <ListItemIcon>
                                            <CheckCircleIcon color="success" />
                                          </ListItemIcon>
                                          <ListItemText 
                                            primary={doc.document_name}
                                            secondary={
                                              <>
                                                {doc.document_description}
                                                {matchingFile && (
                                                  <Typography variant="body2" component="div">
                                                    <strong>File:</strong> {matchingFile.file_name}
                                                  </Typography>
                                                )}
                                              </>
                                            }
                                          />
                                        </ListItem>
                                      );
                                    })}
                                  </List>
                                </Box>
                              )}
                              
                              {/* User Documents (if step has them) */}
                              {step.user_documents && step.user_documents.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                                    Your Uploaded Documents
                                  </Typography>
                                  <List dense>
                                    {step.user_documents.map((doc, index) => (
                                      <ListItem key={`user-doc-${index}-${doc.id}`}>
                                        <ListItemIcon>
                                          <CheckCircleIcon color="info" />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary={doc.value} 
                                          secondary={`File: ${doc.file_name}`}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                              )}
                            </StepContent>
                          </Step>
                        );
                      })}
                    </Stepper>
                  ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 2 }}>
                      No required steps found for this process.
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
          
        {/* If there are no incomplete processes, show a message */}
        {Object.entries(pathwayData.process_status)
          .filter(([_, process]) => process.required === true && process.status !== "Complete").length === 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            All required processes have been completed.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default PathwayProgress;