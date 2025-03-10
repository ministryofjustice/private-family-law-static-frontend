import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PathwayProgress from '../components/PathwayProgress';
import GoBackButton from '../components/GoBackButton';

//There are comments here and hardcoded data set for Ayush to sort out :).

export default function Pathway() {
  const [pathwayData, setPathwayData] = useState(null);
  const [loadingPathway, setLoadingPathway] = useState(false);
  const [pathwayError, setPathwayError] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Get the case ID from URL params or use a dummy value
  const params = useParams();
  const caseId = params.caseId || "b432d15d-e04e-4e18-ba35-8eb0daf08ba9"; // Fallback to a dummy case ID

  const fetchPathwayStatus = useCallback(async () => {
    try {
      setLoadingPathway(true);
      //const response = await fetch(`http://localhost:8000/api/pathway/${caseId}/status`);

      //if (!response.ok) {
      //  throw new Error('Failed to fetch pathway status');
      //}

      //const data = await response.json();
      const data = {
        "overall_progress": {
          "completed": 0,
          "required": 2,
          "percentage": 0
        },
        "completed_documents": [],
        "pending_documents": [
          {
            "process_name": "Mediation",
            "process_key": "mediationProcess",
            "process_required": true,
            "step_id": "mediation_preparation",
            "step_title": "Mediation Preparation",
            "document_id": "mediation_process_started",
            "combined_document_id": "mediationProcess_mediation_process_started",
            "document_name": "Mediation Process Started",
            "document_description": "Official confirmation that mediation has begun",
            "required": true,
            "conditional": null,
            "status": "not_uploaded",
            "step_required": true
          },
          {
            "process_name": "Mediation",
            "process_key": "mediationProcess",
            "process_required": true,
            "step_id": "mediation_conclusion",
            "step_title": "Mediation Conclusion",
            "document_id": "completed_mediation_confirmation",
            "combined_document_id": "mediationProcess_completed_mediation_confirmation",
            "document_name": "Completed Mediation Confirmation",
            "document_description": "Official document confirming completion of mediation",
            "required": true,
            "conditional": null,
            "status": "not_uploaded",
            "step_required": true
          }
        ],
        "anomaly_documents": [],
        "step_progress": {
          "mediation_preparation": {
            "title": "Mediation Preparation",
            "description": "Preparation for initial mediation session",
            "completed_docs": 0,
            "required_docs": 1,
            "percentage": 0,
            "status": "Not Started",
            "required": true,
            "process_required": true
          },
          "mediation_conclusion": {
            "title": "Mediation Conclusion",
            "description": "Finalizing mediation outcomes",
            "completed_docs": 0,
            "required_docs": 1,
            "percentage": 0,
            "status": "Not Started",
            "required": true,
            "process_required": true
          }
        },
        "process_status": {
          "mediationProcess": {
            "name": "Mediation",
            "static_required": true,
            "dynamic_required": false,
            "required": true,
            "required_reason": "Static configuration",
            "completed_docs": 0,
            "required_docs": 2,
            "percentage": 0,
            "status": "Not Started"
          },
          "applicationProcess": {
            "name": "Application Submission Process",
            "static_required": false,
            "dynamic_required": false,
            "required": false,
            "required_reason": "Not required",
            "completed_docs": 0,
            "required_docs": 0,
            "percentage": 0,
            "status": "Not Started"
          },
          "caseSetUpProcess": {
            "name": "Case Setup Phase",
            "static_required": false,
            "dynamic_required": false,
            "required": false,
            "required_reason": "Not required",
            "completed_docs": 0,
            "required_docs": 0,
            "percentage": 0,
            "status": "Not Started"
          },
          "fhdraProcess": {
            "name": "First Hearing and Dispute Resolution Appointment (FHDRA) Phase",
            "static_required": false,
            "dynamic_required": false,
            "required": false,
            "required_reason": "Not required",
            "completed_docs": 0,
            "required_docs": 0,
            "percentage": 0,
            "status": "Not Started"
          }
        },
        "current_phase": "mediation_preparation",
        "next_phase": "mediation_conclusion",
        "completed_files": [],
        "has_completed_steps": false,
        "case_metadata": {
          "test": "test"
        }
      };
      setPathwayData(data);
    } catch (error) {
      console.error('Error fetching pathway status:', error);
      //setPathwayError(error.message);
      setPathwayError(false)
    } finally {
      setLoadingPathway(false);
    }
  }, [caseId]);

  // Fetch pathway data when component mounts or caseId changes
  useEffect(() => {
    if (caseId) {
      fetchPathwayStatus();
    }
  }, [caseId, fetchPathwayStatus]);

  return (
    <>
      <GoBackButton />
      <PathwayProgress
        pathwayData={pathwayData}
        loadingPathway={loadingPathway}
        pathwayError={pathwayError}
        setUploadDialogOpen={setUploadDialogOpen}
      />

      {/* You would also need to add your upload dialog component here */}
      {/* Example: 
      <UploadDialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)} 
        caseId={caseId}
        onUploadComplete={fetchPathwayStatus}
      /> */}
    </>
  );
}