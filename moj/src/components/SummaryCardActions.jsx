import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import './SummaryCardActions.css';

// Remove the overflow styling from cardContent
const styles = {
  cardContent: {
    // maxHeight is now removed from here
  }
};

export default function SummaryCardActions() {
  const { caseId } = useParams();
  const [pathwayData, setPathwayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define fetchPathwayStatus outside useEffect to match Dashboard pattern
  const fetchPathwayStatus = async () => {
    // Skip if we already have data for this case
    if (pathwayData && pathwayData.case_id === caseId) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/pathway/${caseId}/status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pathway status');
      }
      
      const data = await response.json();
      setPathwayData(data);
    } catch (error) {
      console.error('Error fetching pathway status:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Simplify the useEffect to match Dashboard pattern
  useEffect(() => {
    if (caseId) {
      fetchPathwayStatus();
    }
    // Only depend on caseId like in Dashboard
  }, [caseId]);

  // Calculate dates two weeks from now for pending tasks
  const getTwoWeeksFromNow = (index) => {
    const today = new Date();
    // Add 14 days for first pending task, 21 for second to space them out
    const daysToAdd = index === 0 ? 14 : 21;
    const futureDate = new Date(today.setDate(today.getDate() + daysToAdd));
    
    // Format the date as DD MMM YYYY
    return futureDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="summaryCardActions">
        <CardContent sx={styles.cardContent}>
          <h3>Actions</h3>
          <p>Loading actions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="summaryCardActions">
        <CardContent>
          <h3>Actions</h3>
          <p>Error loading actions: {error}</p>
        </CardContent>
      </Card>
    );
  }

  // Extract one completed document and two pending documents
  const completedDocument = pathwayData?.completed_documents?.[0];
  const pendingDocuments = pathwayData?.pending_documents?.slice(0, 2);

  return (
    <Card className="summaryCardActions">
      <CardContent sx={styles.cardContent}>
        <h3>Actions</h3>
        <ul className="actions-list">
          {completedDocument && (
            <li className="taskCompleted">
              <div>
                <span className="date">Completed</span>
                <span> : </span> 
                <span className="details">{completedDocument.document_name} - {completedDocument.document_description}</span>
              </div>
            </li>
          )}
          
          {pendingDocuments?.map((doc, index) => (
            <li key={doc.combined_document_id} className="taskNew">
              <div>
                <span className="date">{getTwoWeeksFromNow(index)}</span>
                <span> : </span> 
                <span className="details">{doc.document_name} - {doc.document_description}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}