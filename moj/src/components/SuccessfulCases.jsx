import * as React from 'react';
import './SuccessfulCases.css';
import { useEffect, useState } from 'react';

export default function SuccessfulCases({ caseId, caseSummary }) {
  const [similarCase, setSimilarCase] = useState(null);
  

  useEffect(() => {
    const fetchSimilarCaseData = async () => {
      console.log(caseId);
      try {
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
        const data = await response.json();
        console.log(data);
        setSimilarCase(data?.result);
      } catch (error) {
        console.error('Error fetching case data:', error);
      }
    };
    fetchSimilarCaseData();
  }, [caseId, caseSummary]);

  return (
    <div className="successfulCases">
      <h3>Successful cases like yours</h3>
      <p>{similarCase?.brief_overview || "No overview available"}​</p>

      <h4 className="mt-3 mb-2">Key Steps in Emma's Case:​</h4>
      <ul>
        {similarCase?.key_steps.map((fact, index) => (<li key={index}>{fact}</li>)) || (<li>No key facts available</li>)}
      </ul>

      <h4 className='mt-3 mb-2'>Outcome:​</h4>
      <p>{similarCase?.outcome || "No outcome available"}</p>
    </div>
  );
}