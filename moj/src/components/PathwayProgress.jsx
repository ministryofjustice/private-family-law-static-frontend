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
import './VerticalStepper.css'; // Import the same CSS file used by the simpler component

const PathwayProgress = ({ pathwayData, loadingPathway, pathwayError, setUploadDialogOpen }) => {
  if (loadingPathway) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="verticalStepper">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Case Progress
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={30} />
        </Box>
      </Paper>
    );
  }

  if (pathwayError) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="verticalStepper">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Case Progress
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="error" sx={{ mb: 2 }}>
          {pathwayError}
        </Alert>
      </Paper>
    );
  }

  if (!pathwayData) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="verticalStepper">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Case Progress
        </Typography>
        <Divider sx={{ mb: 2 }} />
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

  // Associate completed and pending documents with their process keys
  const getRequiredStepsForProcess = (processKey) => {
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

  // Get steps with user documents for a process, excluding duplicates
  const getUserDocumentStepsForProcess = (processKey) => {
    const completedRequiredDocIds = getCompletedRequiredDocumentIds();
    
    return Object.entries(pathwayData.step_progress)
      .filter(([stepKey, step]) => {
        // Check if this is a user document step
        if (!(step.process_key === processKey && 
              step.user_documents && 
              step.user_documents.length > 0)) {
          return false;
        }
        
        // If this is a required step, always include it
        if (step.required === true) {
          return true;
        }
        
        // For non-required steps with user uploads, check if all their documents
        // are already shown as completed required documents elsewhere
        const allDocsAlreadyShown = step.user_documents.every(doc => 
          completedRequiredDocIds.includes(doc.id)
        );
        
        // Only include this step if it has at least one document that isn't
        // already shown as a completed required document elsewhere
        return !allDocsAlreadyShown;
      })
      .map(([key, step]) => ({
        key,
        ...step
      }));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="verticalStepper">
      <h3 className="mb-2">Your pathway</h3>
      <Divider sx={{ mb: 2 }} />
      
      <Box>
        {/* Pathway Progress */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <h3 className="mb-2">Pathway Progress</h3>
            <Typography variant="body2">
              {pathwayData.overall_progress.completed} of {pathwayData.overall_progress.required} documents completed
            </Typography>
          </Box>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={pathwayData.overall_progress.percentage}
              size={60}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div">
                {`${pathwayData.overall_progress.percentage}%`}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Process-Based Stepper */}
        <Stepper className="verticalStepperSteps" orientation="vertical" activeStep={
          // Find the active process index
          Object.entries(pathwayData.process_status)
            .filter(([_, process]) => process.required === true)
            .findIndex(([_, process]) => process.status === "In Progress")
        }>
          {Object.entries(pathwayData.process_status)
            .filter(([_, process]) => process.required === true)
            .map(([processKey, process]) => {
              const isCompleted = process.status === "Complete";
              const isInProgress = process.status === "In Progress";
              
              // Get required steps for this process using documents
              const requiredSteps = getRequiredStepsForProcess(processKey);
              
              // Also get steps with user uploads for this process (excluding duplicates)
              const userDocumentSteps = getUserDocumentStepsForProcess(processKey);
              
              // Combine both sets of steps, removing duplicates
              const allStepsForProcess = [
                ...requiredSteps,
                ...userDocumentSteps.filter(uStep => 
                  !requiredSteps.some(rStep => rStep.key === uStep.key)
                )
              ];
              
              // Count total user document uploads for this process
              const userDocumentsCount = userDocumentSteps.reduce((count, step) => {
                return count + (step.user_documents ? step.user_documents.length : 0);
              }, 0);
              
              const hasUserDocuments = userDocumentsCount > 0;
              
              return (
                <Step key={processKey} expanded={true}>
                  <StepLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h7">
                        {process.name}
                      </Typography>
                      <Chip 
                        label={`${process.percentage}%`}
                        color={isCompleted ? "success" : isInProgress ? "primary" : "default"}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                      {isCompleted && (
                        <Typography variant="body2" color="success.main" sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                          Required Documents Complete
                        </Typography>
                      )}
                    </Box>
                  </StepLabel>
                  <StepContent>
                    {isCompleted && !hasUserDocuments ? (
                      // Show a nice completed message when process is complete and has no user uploads
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'success.lighter', 
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'success.light',
                          mt: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              All required documents for <strong>{process.name}</strong> are complete
                            </Typography>
                            <Typography variant="body2">
                              {process.completed_docs} of {process.required_docs} required documents completed
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ) : (
                      // Show detailed steps and process information
                      <Box sx={{ mt: 2 }}>
                        {/* Process description (if available) */}
                        {process.description && (
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {process.description}
                          </Typography>
                        )}
                        
                        {/* Process level summary */}
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h7">
                              Required Documents
                            </Typography>
                            <Chip 
                              label={`${process.percentage}%`}
                              color={process.percentage === 100 ? "success" : "primary"}
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {process.completed_docs} of {process.required_docs} completed
                          </Typography>
                          
                          {/* Display additional explanatory text if applicable */}
                          {hasUserDocuments && process.percentage < 100 && (
                            <Alert severity="info" sx={{ mt: 1 }}>
                              You've uploaded {userDocumentsCount} document{userDocumentsCount !== 1 ? 's' : ''} for this process, but some required documents are still pending.
                            </Alert>
                          )}
                        </Box>
                        
                        {/* Inner Stepper for steps within this process */}
                        {allStepsForProcess.length > 0 ? (
                          <Stepper className="verticalStepperSteps" orientation="vertical" sx={{ ml: 0 }} activeStep={-1}>
                            {allStepsForProcess.map(step => {
                              // Find documents for this step
                              const completedDocsForStep = pathwayData.completed_documents.filter(
                                doc => doc.step_id === step.key && doc.required === true
                              );
                              
                              const pendingDocsForStep = pathwayData.pending_documents.filter(
                                doc => doc.step_id === step.key && doc.required === true
                              );
                              
                              // Check for required documents
                              const hasRequiredDocs = completedDocsForStep.length > 0 || pendingDocsForStep.length > 0;
                              
                              // Check for user uploads
                              const userDocumentsForStep = step.user_documents || [];
                              
                              // Filter out user documents that are already shown as completed required documents
                              const completedRequiredDocIds = getCompletedRequiredDocumentIds();
                              const uniqueUserDocs = step.required 
                                ? userDocumentsForStep // If it's a required step, show all its user docs
                                : userDocumentsForStep.filter(doc => !completedRequiredDocIds.includes(doc.id));
                              
                              const hasUserDocs = uniqueUserDocs.length > 0;
                              
                              return (
                                <Step key={step.key} expanded={true}>
                                  <StepLabel>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="body1">
                                        <strong>Step:</strong> {step.title}
                                      </Typography>
                                      {step.required && (
                                        <Chip
                                          size="small"
                                          label="Required"
                                          color="primary"
                                          variant="outlined"
                                          sx={{ ml: 1 }}
                                        />
                                      )}
                                      {pendingDocsForStep.length > 0 && (
                                        <Chip
                                          size="small"
                                          label={`${pendingDocsForStep.length} Required Doc${pendingDocsForStep.length !== 1 ? 's' : ''}`}
                                          color="error"
                                          variant="outlined"
                                          sx={{ ml: 1 }}
                                        />
                                      )}
                                    </Box>
                                  </StepLabel>
                                  <StepContent>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                      <strong>Description:</strong> {step.description}
                                    </Typography>
                                    
                                    {/* Show required documents that need to be uploaded */}
                                    {pendingDocsForStep.length > 0 && (
                                      <Box sx={{ mb: 2 }}>
                                        <List dense>
                                          {pendingDocsForStep.map(doc => (
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
                                                secondary={
                                                  <>
                                                    <strong>Process:</strong> {doc.process_name}<br/>
                                                    <strong>Step:</strong> {doc.step_title}<br/>
                                                    <strong>Description:</strong> {doc.document_description}
                                                  </>
                                                }
                                              />
                                            </ListItem>
                                          ))}
                                        </List>
                                      </Box>
                                    )}
                                    
                                    {/* Show completed documents from schema */}
                                    {completedDocsForStep.length > 0 && (
                                      <Box sx={{ mb: 2 }}>
                                        <Typography variant="h7" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                                          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                                          Completed Required Documents
                                        </Typography>
                                        <List dense>
                                          {completedDocsForStep.map(doc => {
                                            const matchingFile = pathwayData.completed_files?.find(file => 
                                              file.document_ids.some(id => id.id === doc.combined_document_id)
                                            );
                                            
                                            return (
                                              <ListItem key={doc.document_id}>
                                                <ListItemIcon>
                                                  <CheckCircleIcon color="success" />
                                                </ListItemIcon>
                                                <ListItemText 
                                                  primary={
                                                    <>
                                                      {doc.document_name}
                                                      <Chip
                                                        size="small"
                                                        label="Required"
                                                        color="success"
                                                        sx={{ ml: 1 }}
                                                      />
                                                    </>
                                                  }
                                                  secondary={
                                                    <>
                                                      {doc.document_description}<br/>
                                                      {matchingFile ? <>
                                                        <strong>File:</strong> {matchingFile.file_name}
                                                      </> : ""}
                                                    </>
                                                  }
                                                />
                                              </ListItem>
                                            );
                                          })}
                                        </List>
                                      </Box>
                                    )}
                                    
                                    {/* Show user uploaded documents (only if not already shown as completed required docs) */}
                                    {uniqueUserDocs.length > 0 && (
                                      <Box sx={{ mb: 2 }}>
                                        <List dense>
                                          {uniqueUserDocs.map((doc, index) => (
                                            <ListItem key={`user-doc-${index}-${doc.id}`}>
                                              <ListItemIcon>
                                                <CheckCircleIcon color="info" />
                                              </ListItemIcon>
                                              <ListItemText 
                                                primary={doc.value} 
                                                secondary={
                                                  <>
                                                    <strong>Process:</strong> {step.process_name || process.name}<br/>
                                                    <strong>Step:</strong> {step.title}<br/>
                                                    <strong>File:</strong> {doc.file_name}
                                                  </>
                                                }
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
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            No required steps found for this process.
                          </Typography>
                        )}
                      </Box>
                    )}
                  </StepContent>
                </Step>
              );
            })}
        </Stepper>
      </Box>
    </Paper>
  );
};

export default PathwayProgress;