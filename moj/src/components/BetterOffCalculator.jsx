import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Link
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const BetterOffCalculator = ({ caseId }) => {
  // State to track the theme
  const [isLightTheme, setIsLightTheme] = useState(document.body.classList.contains('light-theme'));
  
  // Add a listener to detect theme changes
  useEffect(() => {
    const handleBodyClassChange = () => {
      setIsLightTheme(document.body.classList.contains('light-theme'));
    };

    // Create a MutationObserver to watch for class changes on the body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          handleBodyClassChange();
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { attributes: true });
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);

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

  // Define styles based on the current theme
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: isLightTheme ? 'var(--black)' : 'var(--white)',
      },
      '&:hover fieldset': {
        borderColor: isLightTheme ? 'var(--black)' : 'var(--white)',
      },
      '&.Mui-focused fieldset': {
        borderColor: isLightTheme ? 'var(--blue)' : 'var(--white)',
      },
      '& input': {
        color: isLightTheme ? 'var(--black)' : 'var(--white)',
      },
    },
    '& .MuiInputLabel-root': {
      color: isLightTheme ? 'var(--black)' : 'var(--white)',
      '&.Mui-focused': {
        color: isLightTheme ? 'var(--blue)' : 'var(--white)',
      },
    },
    '& .MuiFormHelperText-root': {
      color: isLightTheme ? 'var(--black)' : 'var(--white)',
    },
  };

  const selectStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: isLightTheme ? 'var(--black)' : 'var(--white)',
      },
      '&:hover fieldset': {
        borderColor: isLightTheme ? 'var(--black)' : 'var(--white)',
      },
      '&.Mui-focused fieldset': {
        borderColor: isLightTheme ? 'var(--blue)' : 'var(--white)',
      },
      '& .MuiSelect-select': {
        color: isLightTheme ? 'var(--black)' : 'var(--white)',
      },
      '& .MuiSvgIcon-root': {
        color: isLightTheme ? 'var(--black)' : 'var(--white)',
      },
    },
    '& .MuiInputLabel-root': {
      color: isLightTheme ? 'var(--black)' : 'var(--white)',
      '&.Mui-focused': {
        color: isLightTheme ? 'var(--blue)' : 'var(--white)',
      },
    },
  };

  const cardStyles = {
    backgroundColor: isLightTheme ? 'var(--white)' : 'var(--black)',
    color: isLightTheme ? 'var(--black)' : 'var(--white)',
    border: isLightTheme ? '1px solid var(--grey)' : '1px solid var(--dark-grey)'
  };

  const textColor = isLightTheme ? 'var(--black) !important' : 'var(--white) !important';

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
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
      
      // Create the base form data
      const formData = {
        input_dob_user: betterOffForm.input_dob_user || "",
        input_dob_partner: betterOffForm.input_dob_partner || "",
        input_relationship_status: betterOffForm.input_relationship_status || "single",
        input_number_of_children: Number(betterOffForm.input_number_of_children || 0),
        input_childcare_costs: Number(betterOffForm.input_childcare_costs || 0),
        input_placeholder_disability: betterOffForm.input_placeholder_disability || "no",
        input_housing_sector: betterOffForm.input_housing_sector || "tenure_nohousingcosts",
        input_postcode: (betterOffForm.input_postcode || "").replace(/\s+/g, '').toLowerCase(),
        input_wage_user_job1: Number(betterOffForm.input_wage_user_job1 || 0),
        input_paymentcycle_user_job1: betterOffForm.input_paymentcycle_user_job1 || "weekly",
        input_savings: Number(betterOffForm.input_savings || 0)
      };
      // Only add receiving_benefits if it's not "None"
      if (betterOffForm.input_receiving_benefits && betterOffForm.input_receiving_benefits !== "None") {
        formData.input_receiving_benefits = betterOffForm.input_receiving_benefits;
      }
    
      
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
      setBetterOffData(data);
      
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
  
  // Function to render the results based on new response structure
  const renderResults = () => {
    if (!betterOffData) return null;
    
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: textColor }}>
          Your Benefits Calculation Results
        </Typography>
        
        <Grid container spacing={3}>
          {/* Universal Credit Take Home Income */}
          <Grid item xs={12} md={6}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
                  Eligible Total
                </Typography>
                <Typography variant="h4" sx={{ color: 'var(--green) !important' }}>
                  £{(betterOffData.output_eligible_total_result + betterOffData.hb_sizecriteria_lha_entitled + 
                    betterOffData.cts_liability_postsingleperson).toFixed(2) || '0.00'} per month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Additional Details */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
                  Council Tax Details
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: textColor }}>
                    Council Tax Award:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: textColor }}>
                    £{betterOffData.council_tax_award_takehome?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ color: textColor }}>
                    Liability Post Single Person:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: textColor }}>
                    £{betterOffData.cts_liability_postsingleperson?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>          
          {/* Universal Credit calculation */}
          <Grid item xs={12} md={6}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
                  Universal Credit
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: textColor }}>
                    Universal Credit Allowance:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: textColor }}>
                    £{(betterOffData.universalcredit_takehomeincome - betterOffData.income_earnings_net).toFixed(2)} per month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
                  Housing Benefit
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: textColor }}>
                    Housing Entitlement:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: textColor }}>
                    £{betterOffData.hb_sizecriteria_lha_entitled?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
                  Eligibility Information
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: textColor }}>
                    Pensioner Household:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: textColor }}>
                    {betterOffData.isPensionerHousehold ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Full Calculator Link if needed */}
        {betterOffData.full_calc_needed && (
          <Box sx={{ mt: 4 }}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
                  Need More Detailed Calculations?
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: textColor }}>
                  For a more detailed breakdown of your benefits calculation, please visit the full Better Off Calculator.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  className="btn-upload"
                  endIcon={<OpenInNewIcon />}
                  component={Link}
                  href={betterOffData.full_calc_link || "https://betteroffcalculator.co.uk/"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Full Calculator
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
        
        {/* Reset button to calculate again */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary"
            className="btn-upload"
            onClick={() => setBetterOffData(null)} 
            size="large"
            sx={{ 
              color: isLightTheme ? 'var(--black)' : 'var(--white)', 
              borderColor: isLightTheme ? 'var(--black)' : 'var(--white)',
              '&:hover': {
                borderColor: isLightTheme ? 'var(--black)' : 'var(--white)',
                bgcolor: isLightTheme ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Calculate Again
          </Button>
        </Box>
      </Box>
    );
  };
  
  return (
    <Box className="BetterOffCalculator">
      <Typography variant="h4" gutterBottom sx={{ color: textColor }}>
        Better Off Calculator
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: textColor }}>
        Use Policy in Practice's calculator to estimate your benefits entitlement and see if you could be better off.
      </Typography>
      
      {!betterOffData && (
        <Card sx={{ ...cardStyles, mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
              Enter Your Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date of Birth (DD/MM/YYYY)"
                  name="input_dob_user"
                  value={betterOffForm.input_dob_user}
                  onChange={handleBetterOffInputChange}
                  placeholder="e.g. 29/04/1996"
                  fullWidth
                  margin="normal"
                  sx={textFieldStyles}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" sx={selectStyles}>
                  <InputLabel>Relationship Status</InputLabel>
                  <Select
                    name="input_relationship_status"
                    value={betterOffForm.input_relationship_status}
                    onChange={handleBetterOffInputChange}
                    label="Relationship Status"
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="couple">Couple</MenuItem>
                    <MenuItem value="married">Married</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Postcode"
                  name="input_postcode"
                  value={betterOffForm.input_postcode}
                  onChange={handleBetterOffInputChange}
                  fullWidth
                  margin="normal"
                  sx={textFieldStyles}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Your Household Net Income"
                  name="input_wage_user_job1"
                  type="number"
                  value={betterOffForm.input_wage_user_job1}
                  onChange={handleBetterOffInputChange}
                  fullWidth
                  margin="normal"
                  sx={textFieldStyles}
                  InputProps={{
                    startAdornment: <span 
                      style={{ marginRight: 8, color: isLightTheme ? 'var(--black)' : 'var(--white)' }}
                      className="currency-prefix"
                    >
                      £
                    </span>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" sx={selectStyles}>
                  <InputLabel>Your Payment Cycle</InputLabel>
                  <Select
                    name="input_paymentcycle_user_job1"
                    value={betterOffForm.input_paymentcycle_user_job1}
                    onChange={handleBetterOffInputChange}
                    label="Payment Cycle"
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="fortnightly">Fortnightly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="annual">Annually</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Number of Children"
                  name="input_number_of_children"
                  type="number"
                  value={betterOffForm.input_number_of_children}
                  onChange={handleBetterOffInputChange}
                  fullWidth
                  margin="normal"
                  sx={textFieldStyles}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Childcare Costs"
                  name="input_childcare_costs"
                  type="number"
                  value={betterOffForm.input_childcare_costs}
                  onChange={handleBetterOffInputChange}
                  fullWidth
                  margin="normal"
                  sx={textFieldStyles}
                  InputProps={{
                    startAdornment: <span 
                      style={{ marginRight: 8, color: isLightTheme ? 'var(--black)' : 'var(--white)' }}
                      className="currency-prefix"
                    >
                      £
                    </span>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" sx={selectStyles}>
                  <InputLabel>Housing Sector</InputLabel>
                  <Select
                    name="input_housing_sector"
                    value={betterOffForm.input_housing_sector}
                    onChange={handleBetterOffInputChange}
                    label="Housing Sector"
                  >
                    <MenuItem value="tenure_nohousingcosts">No Housing Costs</MenuItem>
                    <MenuItem value="tenure_socialrented">Social Rented</MenuItem>
                    <MenuItem value="tenure_privaterented">Private Rented</MenuItem>
                    <MenuItem value="tenure_owneroccupier">Owner Occupier</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" sx={selectStyles}>
                  <InputLabel>Currently Receiving Benefits</InputLabel>
                  <Select
                    name="input_receiving_benefits"
                    value={betterOffForm.input_receiving_benefits}
                    onChange={handleBetterOffInputChange}
                    label="Currently Receiving Benefits"
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="attendance_allowance">Attendance Allowance</MenuItem>
                    <MenuItem value="universal_credit">Universal Credit</MenuItem>
                    <MenuItem value="housing_benefit">Housing Benefit</MenuItem>
                    <MenuItem value="pip">Personal Independence Payment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Savings"
                  name="input_savings"
                  type="number"
                  value={betterOffForm.input_savings}
                  onChange={handleBetterOffInputChange}
                  fullWidth
                  margin="normal"
                  sx={textFieldStyles}
                  InputProps={{
                    startAdornment: <span 
                      style={{ marginRight: 8, color: isLightTheme ? 'var(--black)' : 'var(--white)' }}
                      className="currency-prefix"
                    >
                      £
                    </span>,
                  }}
                />
              </Grid>
              
              {betterOffForm.input_relationship_status !== 'single' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Partner's Date of Birth (DD/MM/YYYY)"
                    name="input_dob_partner"
                    value={betterOffForm.input_dob_partner}
                    onChange={handleBetterOffInputChange}
                    placeholder="e.g. 15/06/1994"
                    fullWidth
                    margin="normal"
                    sx={textFieldStyles}
                  />
                </Grid>
              )}
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" sx={selectStyles}>
                  <InputLabel>Disability Status</InputLabel>
                  <Select
                    name="input_placeholder_disability"
                    value={betterOffForm.input_placeholder_disability}
                    onChange={handleBetterOffInputChange}
                    label="Disability Status"
                  >
                    <MenuItem value="no">No</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined" 
                className="btn-upload"
                color="primary"
                onClick={handleBetterOffSubmit}
                disabled={calculatingBetterOff}
                startIcon={calculatingBetterOff ? <CircularProgress size={20} /> : <CalculateIcon />}
                size="large"
              >
                {calculatingBetterOff ? 'Calculating...' : 'Calculate Benefits'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {renderResults()}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{
            backgroundColor: isLightTheme ? 
              (snackbar.severity === 'success' ? 'var(--bgLightGreen)' : 
               snackbar.severity === 'error' ? 'var(--lightOrange)' : 'var(--white)') : 
              'var(--dark-grey)',
            color: isLightTheme ? 'var(--black)' : 'var(--white)',
            border: isLightTheme ? '1px solid var(--grey)' : 'none'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BetterOffCalculator;