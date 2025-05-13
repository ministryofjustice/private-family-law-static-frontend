import React, { useState } from 'react';
import './CalculateBenefitsPage.css';

const CalculateBenefitsPage = () => {
  const [income, setIncome] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use Vite's environment variable
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/calculate-benefits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          income: parseFloat(income)
        })
      });
      
      const data = await response.json();
      setResult(data.eligible_benefits);
    } catch (error) {
      console.error('Error calculating benefits:', error);
      setResult(['Error connecting to API']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Calculate your benefits</h1>
        
        <form onSubmit={handleCalculate}>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="income">
              What is your monthly income?
            </label>
            <div id="income-hint" className="govuk-hint">
              Include wages, pensions and any other regular income
            </div>
            <div className="govuk-input__wrapper">
              <div className="govuk-input__prefix" aria-hidden="true">£</div>
              <input
                className="govuk-input govuk-input--width-5"
                id="income"
                name="income"
                type="number"
                aria-describedby="income-hint"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="govuk-button" 
            data-module="govuk-button"
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate benefits'}
          </button>
        </form>

        {result && (
          <div className="govuk-panel govuk-panel--confirmation">
            <h2 className="govuk-panel__title">
              You might be eligible for:
            </h2>
            <div className="govuk-panel__body">
              {result.length > 0 ? (
                <ul className="govuk-list govuk-list--bullet">
                  {result.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p>Based on the information provided, you may not be eligible for additional benefits.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculateBenefitsPage;