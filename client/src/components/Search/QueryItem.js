// src/components/Search/QueryItem.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  ListItem,
  IconButton,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReactMarkdown from 'react-markdown';

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

const QueryItem = ({ query, index, isLast }) => {
  const [vote, setVote] = useState(query.vote);

  const handleVote = async (isUpvote) => {
    const voteValue = isUpvote ? 1 : 0;
    try {
      const response = await fetch(`/api/cases/updateQueryVote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          traceId: query.trace_id,
          vote: voteValue
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vote');
      }

      setVote(voteValue);
    } catch (err) {
      console.error('Error updating vote:', err);
    }
  };

  return (
    <ListItem 
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottom: !isLast ? '1px solid #eee' : 'none',
        py: 2
      }}
    >
      <Box sx={{ 
        width: '100%', 
        mb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <Box>
          <Typography
            variant="subtitle2"
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            Query: {query.query}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', mb: 1 }}
          >
            {new Date(query.timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small"
            onClick={() => handleVote(true)}
            color={vote === 1 ? 'primary' : 'default'}
          >
            <ThumbUpIcon />
          </IconButton>
          <IconButton 
            size="small"
            onClick={() => handleVote(false)}
            color={vote === 0 ? 'error' : 'default'}
          >
            <ThumbDownIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ 
        width: '100%',
        '& > :first-of-type': { mt: 0 },
        '& > :last-child': { mb: 0 }
      }}>
        <ReactMarkdown components={MarkdownComponents}>
          {query.result}
        </ReactMarkdown>
      </Box>
    </ListItem>
  );
};

export default QueryItem;