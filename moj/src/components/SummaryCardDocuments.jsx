import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import './SummaryCardDocuments.css';

// Custom styles for this component
const styles = {
  cardContent: {
    maxHeight: '300px',
    overflow: 'auto'
  }
};

export default function SummaryCardDocuments({ caseFiles }) {
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

  return (
    <Card className="summaryCardDocuments">
      <CardContent sx={styles.cardContent}>
        <h3>Documents</h3>
        <ul>
          {caseFiles?.map((file, index) => (
            <li key={index}>
              <div className={getDocumentClass(file.storedName)}>
                <a href='#'>
                  {file.doc_title}
                </a>
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