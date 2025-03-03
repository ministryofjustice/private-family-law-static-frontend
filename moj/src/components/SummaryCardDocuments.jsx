import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import './SummaryCardDocuments.css';


export default function SummaryCardDocuments() {
  return (
    <Card className="summaryCardDocuments">
      <CardContent>
        <h3>Documents</h3>
        <ul>
          <li>
            <div className="pdfDocument">
              <a href="">Correspondence with Partner's Legal Representative</a>
            </div>
          </li>
          <li>
            <div className="wordDocument">
              <a href="">Evidence of Communication with Partner</a>
            </div>
          </li>
          <li>
            <div className="xlsDocument">
              <a href="">Financial documents​</a>
            </div>
          </li>
          <li>
            <div className="pdfDocument">
              <a href="">Property Ownership Documents​​</a>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}