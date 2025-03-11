import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import GoBackButton from '../components/GoBackButton';
import SummaryCardActions from '../components/SummaryCardActions';
import SummaryCardDocuments from '../components/SummaryCardDocuments';
import CaseSummary from '../components/CaseSummary';
import SuccessfulCases from '../components/SuccessfulCases';
import RelevantVideos from '../components/RelevantVideos';
import VerticalStepper from '../components/VerticalStepper';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0,  }}>
          <div className="tabContent">{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function tabsProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [pathwayData, setPathwayData] = useState(null);
  const [loadingPathway, setLoadingPathway] = useState(false);
  const [pathwayError, setPathwayError] = useState(null);
  const [value, setValue] = React.useState(0);

  const caseId = 'a9af6f93-5036-4b59-bd3a-cfcc031e2662';
  const [caseData, setCaseData] = useState(null);

  const fetchPathwayStatus = useCallback(async () => {
    
    try {
      setLoadingPathway(true);
      
      //const response = await fetch(`/api/pathway/${caseId}/status`);
      //console.log("response = ", response);
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
      console.log("data = ", data);
      setPathwayData(data);
    } catch (error) {
      console.error('Error fetching pathway status:', error);
      setPathwayError(error.message);
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

  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await fetch(`/api/cases/${caseId}`);
        const data = await response.json();
        setCaseData(data?.case);
      } catch (error) {
        console.error('Error fetching case data:', error);
      }
    };

    fetchCaseData();
  }, [caseId]);

  return (
    <>
      <GoBackButton />

      <Box
        sx={{ flexGrow: 1, display: 'flex' }}
      >
        <Grid className="container" container spacing={0} size={{ xs: 12, md: 12, lg: 12 }}>
          <Grid size={{ xs: 12, lg: 2 }}>
            <Tabs className="supportTools"
              orientation="vertical"
              variant="standard"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="Case Summary" {...tabsProps(0)} />
              <Tab label="Item Two" {...tabsProps(1)} />
              <Tab label="Item Three" {...tabsProps(2)} />
              <Tab label="Item Four" {...tabsProps(3)} />
              <Tab label="Item Five" {...tabsProps(4)} />
              <Tab label="Item Six" {...tabsProps(5)} />
              <Tab label="Item Seven" {...tabsProps(6)} />
            </Tabs>
          </Grid>
          <Grid size={{ xs: 12, lg: 10 }}>
            <TabPanel className="tabPanel" value={value} index={0}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <h2>Your case details</h2>
                  <p>Below, you'll find an overview of your journey, a summary of your case, similar successful cases, and any relevant videos, all analysed and generated by our AI system based on your uploaded file.</p>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <SummaryCardActions />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <SummaryCardDocuments />
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <CaseSummary />
                  <SuccessfulCases />
                  <RelevantVideos />
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  {(() => {
                    try {
                      return <VerticalStepper 
                        pathwayData={pathwayData} 
                        loadingPathway={loadingPathway} 
                      />;
                    } catch (error) {
                      console.error('Error rendering VerticalStepper:', error);
                      return <div>Error loading pathway steps</div>;
                    }
                  })()}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={2}>
              Item Three
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={3}>
              Item Four
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={4}>
              Item Five
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={5}>
              Item Six
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={6}>
              Item Seven
            </TabPanel>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}