// src/components/Search/SearchHistory.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Divider,
  List,
} from '@mui/material';
import QueryItem from './QueryItem';

const SearchHistory = ({ queries }) => {
  if (!queries || queries.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Previous Searches
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {queries.map((query, index) => (
          <QueryItem
            key={query._id || index}
            query={query}
            index={index}
            isLast={index === queries.length - 1}
          />
        ))}
      </List>
    </Paper>
  );
};

export default SearchHistory;