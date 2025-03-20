import * as React from 'react';
import './CaseSummary.css';

export default function CaseSummary({ caseSummary }) {
  const renderObjectAsKeyValue = (obj) => {
    if (!obj) return null;
    
    const renderValue = (value) => {
      // Skip if value is "Unknown"
      if (value === "Unknown") return null;
  
      // Handle arrays
      if (Array.isArray(value)) {
        // Filter out "Unknown" values from arrays
        const filteredArray = value.filter(item => item !== "Unknown");
        if (filteredArray.length === 0) return null;
        
        // If only one element, just indent it
        if (filteredArray.length === 1) {
          if (typeof filteredArray[0] === 'object' && filteredArray[0] !== null) {
            const rendered = renderObjectAsKeyValue(filteredArray[0]);
            return rendered ? (
              <div style={{ marginLeft: '20px' }}>
                {rendered}
              </div>
            ) : null;
          }
          return (
            <div style={{ marginLeft: '20px' }}>
              {filteredArray[0]}
            </div>
          );
        }
  
        // If array contains objects, render each object
        if (typeof filteredArray[0] === 'object' && filteredArray[0] !== null) {
          const renderedItems = filteredArray.map((item, index) => {
            const rendered = renderObjectAsKeyValue(item);
            return rendered ? (
              <div key={index} style={{ marginLeft: '20px' }}>
                • {rendered}
              </div>
            ) : null;
          }).filter(Boolean);
          
          return renderedItems.length > 0 ? renderedItems : null;
        }
        // If array contains multiple strings/numbers, render as bullet points
        return (
          <div>
            {filteredArray.map((item, index) => (
              <div key={index} style={{ marginLeft: '20px' }}>
                • {item}
              </div>
            ))}
          </div>
        );
      }
      
      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        const rendered = renderObjectAsKeyValue(value);
        return rendered ? (
          <div style={{ marginLeft: '20px' }}>
            {rendered}
          </div>
        ) : null;
      }
      
      // Return simple values as is
      return value;
    };
  
    const entries = Object.entries(obj)
      .map(([key, value]) => {
        const renderedValue = renderValue(value);
        if (!renderedValue) return null;
  
        // Convert key from snake_case to Title Case
        const formattedKey = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
  
        return (
          <div key={key} className="key-value-pair">
            <span className="key">{formattedKey}:</span> {renderedValue}
          </div>
        );
      })
      .filter(Boolean); // Remove null entries
  
    return entries.length > 0 ? entries : null;
  };

  return (
    <div className="caseSummaryWrapper">
      <div className="caseSummary">
      <h3 className="mt-4">Your case summary</h3>
      
      <div className="caseTitle">
        <h4 className='mt-3 mb-1'>Title</h4>
        <div className="summary-item">
          {caseSummary?.title.case_name !== 'Unknown' && (
            <>
              <span className="title">Case Name:</span>
              <span>{caseSummary?.title.case_name}</span>
            </>
          )}
        </div>
        <div className="summary-item">
          {caseSummary?.title.citation !== 'Unknown' && (
            <>
              <span className="title">Citation:</span>
              <span>{caseSummary?.title.citation}</span>
            </>
          )}
        </div>
      </div>

      <div className="caseIntroduction">
        <h4 className='mt-3 mb-1'>Introduction</h4>
        <div className="summary-item">
          <span className="title">Background:</span>
          <div className="value-container">{renderObjectAsKeyValue(caseSummary?.introduction.background) || "No background available"}</div>
        </div>
        <div className="summary-item">
          <span className="title">Parties Involved: </span>
          <div className="value-container">{renderObjectAsKeyValue(caseSummary?.introduction.parties_involved) || "No parties information available"}</div>
        </div>
      </div>

      <div className="caseKeyFacts">
        <h4 className='mt-3 mb-1'>Key Facts</h4>
        <div className="summary-item">
          <span className="title">Situation Overview:</span>
          <div className="value-container">{renderObjectAsKeyValue(caseSummary?.key_facts.situation_overview) || "No situation overview available"}</div>
        </div>
        <div className="summary-item">
          <span className="title">Relevant Details:</span>
          <div className="value-container">{renderObjectAsKeyValue(caseSummary?.key_facts.relevant_details) || "No relevant details available"}</div>
        </div>
      </div>

      <div className="caseLegalIssues">
        <h4 className='mt-3 mb-1'>Legal Issues</h4>
        <div className="summary-item">
          <span className="title">Questions at Hand:</span>
          <div className="value-container">{renderObjectAsKeyValue(caseSummary?.legal_issues.questions_at_hand) || "No legal issues available"}</div>
        </div>
      </div>

      {renderObjectAsKeyValue(caseSummary?.arguments_presented.plaintiff_arguments) && (
        <div className="caseArgumentsPresented">
          <h4 className='mt-3 mb-1'>Arguments presented</h4>
          <div className="summary-item">
            <span className="title">Plaintiff's Arguments:</span>
            <div className="value-container">{renderObjectAsKeyValue(caseSummary?.arguments_presented.plaintiff_arguments)}</div>
          </div>
          {renderObjectAsKeyValue(caseSummary?.arguments_presented.defendant_arguments) && (
            <div className="summary-item">
              <span className="title">Defendant's Arguments:</span>
              <div className="value-container">{renderObjectAsKeyValue(caseSummary?.arguments_presented.defendant_arguments)}</div>
            </div>
          )}
        </div>
      )}

      {renderObjectAsKeyValue(caseSummary?.decision_and_rationale.court_decision) && (
        <div className="caseDecisionAndRationale">
          <h4 className='mt-3 mb-1'>Decision and Rationale</h4>
          <div className="summary-item">
            <span className="title">Court's Decision:</span>
            <div className="value-container">{renderObjectAsKeyValue(caseSummary?.decision_and_rationale.court_decision)}</div>
          </div>
          <div className="summary-item">
            <span className="title">Legal Reasoning:</span>
            <div className="value-container">{renderObjectAsKeyValue(caseSummary?.decision_and_rationale.legal_reasoning) || "No legal reasoning available"}</div>
          </div>
        </div>
      )}

      <div className="caseSignificance">
        <h4 className='mt-3 mb-1'>Significance of the Case</h4>
        <div className="summary-item">
          <span className="title">Implications:</span>
          <div className="value-container">{renderObjectAsKeyValue(caseSummary?.significance.implications) || "No implications available"}</div>
        </div>
        {renderObjectAsKeyValue(caseSummary?.significance.precedent_set) && (
          <div className="summary-item">
            <span className="title">Precedents Set:</span>
            <div className="value-container">{renderObjectAsKeyValue(caseSummary?.significance.precedent_set)}</div>
          </div>
        )}
      </div>

      <div className="caseConclusion">
        <h4 className='mt-3 mb-1'>Summary of your case so far</h4>
        <div className="summary-item">
          <div className="value-container">{renderObjectAsKeyValue(caseSummary?.conclusion.summary) || "No summary available"}</div>
        </div>
      </div>

      {renderObjectAsKeyValue(caseSummary?.references) && (
        <div className="caseReferences">
          <h4 className='mt-3 mb-1'>References</h4>
          <div className="summary-item">
            <span className="title">Sources:</span>
            <div className="value-container">{renderObjectAsKeyValue(caseSummary?.references)}</div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};