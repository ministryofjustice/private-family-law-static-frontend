import React, { useEffect } from 'react';
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

const PathwayProgress = ({ 
  pathwayData, 
  loadingPathway, 
  pathwayError, 
  setUploadDialogOpen,
  targetProcessKey, // New prop to accept a specific process to display
  targetStepId      // New prop to highlight a specific step
}) => {
  useEffect(() => {
    if (pathwayData) {
      console.log("=== PATHWAY PROGRESS DEBUG ===");
      console.log("Target Process Key:", targetProcessKey);
      console.log("Target Step ID:", targetStepId);
      console.log("Current Phase from API:", pathwayData.current_phase);
      
      // Log all processes
      console.log("All Processes:", Object.entries(pathwayData.process_status).map(([key, process]) => ({
        key,
        name: process.name,
        status: process.status,
        percentage: process.percentage
      })));
      
      // Log all steps
      console.log("All Steps:", Object.entries(pathwayData.step_progress).map(([key, step]) => ({
        key,
        title: step.title,
        status: step.status,
        percentage: step.percentage,
        process_key: step.process_key,
      })));
      
      // Log document mappings between steps and processes
      console.log("Document mappings:", {
        completed: pathwayData.completed_documents.map(doc => ({
          step_id: doc.step_id,
          process_key: doc.process_key
        })),
        pending: pathwayData.pending_documents.map(doc => ({
          step_id: doc.step_id,
          process_key: doc.process_key
        }))
      });
    }
  }, [pathwayData, targetProcessKey, targetStepId]);

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
    
    console.log(`Steps found for process ${processKey}:`, uniqueStepIds);
    
    // Map step IDs to step objects
    return uniqueStepIds
      .map(stepId => ({
        key: stepId,
        ...pathwayData.step_progress[stepId]
      }))
      .filter(step => step.title); // Make sure the step exists
  };

  // Find the active process to display
  const getActiveProcess = () => {
    console.log("getActiveProcess() called with targetProcessKey:", targetProcessKey);
    
    // First priority: If targetProcessKey is provided (from button click), use that
    if (targetProcessKey && pathwayData.process_status[targetProcessKey]) {
      console.log("Using targetProcessKey:", targetProcessKey);
      return [targetProcessKey, pathwayData.process_status[targetProcessKey]];
    }
    
    // Second priority: If there's a current_phase in the pathway data, find its process
    if (pathwayData.current_phase) {
      console.log("Looking for process containing current_phase:", pathwayData.current_phase);
      
      // Find all documents for the current phase step
      const docsForCurrentPhase = [
        ...pathwayData.completed_documents,
        ...pathwayData.pending_documents
      ].filter(doc => doc.step_id === pathwayData.current_phase);
      
      console.log("Documents found for current_phase:", docsForCurrentPhase);
      
      // If we found documents, use their process
      if (docsForCurrentPhase.length > 0) {
        const processKey = docsForCurrentPhase[0].process_key;
        console.log("Using process from current_phase docs:", processKey);
        return [processKey, pathwayData.process_status[processKey]];
      }
      
      // Backup: search for the process containing the current phase as a step
      const processWithCurrentPhase = Object.entries(pathwayData.process_status)
        .find(([processKey, _]) => {
          // Find all step IDs for this process
          const stepIds = [
            ...pathwayData.completed_documents
              .filter(doc => doc.process_key === processKey)
              .map(doc => doc.step_id),
            ...pathwayData.pending_documents
              .filter(doc => doc.process_key === processKey)
              .map(doc => doc.step_id)
          ];
          
          // Check if any of these step IDs match the current_phase
          const result = [...new Set(stepIds)].includes(pathwayData.current_phase);
          console.log(`Process ${processKey} contains current_phase:`, result);
          return result;
        });
      
      if (processWithCurrentPhase) {
        console.log("Using process from step match:", processWithCurrentPhase[0]);
        return processWithCurrentPhase;
      }
    }
    
    // Third priority: Find a process that's explicitly "In Progress"
    const inProgressProcess = Object.entries(pathwayData.process_status)
      .filter(([_, process]) => process.required === true)
      .find(([_, process]) => process.status === "In Progress");
    
    if (inProgressProcess) {
      console.log("Using first In Progress process:", inProgressProcess[0]);
      return inProgressProcess;
    }
    
    // Fourth priority: Find the first required process that's not complete
    const requiredProcess = Object.entries(pathwayData.process_status)
      .filter(([_, process]) => process.required === true && process.status !== "Complete")
      .sort((a, b) => b[1].percentage - a[1].percentage)[0];
    
    if (requiredProcess) {
      console.log("Using first required process that's not complete:", requiredProcess[0]);
      return requiredProcess;
    }
    
    // Last resort: Return the first process
    const firstProcess = Object.entries(pathwayData.process_status)[0] ||
      ["default", { name: "Case Progress" }];
    console.log("Using first process as fallback:", firstProcess[0]);
    return firstProcess;
  };

  // Get the current active process
  const currentProcess = getActiveProcess();
  const [currentProcessKey, currentProcessData] = currentProcess;
  
  console.log("Selected process to display:", currentProcessKey, currentProcessData?.name);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'var(--lightOrange)' }} className="verticalStepper">
      {/* Process title as main header */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        {currentProcessData.name}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box>
        {/* MODIFIED: Only show the selected process instead of all incomplete processes */}
        {(() => {
          // Get the process to display
          const processKey = currentProcessKey;
          const process = pathwayData.process_status[processKey];
          
          if (!process) {
            console.error(`Process ${processKey} not found in data!`);
            return (
              <Alert severity="info" sx={{ mb: 2 }}>
                No process information available.
              </Alert>
            );
          }
          
          const isInProgress = process.status === "In Progress";
          const stepsForProcess = getStepsForProcess(processKey);
          
          console.log(`Rendering process ${processKey} with ${stepsForProcess.length} steps`);
          console.log("Target step ID to highlight:", targetStepId);
          
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
                      // Determine if this is the current step by either:
                      // 1. Matching the targetStepId (from user action)
                      // 2. Matching the current_phase from API
                      const isCurrentStep = (targetStepId && step.key === targetStepId) || 
                                           (!targetStepId && step.key === pathwayData.current_phase);
                      
                      console.log(`Rendering step ${step.key}:`, {
                        title: step.title,
                        completed: stepCompleted,
                        isCurrentStep,
                        completedDocs: completedDocs.length,
                        pendingDocs: pendingDocs.length
                      });
                      
                      return (
                        <Step key={step.key} active={!stepCompleted || isCurrentStep} completed={stepCompleted}>
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
                                {isCurrentStep && (
                                  <Chip
                                    size="small"
                                    label="Current Phase"
                                    color="secondary"
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
        })()}
        
        {/* If the selected process is completed, show a message */}
        {pathwayData.process_status[currentProcessKey]?.status === "Complete" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            This process has been completed.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default PathwayProgress;