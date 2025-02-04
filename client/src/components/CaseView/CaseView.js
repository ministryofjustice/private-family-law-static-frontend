// src/components/CaseView/CaseView.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactMarkdown from 'react-markdown';
import SearchEvidence from '../Search/SearchEvidence';
import SearchHistory from '../Search/SearchHistory';
import EvidenceCatalogue from '../Evidence/EvidenceCatalogue';

const markdownStyles = {
  h2: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1976d2'
  },
  h3: {
    fontSize: '1.2rem',
    fontWeight: 500,
    marginTop: '1rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  strong: {
    fontWeight: 600,
    color: '#444'
  },
  p: {
    marginBottom: '1rem',
    lineHeight: 1.6
  },
  ul: {
    marginBottom: '1rem',
    paddingLeft: '2rem'
  },
  li: {
    marginBottom: '0.5rem'
  }
};

const MarkdownComponents = {
  h2: ({ children }) => (
    <Typography variant="h2" sx={markdownStyles.h2}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h3" sx={markdownStyles.h3}>
      {children}
    </Typography>
  ),
  strong: ({ children }) => (
    <Box component="strong" sx={markdownStyles.strong}>
      {children}
    </Box>
  ),
  p: ({ children }) => (
    <Typography variant="body1" sx={markdownStyles.p}>
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={markdownStyles.ul}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Box component="li" sx={markdownStyles.li}>
      {children}
    </Box>
  )
};

const CaseView = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  const fetchCase = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/cases/${caseNumber}`);
      if (!response.ok) {
        throw new Error('Case not found');
      }
      const data = await response.json();
      setCaseData(data.case);
    } catch (error) {
      console.error('Error fetching case:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [caseNumber]);

  const handleNewSearch = useCallback(() => {
    fetchCase();  // Refresh the case data to show new queries
  }, [fetchCase]);
  
  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'processing':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/reports')}
          sx={{ mt: 2 }}
        >
          Back to Reports
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/reports')}
          sx={{ mr: 2 }}
        >
          Back to Reports
        </Button>
        <Typography variant="h5" component="div">
          Case #{caseNumber}
        </Typography>
        <Chip 
          label={caseData.status} 
          color={getStatusColor(caseData.status)}
          size="small"
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Summary Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Case Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ 
          '& > :first-of-type': { mt: 0 },
          '& > :last-child': { mb: 0 }
        }}>
          <ReactMarkdown components={MarkdownComponents}>
            {caseData.case_summary || 'No summary available'}
          </ReactMarkdown>
        </Box>
      </Paper>

      {/* Evidence Catalogue */}
      <EvidenceCatalogue files={caseData.files} />

      <SearchHistory 
        queries={caseData.queries} 
        onQueryUpdate={fetchCase}
      />

      {/* Search Evidence Section */}
      <SearchEvidence 
        caseId={caseData._id}
        onNewSearch={handleNewSearch}
      />
    </Box>
  );
};

export default CaseView;