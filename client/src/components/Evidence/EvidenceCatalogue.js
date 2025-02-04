// src/components/Evidence/EvidenceCatalogue.jsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid
} from '@mui/material';
import EvidenceCard from './EvidenceCard';

const EvidenceCatalogue = ({ files = [] }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Catalogue of Evidence
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={3}>
        {files.map((file) => (
          <Grid item xs={12} md={6} key={file.storedName}>
            <EvidenceCard file={file} />
          </Grid>
        ))}
        {files.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              No files available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default EvidenceCatalogue;