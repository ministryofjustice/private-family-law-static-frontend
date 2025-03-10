import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import GoBackButton from '../components/GoBackButton';
import SummaryCardActions from '../components/SummaryCardActions';
import SummaryCardDocuments from '../components/SummaryCardDocuments';
import CaseSummary from '../components/CaseSummary';
import SuccessfulCases from '../components/SuccessfulCases';
import VideoGallery from '../components/VideoGallery';
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
  const [pathwayError, setPathwayError] = useState(null); // Added missing state variable
  
  const { caseId } = useParams();
  const [value, setValue] = useState(0);
  const [caseData, setCaseData] = useState(null);
    
  const fetchPathwayStatus = useCallback(async () => {
    try {
      setLoadingPathway(true);
      const response = await fetch(`api/pathway/${caseId}/status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pathway status');
      }
      
      const data = await response.json();
      /**
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
      */
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
                  <SummaryCardDocuments caseFiles={caseData?.files}/>
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <CaseSummary />
                  <SuccessfulCases />
                  <VideoGallery stepId={pathwayData?.currentStep?.id || 'mediationProcess_mediation_preparation'} />
                  <CaseSummary caseSummary={caseData?.case_summary}/>
                  <SuccessfulCases caseSummary={caseData?.case_summary} caseId={caseId}/>
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                  <VerticalStepper 
                    pathwayData={pathwayData} 
                    loadingPathway={loadingPathway} 
                  />
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