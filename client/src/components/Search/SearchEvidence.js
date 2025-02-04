// src/components/Search/SearchEvidence.jsx

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchEvidence = ({ caseId, onNewSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Query the FastAPI endpoint
      const searchResponse = await fetch('http://localhost:8000/cases/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId,
          query: query.trim(),
        }),
      });

      if (!searchResponse.ok) {
        throw new Error('Search failed');
      }

      const searchResult = await searchResponse.json();
      // Save the query and result to MongoDB
      const saveResponse = await fetch('http://localhost:8000/cases/saveQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId,
          query: query.trim(),
          result: searchResult.result,
          traceId: searchResult.trace_id,
          timestamp: new Date().toISOString()
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save search result');
      }

      // Notify parent component to refresh queries
      if (onNewSearch) {
        onNewSearch();
      }

      setQuery('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Search Evidence
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
        >
          Search
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default SearchEvidence;