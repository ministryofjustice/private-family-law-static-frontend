import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PathwayProgress from '../components/PathwayProgress';
import GoBackButton from '../components/GoBackButton';

export default function Pathway() {
  const location = useLocation();
  const { pathwayData: routerPathwayData, targetProcessKey, targetStepId } = location.state || {};
  
  const [pathwayData, setPathwayData] = useState(routerPathwayData || null);
  const [loadingPathway, setLoadingPathway] = useState(!routerPathwayData);
  const [pathwayError, setPathwayError] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Get the case ID from URL params
  const { caseId } = useParams();

  // Only fetch from API if we don't have data from router state
  useEffect(() => {
    if (!routerPathwayData && caseId) {
      fetchPathwayStatus();
    }
  }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPathwayStatus = useCallback(async () => {
    try {
      setLoadingPathway(true);
      const response = await fetch(`/api/pathway/${caseId}/status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pathway status');
      }
      
      const data = await response.json();
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