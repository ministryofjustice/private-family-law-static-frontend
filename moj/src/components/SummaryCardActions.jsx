import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import './SummaryCardActions.css';

export default function SummaryCardActions() {
  return (
    <Card className="summaryCardActions">
      <CardContent>
        <h3>Actions</h3>
        <ul>
          <li className="taskCompleted">
            <div>
              <span className="date">04 Jan 2025</span>
              <span> : </span> 
              <span className="details">Financial documents submitted</span>
            </div>
          </li>
          <li className="taskCompleted">
            <div>
              <span className="date">12 Feb 2025</span>
              <span> : </span> 
              <span className="details">Mediation appointment confirmed</span>
            </div>
          </li>
          <li className="taskNew">
            <div>
              <span className="date">TBC</span>
              <span> : </span> 
              <span className="details">Court hearing preparation meeting</span>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}