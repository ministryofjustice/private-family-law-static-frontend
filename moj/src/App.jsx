import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import CalculateBenefitsPage from './pages/CalculateBenefitsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content" role="main">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/calculate-benefits" element={<CalculateBenefitsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;