import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculateBenefitsPage.css';

const CalculateBenefits = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    input_dob_user: '',
    input_dob_partner: '',
    input_relationship_status: 'single',
    input_number_of_children: 0,
    input_childcare_costs: 0,
    input_placeholder_disability: 'no',
    input_housing_sector: 'tenure_nohousingcosts',
    input_receiving_benefits: 'attendance_allowance',
    input_postcode: '',
    input_wage_user_job1: '',
    input_paymentcycle_user_job1: 'weekly',
    input_savings: ''
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/policy-in-practice/better-off-indicator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate benefits');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <div className="govuk-width-container">
      <button 
        className="govuk-back-link" 
        onClick={handleBack}
      >
        Back
      </button>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">
            Calculate benefits
          </h1>

          <p className="govuk-body">
            Use this calculator to find out what benefits you may be entitled to 
            and get an estimate of your total take-home income.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <h2 className="govuk-heading-m">Personal information</h2>
            
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_dob_user">
                Your date of birth
              </label>
              <div className="govuk-hint">
                For example, 29/04/1996
              </div>
              <input
                className="govuk-input govuk-input--width-10"
                id="input_dob_user"
                name="input_dob_user"
                type="text"
                value={formData.input_dob_user}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_dob_partner">
                Partner's date of birth (if applicable)
              </label>
              <div className="govuk-hint">
                Leave blank if not applicable
              </div>
              <input
                className="govuk-input govuk-input--width-10"
                id="input_dob_partner"
                name="input_dob_partner"
                type="text"
                value={formData.input_dob_partner}
                onChange={handleInputChange}
              />
            </div>

            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_relationship_status">
                Relationship status
              </label>
              <select
                className="govuk-select"
                id="input_relationship_status"
                name="input_relationship_status"
                value={formData.input_relationship_status}
                onChange={handleInputChange}
              >
                <option value="single">Single</option>
                <option value="couple">Couple</option>
                <option value="married">Married</option>
                <option value="civil_partnership">Civil Partnership</option>
              </select>
            </div>

            {/* Children Section */}
            <h2 className="govuk-heading-m">Children</h2>
            
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_number_of_children">
                Number of children
              </label>
              <input
                className="govuk-input govuk-input--width-3"
                id="input_number_of_children"
                name="input_number_of_children"
                type="number"
                min="0"
                value={formData.input_number_of_children}
                onChange={handleNumberInputChange}
              />
            </div>

            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_childcare_costs">
                Childcare costs (£ per week)
              </label>
              <div className="govuk-hint">
                Enter 0 if not applicable
              </div>
              <input
                className="govuk-input govuk-input--width-10"
                id="input_childcare_costs"
                name="input_childcare_costs"
                type="number"
                min="0"
                value={formData.input_childcare_costs}
                onChange={handleNumberInputChange}
              />
            </div>

            {/* Disability and Housing Section */}
            <h2 className="govuk-heading-m">Disability and housing</h2>
            
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_placeholder_disability">
                Do you or your partner have a disability?
              </label>
              <select
                className="govuk-select"
                id="input_placeholder_disability"
                name="input_placeholder_disability"
                value={formData.input_placeholder_disability}
                onChange={handleInputChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_housing_sector">
                Housing sector
              </label>
              <select
                className="govuk-select"
                id="input_housing_sector"
                name="input_housing_sector"
                value={formData.input_housing_sector}
                onChange={handleInputChange}
              >
                <option value="tenure_nohousingcosts">No housing costs</option>
                <option value="tenure_private">Private rental</option>
                <option value="tenure_social">Social housing</option>
                <option value="tenure_owner">Owner occupier</option>
              </select>
            </div>

            {/* Benefits Section */}
            <h2 className="govuk-heading-m">Benefits</h2>
            
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_receiving_benefits">
                Benefits currently receiving
              </label>
              <select
                className="govuk-select"
                id="input_receiving_benefits"
                name="input_receiving_benefits"
                value={formData.input_receiving_benefits}
                onChange={handleInputChange}
              >
                <option value="attendance_allowance">Attendance Allowance</option>
                <option value="pip">Personal Independence Payment</option>
                <option value="dla">Disability Living Allowance</option>
                <option value="carers_allowance">Carer's Allowance</option>
                <option value="universal_credit">Universal Credit</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Location and Income Section */}
            <h2 className="govuk-heading-m">Location and income</h2>
            
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_postcode">
                Postcode
              </label>
              <input
                className="govuk-input govuk-input--width-10"
                id="input_postcode"
                name="input_postcode"
                type="text"
                value={formData.input_postcode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_wage_user_job1">
                Your income (£)
              </label>
              <input
                className="govuk-input govuk-input--width-10"
                id="input_wage_user_job1"
                name="input_wage_user_job1"
                type="number"
                min="0"
                value={formData.input_wage_user_job1}
                onChange={handleNumberInputChange}
                required
              />
            </div>

            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_paymentcycle_user_job1">
                Payment cycle
              </label>
              <select
                className="govuk-select"
                id="input_paymentcycle_user_job1"
                name="input_paymentcycle_user_job1"
                value={formData.input_paymentcycle_user_job1}
                onChange={handleInputChange}
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annually</option>
              </select>
            </div>

            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="input_savings">
                Savings (£)
              </label>
              <div className="govuk-hint">
                Enter 0 if none
              </div>
              <input
                className="govuk-input govuk-input--width-10"
                id="input_savings"
                name="input_savings"
                type="number"
                min="0"
                value={formData.input_savings}
                onChange={handleNumberInputChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="govuk-button"
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate benefits'}
            </button>
          </form>

          {error && (
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert">
              <h2 className="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h2>
              <div className="govuk-error-summary__body">
                <p className="govuk-error-message">
                  {error}
                </p>
              </div>
            </div>
          )}

          {results && (
            <div className="govuk-panel govuk-panel--confirmation govuk-!-margin-top-8">
              <h2 className="govuk-panel__title">
                Calculation complete
              </h2>
              <div className="govuk-panel__body">
                <h3 className="govuk-heading-m">Your results</h3>
                
                <dl className="govuk-summary-list">
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">
                      Take-home income
                    </dt>
                    <dd className="govuk-summary-list__value">
                      {formatCurrency(results.takehomeincome)}
                    </dd>
                  </div>
                  
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">
                      Universal Credit take-home income
                    </dt>
                    <dd className="govuk-summary-list__value">
                      {formatCurrency(results.universalcredit_takehomeincome)}
                    </dd>
                  </div>
                  
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">
                      Net earnings
                    </dt>
                    <dd className="govuk-summary-list__value">
                      {formatCurrency(results.income_earnings_net)}
                    </dd>
                  </div>
                  
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">
                      Housing benefit entitlement
                    </dt>
                    <dd className="govuk-summary-list__value">
                      {formatCurrency(results.hb_sizecriteria_lha_entitled)}
                    </dd>
                  </div>
                  
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">
                      Council tax liability
                    </dt>
                    <dd className="govuk-summary-list__value">
                      {formatCurrency(results.cts_liability_postsingleperson)}
                    </dd>
                  </div>
                  
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">
                      Total eligible amount
                    </dt>
                    <dd className="govuk-summary-list__value">
                      {formatCurrency(results.output_eligible_total_result)}
                    </dd>
                  </div>
                  
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">
                      Pensioner household
                    </dt>
                    <dd className="govuk-summary-list__value">
                      {results.isPensionerHousehold ? 'Yes' : 'No'}
                    </dd>
                  </div>
                </dl>

                {results.full_calc_needed && results.full_calc_link && (
                  <p className="govuk-body govuk-!-margin-top-5">
                    <a href={results.full_calc_link} className="govuk-link">
                      View full calculation details
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculateBenefits;