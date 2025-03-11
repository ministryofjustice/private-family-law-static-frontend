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
  MenuItem,
  Slider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
    <Box>
      <Typography variant="h4" gutterBottom>
        Advice Near You
      </Typography>
      <Typography variant="body1" paragraph>
        Find local support services and advice centers available in your area. Enter your town or postcode to discover resources that can help with your legal situation.
      </Typography>
      
      {!showSearchForm && !hasSearched ? (
        <Button 
          variant="contained" 
          startIcon={<LocationOnIcon />}
          onClick={handleShowSearchForm}
        >
          Find Local Advice
        </Button>
      ) : null}
      
      {showSearchForm && (
        <Box sx={{ mt: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 1 }}>
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
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--white)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--white)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--white)',
                },
                '& input': {
                  color: 'var(--white)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--white)',
                '&.Mui-focused': {
                  color: 'var(--white)',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'var(--white)',
              },
            }}
          />
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Search radius (miles):
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Slider
              value={searchRadius}
              onChange={(e, newValue) => setSearchRadius(newValue)}
              min={1}
              max={50}
              step={1}
              valueLabelDisplay="auto"
              sx={{ mr: 2, flex: 1 }}
            />
            <Typography variant="body2">
              {searchRadius} miles
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={handleCancelSearch} type="button">
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSearch} 
              type="button"
              disabled={isSearching}
              startIcon={isSearching ? <CircularProgress size={20} /> : <LocationOnIcon />}
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
          <Typography variant="h6" gutterBottom>
            Found {adviceResults.length} advice service{adviceResults.length !== 1 ? 's' : ''} near {townOrPostcode}
          </Typography>
          
          <Grid container spacing={3}>
            {adviceResults.map((result) => (
              <Grid item xs={12} md={6} key={result.ResultID || `result-${Math.random()}`}>
                <Card sx={{ 
                  height: '100%', 
                  backgroundColor: 'var(--black)',
                  color: 'var(--white)',
                  border: '1px solid var(--dark-grey)'
                }}>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ color: 'var(--white) !important' }}>
                      {result.AgencyName || 'Unknown Agency'}
                    </Typography>
                    <Typography variant="body2" color="var(--white)" gutterBottom>
                      {typeof result.DistanceFromPostcode === 'number' 
                        ? `${result.DistanceFromPostcode.toFixed(1)} miles away`
                        : 'Distance unknown'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--white) !important' }}>
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