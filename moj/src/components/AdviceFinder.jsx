import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// A more functional version without using the external dialog
const AdviceFinder = () => {
  // States
  const [isSearching, setIsSearching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [townOrPostcode, setTownOrPostcode] = useState('');
  const [proximityOrder, setProximityOrder] = useState(10);
  const [adviceResults, setAdviceResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [testClicked, setTestClicked] = useState(false); // TEST STATE
  
  // Handle showing the search form
  const handleShowSearchForm = () => {
    try {
      setShowSearchForm(true);
    } catch (error) {
      console.error("Error showing search form:", error);
      setHasError(true);
      setErrorMessage('Could not display the search form.');
    }
  };
  
  // Simple test function
  const testButtonClick = () => {
    console.log("TEST BUTTON CLICKED");
    alert("Button clicked - if you see this, the button is working");
    setTestClicked(true);
  };
  
  // Handle search submission
  const handleSearch = async () => {
    console.log("SEARCH FUNCTION CALLED");
    testButtonClick(); // This will show an alert if the function is called
    
    try {
      // Validate input
      if (!townOrPostcode || townOrPostcode.trim() === '') {
        setErrorMessage('Please enter a town or postcode');
        return;
      }
      
      setIsSearching(true);
      setErrorMessage('');
      
      // Mock data for testing - this should always display if the function is reached
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
      setAdviceResults(mockData);
      setHasSearched(true);
      setShowSearchForm(false);
      setIsSearching(false);
      
    } catch (error) {
      console.error("Error in search:", error);
      setHasError(true);
      setErrorMessage('An unexpected error occurred during search.');
      setIsSearching(false);
    }
  };
  
  // Handle canceling search
  const handleCancelSearch = () => {
    setShowSearchForm(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Advice Near You {testClicked ? '(BUTTON WORKED!)' : ''}
      </Typography>
      <Typography variant="body1" paragraph>
        Find local support services and advice centers available in your area. Enter your town or postcode to discover resources that can help with your legal situation.
      </Typography>
      
      {!showSearchForm ? (
        <Button 
          variant="contained" 
          startIcon={<LocationOnIcon />}
          onClick={handleShowSearchForm}
        >
          Find Local Advice
        </Button>
      ) : (
        <Box sx={{ mt: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Search for Advice Services
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Town or Postcode"
              variant="outlined"
              fullWidth
              value={townOrPostcode}
              onChange={(e) => setTownOrPostcode(e.target.value)}
              placeholder="e.g. CH44 5RP"
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="proximity-label">Proximity (miles)</InputLabel>
              <Select
                labelId="proximity-label"
                value={proximityOrder}
                label="Proximity (miles)"
                onChange={(e) => setProximityOrder(e.target.value)}
              >
                <MenuItem value={1}>1 mile</MenuItem>
                <MenuItem value={5}>5 miles</MenuItem>
                <MenuItem value={10}>10 miles</MenuItem>
                <MenuItem value={25}>25 miles</MenuItem>
                <MenuItem value={50}>50 miles</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCancelSearch}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleSearch} // This should call our test function
              disabled={isSearching}
              startIcon={isSearching ? <CircularProgress size={20} /> : <LocationOnIcon />}
            >
              {isSearching ? 'Searching...' : 'Test Search'}
            </Button>
          </Box>
        </Box>
      )}
      
      {errorMessage && !hasError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
      
      {isSearching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {hasSearched && adviceResults.length === 0 && !isSearching && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No advice services found in your area. Try increasing the search radius or try a different location.
        </Alert>
      )}
      
      {adviceResults.length > 0 && !isSearching && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Found {adviceResults.length} advice service{adviceResults.length !== 1 ? 's' : ''} near {townOrPostcode || "TEST LOCATION"}
          </Typography>
          
          <Grid container spacing={3}>
            {adviceResults.map((result) => (
              <Grid item xs={12} md={6} key={result.ResultID || `result-${Math.random()}`}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Test Button outside the form for verification */}
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="outlined" 
          color="secondary"
          onClick={testButtonClick}
        >
          Test Button (Click Me)
        </Button>
      </Box>
    </Box>
  );
};

export default AdviceFinder;