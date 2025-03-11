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
      //const response = await fetch(`/api/pathway/${caseId}/status`);
      
      //if (!response.ok) {
      //  throw new Error('Failed to fetch pathway status');
      //}
      
      //const data = await response.json();
      const data = {
        "overall_progress": {
          "completed": 1,
          "required": 4,
          "percentage": 25
        },
        "completed_documents": [
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
          }
        ],
        "pending_documents": [
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
          },
          {
            "process_name": "Application Submission Process",
            "process_key": "applicationProcess",
            "process_required": true,
            "step_id": "court_application",
            "step_title": "Court Application Preparation",
            "document_id": "c100_cover_letter",
            "combined_document_id": "applicationProcess_c100_cover_letter",
            "document_name": "C100 Cover Letter",
            "document_description": "Cover letter for court application",
            "required": true,
            "conditional": null,
            "status": "not_uploaded",
            "step_required": true
          },
          {
            "process_name": "Application Submission Process",
            "process_key": "applicationProcess",
            "process_required": true,
            "step_id": "application_submission",
            "step_title": "Application Submission",
            "document_id": "final_c100",
            "combined_document_id": "applicationProcess_final_c100",
            "document_name": "Final C100 Application",
            "document_description": "Completed C100 application ready for submission",
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
            "completed_docs": 1,
            "required_docs": 1,
            "percentage": 100,
            "status": "Complete",
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
          },
          "court_application": {
            "title": "Court Application Preparation",
            "description": "Preparation for court proceedings if ADR unsuccessful",
            "completed_docs": 0,
            "required_docs": 1,
            "percentage": 0,
            "status": "Not Started",
            "required": true,
            "process_required": true
          },
          "fee_processing": {
            "title": "Fee Processing",
            "description": "Payment of court fees for C100 application",
            "completed_docs": 0,
            "required_docs": 0,
            "percentage": 0,
            "status": "Not Started",
            "required": true,
            "process_required": true
          },
          "application_submission": {
            "title": "Application Submission",
            "description": "Formal submission of application to court",
            "completed_docs": 0,
            "required_docs": 1,
            "percentage": 0,
            "status": "Not Started",
            "required": true,
            "process_required": true
          },
          "mediation_process_started": {
            "title": "Official confirmation that mediation has begun",
            "description": "User uploaded documents for this step",
            "completed_docs": 0,
            "required_docs": 0,
            "percentage": 0,
            "status": "Not Started",
            "required": false,
            "process_required": false,
            "process_key": "mediationProcess",
            "process_name": "Mediation",
            "user_documents": [
              {
                "id": "mediationProcess_mediation_process_started",
                "value": "Official confirmation that mediation has begun",
                "file_name": "Mediation Process Started.docx",
                "file_id": "1741615304-7c3398d5-MediationProcessStarted.pdf",
                "process_key": "mediationProcess"
              }
            ]
          }
        },
        "process_status": {
          "mediationProcess": {
            "name": "Mediation",
            "static_required": true,
            "dynamic_required": false,
            "required": true,
            "required_reason": "Static configuration",
            "completed_docs": 1,
            "required_docs": 2,
            "percentage": 50,
            "status": "In Progress"
          },
          "applicationProcess": {
            "name": "Application Submission Process",
            "static_required": false,
            "dynamic_required": true,
            "required": true,
            "required_reason": "Not required",
            "completed_docs": 0,
            "required_docs": 2,
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
        "current_phase": "mediation_conclusion",
        "next_phase": null,
        "completed_files": [
          {
            "file_name": "Mediation Process Started.docx",
            "file_id": "1741615304-7c3398d5-MediationProcessStarted.pdf",
            "document_ids": [
              {
                "id": "mediationProcess_mediation_process_started",
                "value": "Official confirmation that mediation has begun"
              }
            ]
          }
        ],
        "has_completed_steps": true,
        "case_metadata": {
          "advice-codes": [
            {
              "code": "02FA",
              "value": "Families"
            },
            {
              "code": "02SA",
              "value": "Single parents"
            }
          ],
          "completed_steps": [
            {
              "file_name": "Mediation Process Started.docx",
              "file_id": "1741615304-7c3398d5-MediationProcessStarted.pdf",
              "steps": [
                {
                  "id": "mediationProcess_mediation_process_started",
                  "value": "Official confirmation that mediation has begun"
                }
              ]
            }
          ]
        }
      };
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