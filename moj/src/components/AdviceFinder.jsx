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
  Slider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './AdviceFinder.css'; // Import the new CSS file

const AdviceFinder = ({ caseId }) => {
  // States
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [townOrPostcode, setTownOrPostcode] = useState('');
  const [searchRadius, setSearchRadius] = useState(10);
  const [adviceResults, setAdviceResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Handle showing the search form
  const handleShowSearchForm = () => {
    setShowSearchForm(true);
  };
  
  // Handle search submission
  const handleSearch = async () => {
    try {
      // Validate input
      if (!townOrPostcode || townOrPostcode.trim() === '') {
        setErrorMessage('Please enter a town or postcode');
        return;
      }
      
      setIsSearching(true);
      setErrorMessage('');
      
      // Make the actual API call
      const response = await fetch(`/api/advice-finder/get-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          townOrPostcode: townOrPostcode,
          proximityOrder: searchRadius // This is the search radius in miles
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch advice');
      }
      
      const data = await response.json();
      setAdviceResults(data);
      setHasSearched(true);
      setShowSearchForm(false);
      
    } catch (error) {
      console.error("Error in search:", error);
      setErrorMessage('An unexpected error occurred during search.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle canceling search
  const handleCancelSearch = () => {
    setShowSearchForm(false);
  };

  // Handle new search after results are shown
  const handleNewSearch = () => {
    setHasSearched(false);
    setShowSearchForm(true);
  };

  return (
    <Box className="advice-finder-container">
      <Typography variant="h4" gutterBottom>
        Advice Near You
      </Typography>
      <Typography variant="body1" paragraph>
        Find local support services and advice centers available in your area. Enter your town or postcode to discover resources that can help with your legal situation.
      </Typography>
      
      {!showSearchForm && !hasSearched ? (
        <Button 
          variant="outlined" 
          className="btn-upload"
          color="primary"
          startIcon={<LocationOnIcon />}
          onClick={handleShowSearchForm}
        >
          Find Local Advice
        </Button>
      ) : null}
      
      {showSearchForm && (
        <Box className="search-form">
          <Typography variant="h6" gutterBottom>
            Search for Advice Services
          </Typography>
          
          <TextField
            label="Town or Postcode"
            variant="outlined"
            fullWidth
            placeholder="e.g. EC3R 6DT"
            value={townOrPostcode}
            onChange={(e) => setTownOrPostcode(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Search radius (miles):
          </Typography>
          <Box className="slider-container">
            <Slider
              value={searchRadius}
              onChange={(e, newValue) => setSearchRadius(newValue)}
              min={1}
              max={50}
              step={1}
              valueLabelDisplay="auto"
              sx={{ mr: 2, flex: 1 }}
            />
            <Typography variant="body2" className="slider-value">
              {searchRadius} miles
            </Typography>
          </Box>
          
          <Box className="search-actions">
            <Button 
              variant="outlined" 
              className="btn-upload"
              color="primary"
              onClick={handleCancelSearch} type="button">
              Cancel
            </Button>
            <Button 
              variant="outlined" 
              className="btn-upload"
              color="primary" 
              onClick={handleSearch} 
              type="button"
              disabled={isSearching}
              startIcon={<LocationOnIcon />}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Box>
      )}
      
      {errorMessage && (
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
          <Typography variant="h6" className="results-header">
            Found {adviceResults.length} advice service{adviceResults.length !== 1 ? 's' : ''} near {townOrPostcode}
          </Typography>
          
          <Grid container spacing={3}>
            {adviceResults.map((result) => (
              <Grid item xs={12} md={6} key={result.ResultID || `result-${Math.random()}`}>
                <Card className="result-card">
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {result.AgencyName || 'Unknown Agency'}
                    </Typography>
                    <Typography variant="body2" className="result-distance" gutterBottom>
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
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={handleNewSearch}
              type="button"
              className="new-search-btn"
            >
              New Search
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AdviceFinder;