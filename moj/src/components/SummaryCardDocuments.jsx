import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import FolderIcon from '@mui/icons-material/Folder';
import Tooltip from '@mui/material/Tooltip';

import './SummaryCardDocuments.css';

// Custom styles for this component
const styles = {
  cardContent: {
    // Removed maxHeight and overflow from here
  },
  sortControl: {
    minWidth: 120,
    marginRight: '10px'
  },
  documentsList: {
    listStyleType: 'none'
  },
  documentItem: {
    transition: 'all 0.2s ease'
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--btnGreen)',
    padding: '0'
  },
  heading: {
    margin: 0,
    padding: '5px 20px'
  }
};


export default function SummaryCardDocuments({ caseFiles }) {
  const [sortBy, setSortBy] = useState('recent');
  
  const getDocumentClass = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch(extension) {
      case 'pdf':
        return 'pdfDocument';
      case 'doc':
      case 'docx':
        return 'docDocument';
      case 'xls':
      case 'xlsx':
        return 'xlsDocument';
      default:
        return 'docDocument';
    }
  };

  // Function to sort the caseFiles based on the selected option
  const getSortedFiles = () => {
    if (!caseFiles || caseFiles.length === 0) {
      return [];
    }
    
    const filesCopy = [...caseFiles];
    
    switch(sortBy) {
      case 'recent':
        // Sort by uploadDate property which exists in the caseFiles data
        return filesCopy.sort((a, b) => {
          return new Date(b.uploadDate) - new Date(a.uploadDate); // Sort in descending order (newest first)
        });
      case 'alphabetical':
        return filesCopy.sort((a, b) => 
          a.doc_title.localeCompare(b.doc_title)
        );
      case 'fileType':
        return filesCopy.sort((a, b) => 
          a.storedName.split('.').pop().localeCompare(b.storedName.split('.').pop())
        );
      default:
        // Most recent is now the default sorting method
        return filesCopy.sort((a, b) => {
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        });
    }
  };
  
  const sortedFiles = getSortedFiles();

  return (
    <Card className="summaryCardDocuments">
      <CardContent sx={styles.cardContent}>
        <Box sx={styles.headerContainer}>
          <h3 style={styles.heading}>Documents</h3>
          <FormControl size="small" sx={styles.sortControl} variant="standard">
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ 
                color: 'var(--white)',
                '.MuiSelect-icon': {
                  color: 'var(--white)',
                },
              }}
              disableUnderline
            >

              <MenuItem value="recent">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1 }} fontSize="small" />
                  Most Recent
                </Box>
              </MenuItem>
              <MenuItem value="alphabetical">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SortByAlphaIcon sx={{ mr: 1 }} fontSize="small" />
                  Alphabetical
                </Box>
              </MenuItem>
              <MenuItem value="fileType">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FolderIcon sx={{ mr: 1 }} fontSize="small" />
                  File Type
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ul className="documents-list" style={styles.documentsList}>
          {sortedFiles.map((file, index) => (
            <li key={index} style={styles.documentItem}>
              <div className={getDocumentClass(file.storedName)}>
                <Tooltip 
                  title={`Uploaded: ${new Date(file.uploadDate).toLocaleString()}`} 
                  placement="top"
                >
                  <a href='#'>
                    {file.doc_title}
                    <small style={{ display: 'block', color: '#666', marginTop: '2px' }}>
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </small>
                  </a>
                </Tooltip>
              </div>
            </li>
          ))}
          {!caseFiles || caseFiles.length === 0 ? (
            <li>
              <div className="docDocument">
                <span>No documents available</span>
              </div>
            </li>
          ) : null}
        </ul>
      </CardContent>
    </Card>
  );
}