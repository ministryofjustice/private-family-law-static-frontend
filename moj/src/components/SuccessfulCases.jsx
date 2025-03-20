import * as React from 'react';
import './SuccessfulCases.css';
import { useEffect, useState } from 'react';

export default function SuccessfulCases({ caseId, caseSummary }) {
  const [similarCase, setSimilarCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarCaseData = async () => {
      // Only fetch if we have both caseId and caseSummary
      if (!caseId || !caseSummary) {
        return; // Exit early if no summary exists
      }

      try {
        setLoading(true);
        const response = await fetch('/api/cases/get_similar_summaries', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            caseId: caseId,
            summary: caseSummary
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSimilarCase(data?.result);
      } catch (error) {
        console.error('Error fetching similar case data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSimilarCaseData();
  }, [caseId, caseSummary]);

  // If still loading
  if (loading) {
    return (
      <div className="successfulCases">
        <h3>Successful cases like yours</h3>
        <p>Finding similar cases...</p>
      </div>
    );
  }

  // If no summary exists yet
  if (!caseSummary) {
    return (
      <div className="successfulCases">
        <h3>Successful cases like yours</h3>
        <p>Similar cases will appear once your case summary is generated.</p>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="successfulCases">
        <h3>Successful cases like yours</h3>
        <p>Unable to load similar cases at this time.</p>
      </div>
    );
  }

  return (
    <div className="successfulCases">
      <h3>Successful cases like yours</h3>
      {similarCase ? (
        <>
          <p>{similarCase.brief_overview || "No overview available"}</p>

          <h4 className="mt-3 mb-2">Key Steps:</h4>
          <ul>
            {similarCase.key_steps && similarCase.key_steps.length > 0 
              ? similarCase.key_steps.map((fact, index) => <li key={index}>{fact}</li>) 
              : <li>No key steps available</li>}
          </ul>

          <h4 className='mt-3 mb-2'>Outcome:​</h4>
          <p>{similarCase.outcome || "No outcome available"}</p>
        </>
      ) : (
        <p>No similar cases found. Your case may be unique.</p>
      )}
    </div>
  );
}