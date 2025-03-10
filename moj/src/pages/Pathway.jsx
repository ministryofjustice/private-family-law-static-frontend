import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PathwayProgress from '../components/PathwayProgress';
import GoBackButton from '../components/GoBackButton';

export default function Pathway() {
  const [pathwayData, setPathwayData] = useState(null);
  const [loadingPathway, setLoadingPathway] = useState(true); // Start with loading=true
  const [pathwayError, setPathwayError] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Get the case ID from URL params
  const { caseId } = useParams();
  
  // Extract navigation state from location
  const location = useLocation();
  const { targetProcessKey, targetStepId, hasPathwayData } = location.state || {};
  
  // Log the state for debugging
  console.log("Pathway page received navigation state:", { 
    targetProcessKey, 
    targetStepId,
    hasPathwayData
  });

  // Check for data in sessionStorage first if coming from VerticalStepper
  useEffect(() => {
    if (hasPathwayData) {
      try {
        const savedData = sessionStorage.getItem('pathwayData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log("Retrieved pathway data from sessionStorage");
          setPathwayData(parsedData);
          setLoadingPathway(false);
          return; // Exit early, no need to fetch from API
        }
      } catch (e) {
        console.error("Error retrieving data from sessionStorage:", e);
      }
    }
    
    // If we couldn't get data from sessionStorage, proceed with API fetch
    if (caseId) {
      fetchPathwayStatus();
    } else {
      setLoadingPathway(false);
    }
  }, [hasPathwayData, caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPathwayStatus = useCallback(async () => {
    try {
      setLoadingPathway(true);
      console.log("Fetching pathway status for case:", caseId);
      const response = await fetch(`/api/pathway/${caseId}/status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pathway status');
      }
      
      const data = await response.json();
      console.log("Pathway data loaded successfully from API");
      setPathwayData(data);
    } catch (error) {
      console.error('Error fetching pathway status:', error);
      setPathwayError(error.message || 'Failed to load pathway data');
    } finally {
      setLoadingPathway(false);
    }
  }, [caseId]);

  return (
    <>
      <GoBackButton />
      <PathwayProgress
        pathwayData={pathwayData}
        loadingPathway={loadingPathway}
        pathwayError={pathwayError}
        setUploadDialogOpen={setUploadDialogOpen}
        targetProcessKey={targetProcessKey}
        targetStepId={targetStepId}
      />
    </>
  );
}