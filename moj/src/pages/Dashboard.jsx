import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BetterOffDialog from '../components/BetterOffDialog';
import CalculateIcon from '@mui/icons-material/Calculate';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

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
        <Box sx={{ p: 0 }}>
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
  // Add these state variables to your VerticalTabs component
  const [betterOffDialog, setBetterOffDialog] = useState(false);
  const [betterOffForm, setBetterOffForm] = useState({
    input_dob_user: '',
    input_dob_partner: '',
    input_relationship_status: 'single',
    input_number_of_children: 0,
    input_childcare_costs: 0,
    input_placeholder_disability: 'no',
    input_housing_sector: 'tenure_nohousingcosts',
    input_receiving_benefits: '',
    input_postcode: '',
    input_wage_user_job1: 0,
    input_paymentcycle_user_job1: 'weekly',
    input_savings: 0
  });
  const [calculatingBetterOff, setCalculatingBetterOff] = useState(false);
  const [betterOffData, setBetterOffData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const { caseId } = useParams();
  const [value, setValue] = useState(0);
  const [caseData, setCaseData] = useState(null);
    
  const whiteTextFieldStyles = {
    '& .MuiInputLabel-root': {
      color: 'white', // Label color
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)', // Border color
      },
      '&:hover fieldset': {
        borderColor: 'white', // Hover border color
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white', // Focused border color
      },
    },
    '& .MuiInputBase-input': {
      color: 'white', // Text color
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.5)', // Another way to set border color
    },
  };

  const handleBetterOffInputChange = (e) => {
    const { name, value } = e.target;
    setBetterOffForm({
      ...betterOffForm,
      [name]: value
    });
  };
  
  const handleBetterOffSubmit = async () => {
    try {
      setCalculatingBetterOff(true);
      
      // Format the data exactly as shown in your working Swagger example
      const formData = {
        input_dob_user: betterOffForm.input_dob_user || "29/04/1996",
        input_dob_partner: betterOffForm.input_dob_partner || "",
        input_relationship_status: betterOffForm.input_relationship_status || "single",
        input_number_of_children: Number(betterOffForm.input_number_of_children || 0),
        input_childcare_costs: Number(betterOffForm.input_childcare_costs || 0),
        input_placeholder_disability: betterOffForm.input_placeholder_disability || "no",
        input_housing_sector: betterOffForm.input_housing_sector || "tenure_nohousingcosts",
        input_receiving_benefits: betterOffForm.input_receiving_benefits || "attendance_allowance",
        input_postcode: (betterOffForm.input_postcode || "").replace(/\s+/g, '').toLowerCase(),
        input_wage_user_job1: Number(betterOffForm.input_wage_user_job1 || 0),
        input_paymentcycle_user_job1: betterOffForm.input_paymentcycle_user_job1 || "weekly",
        input_savings: Number(betterOffForm.input_savings || 0)
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await fetch('/api/policy-in-practice/better-off-indicator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Complete API Response:", data);
      setBetterOffData(data);
      
      // Close the dialog after successful calculation
      setBetterOffDialog(false);
      
      setSnackbar({
        open: true,
        message: 'Better off calculation completed',
        severity: 'success'
      });
    } catch (error) {
      console.error('Better off calculation error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to calculate better off indicator',
        severity: 'error'
      });
    } finally {
      setCalculatingBetterOff(false);
    }
  };

  const InlineAdviceFinder = () => {
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [townOrPostcode, setTownOrPostcode] = useState('');
    const [adviceResults, setAdviceResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleButtonClick = (e) => {
      e.preventDefault(); // Prevent default form submission
      setShowForm(true);
    };
    
    const handleCancel = (e) => {
      e.preventDefault(); // Prevent default form submission
      setShowForm(false);
    };
    
    const handleSearch = (e) => {
      e.preventDefault(); // Prevent default form submission
      
      try {
        // Validate input
        if (!townOrPostcode || townOrPostcode.trim() === '') {
          setErrorMessage('Please enter a town or postcode');
          return;
        }
        
        setIsLoading(true);
        setErrorMessage('');
        
        // Mock data for testing
        const mockData = [
          {
            "ResultID": 249,
            "AgencyName": "Age UK - Wirral",
            "ServiceDescription": "Range of services for older people. Advice and information. Day care centre for mentally and physically frail older people.",
            "DistanceFromPostcode": 1.42644530277284
          },
          {
            "ResultID": 369,
            "AgencyName": "Sefton Carers Centre",
            "ServiceDescription": "Information, advice and practical support for carers. Services include advocacy, carers emergency card, flexible and emergency respite.",
            "DistanceFromPostcode": 3.99622119004096
          }
        ];
        
        // Skip API call for now and just use mock data
        setTimeout(() => {
          setAdviceResults(mockData);
          setHasSearched(true);
          setShowForm(false);
          setIsLoading(false);
        }, 500); // Simulate API delay
        
      } catch (error) {
        console.error("Error in search:", error);
        setErrorMessage('An unexpected error occurred during search.');
        setIsLoading(false);
      }
    };
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Advice Near You
        </Typography>
        <Typography variant="body1" paragraph>
          Find local support services and advice centers available in your area.
        </Typography>
        
        {!showForm && !hasSearched ? (
          <Button 
            variant="contained" 
            onClick={handleButtonClick}
            type="button" // Explicitly set type to button
          >
            Find Local Advice
          </Button>
        ) : null}
        
        {showForm && (
          <Box sx={{ mt: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Search Form
            </Typography>
            <TextField
              label="Town or Postcode"
              variant="outlined"
              fullWidth
              placeholder="e.g. CH44 5RP"
              value={townOrPostcode}
              onChange={(e) => setTownOrPostcode(e.target.value)}
              sx={{ mb: 2, ...whiteTextFieldStyles }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleCancel} type="button">
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSearch} 
                type="button"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </Box>
          </Box>
        )}
        
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {hasSearched && adviceResults.length === 0 && !isLoading && (
          <Alert severity="info" sx={{ mt: 3 }}>
            No advice services found in your area. Try increasing the search radius or try a different location.
          </Alert>
        )}
        
        {adviceResults.length > 0 && !isLoading && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Found {adviceResults.length} advice service{adviceResults.length !== 1 ? 's' : ''} near {townOrPostcode}
            </Typography>
            
            <Grid container spacing={3}>
              {adviceResults.map((result) => (
                <Grid item xs={12} md={6} key={result.ResultID || `result-${Math.random()}`}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {result.AgencyName || 'Unknown Agency'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {typeof result.DistanceFromPostcode === 'number' 
                      ? `${result.DistanceFromPostcode.toFixed(1)} miles away`
                      : 'Distance unknown'}
                  </Typography>
                  <Typography variant="body2">
                    {result.ServiceDescription || 'No description available'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setShowForm(true);
                  setHasSearched(false);
                }}
                type="button"
              >
                New Search
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const fetchPathwayStatus = useCallback(async () => {
    try {
      setLoadingPathway(true);
      console.log("case id = ", caseId);
      const response = await fetch(`/api/pathway/${caseId}/status`);
      console.log("response = ", response);
      if (!response.ok) {
        throw new Error('Failed to fetch pathway status');
      }
      
      const data = await response.json();
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

  // Safe rendering function for each tab
  const renderTab = (index) => {
    try {
      switch(index) {
        case 0:
          return (
            <>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <h2>Your case details</h2>
                  <p>Below, you'll find an overview of your journey, a summary of your case, similar successful cases, and any relevant videos, all analysed and generated by our AI system based on your uploaded file.</p>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {(() => {
                    try {
                      return <SummaryCardActions />;
                    } catch (error) {
                      console.error('Error rendering SummaryCardActions:', error);
                      return <div>Error loading actions</div>;
                    }
                  })()}
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  {(() => {
                    try {
                      return <SummaryCardDocuments caseFiles={caseData?.files}/>;
                    } catch (error) {
                      console.error('Error rendering SummaryCardDocuments:', error);
                      return <div>Error loading documents</div>;
                    }
                  })()}
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  {(() => {
                    try {
                      return <CaseSummary caseSummary={caseData?.case_summary}/>;
                    } catch (error) {
                      console.error('Error rendering CaseSummary:', error);
                      return <div>Error loading case summary</div>;
                    }
                  })()}
                  {(() => {
                    try {
                      return <SuccessfulCases caseSummary={caseData?.case_summary} caseId={caseId}/>;
                    } catch (error) {
                      console.error('Error rendering SuccessfulCases:', error);
                      return <div>Error loading successful cases</div>;
                    }
                  })()}
                  {(() => {
                    try {
                      return <VideoGallery stepId={pathwayData?.currentStep?.id || 'mediationProcess_mediation_preparation'} />;
                    } catch (error) {
                      console.error('Error rendering VideoGallery:', error);
                      return <div>Error loading video gallery</div>;
                    }
                  })()}
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
            </>
          );
          case 1:
            // Render AdviceFinder with proper error handling
            return <InlineAdviceFinder />;
            case 2:
              // Better Off Calculator tab
              return (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h4" gutterBottom>
                    Better Off Calculator
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Use Policy in Practice' calculator to estimate your benefits entitlement and see if you could be better off.
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={() => setBetterOffDialog(true)}
                  >
                    Open Better Off Calculator
                  </Button>
                  
                  {betterOffData && (
                    <Box sx={{ mt: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Your Results
                      </Typography>
                      <Typography variant="body1">
                        Based on your information, you may be entitled to approximately:
                      </Typography>
                      <Typography variant="h4" sx={{ my: 2, color: 'primary.main' }}>
                        £{(betterOffData.takehomeincome || betterOffData.totalEntitlement || 0).toFixed(2)} per week
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This is just an estimate. For a full assessment, please consult with a benefits advisor.
                      </Typography>
                      
                      {betterOffData.full_calc_link && (
                        <Button 
                          variant="outlined" 
                          href={betterOffData.full_calc_link}
                          target="_blank"
                          sx={{ mt: 2 }}
                        >
                          Get a full calculation
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              );
        default:
          return <div>Tab {index + 1} Content</div>;
      }
    } catch (error) {
      console.error(`Error rendering tab ${index}:`, error);
      return <div>Error loading content. Please try again.</div>;
    }
  
  };
  
  return (
    <>
      <GoBackButton />

      <Box sx={{ flexGrow: 1, display: 'flex' }}>
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
              <Tab 
                icon={<LocationOnIcon fontSize="small" />} 
                iconPosition="start"
                label="AdviceFinder" 
                {...tabsProps(1)} 
              />
              <Tab 
                icon={<CalculateIcon fontSize="small" />} 
                iconPosition="start"
                label="Better Off Calculator" 
                {...tabsProps(2)} 
              />
              <Tab label="Item Three" {...tabsProps(3)} />
              <Tab label="Item Four" {...tabsProps(4)} />
              <Tab label="Item Five" {...tabsProps(5)} />
              <Tab label="Item Six" {...tabsProps(6)} />
            </Tabs>
          </Grid>
          <Grid size={{ xs: 12, lg: 10 }}>
            <TabPanel className="tabPanel" value={value} index={0}>
              {value === 0 && renderTab(0)}
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={1}>
              {value === 1 && renderTab(1)}
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={2}>
              {value === 2 && renderTab(2)}
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={3}>
              {value === 3 && renderTab(3)}
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={4}>
              {value === 4 && renderTab(4)}
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={5}>
              {value === 5 && renderTab(5)}
            </TabPanel>
            <TabPanel className="tabPanel" value={value} index={6}>
              {value === 6 && renderTab(6)}
            </TabPanel>
          </Grid>
        </Grid>
      </Box>

      {/* Add the BetterOffDialog component */}
      <BetterOffDialog
        open={betterOffDialog}
        onClose={() => setBetterOffDialog(false)}
        betterOffForm={betterOffForm}
        handleBetterOffInputChange={handleBetterOffInputChange}
        handleBetterOffSubmit={handleBetterOffSubmit}
        calculatingBetterOff={calculatingBetterOff}
      />

      {/* Add Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
};