import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ToggleClassSwitch from './components/ChangeTheme';

import Home from './pages/Home';
import FileUpload from './pages/FileUpload';
import ServicePage from './pages/ServicePage'; // New component
import LoadingPage from './pages/LoadingPage';
import CaseDetails from './pages/CaseDetails';
import ParentPlanner from './pages/ParentPlanner';
import Pathway from './pages/Pathway';
import NoPage from './pages/NoPage';

import Box from '@mui/material/Box';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GDSTransport from './fonts/GDSTransportWebsite.woff2';
import './App.css';


export default function App() {
  
  const theme = createTheme({
    typography: {
      fontFamily: 'GDSTransport, Arial',
      fontSize: 19,

      h2: {
        fontFamily: 'GDSTransportBold, Arial',
        fontSize: 48,
        fontWeight: 500
      },
      h3: {
        fontFamily: 'GDSTransportBold, Arial',
        fontSize: 36,
        fontWeight: 500
      },
      h4: {
        fontFamily: 'GDSTransportBold, Arial',
        fontSize: 24,
        fontWeight: 500
      },
      p: {
        fontFamily: 'GDSTransport, Arial',
        fontSize: 19,
        fontWeight: 400
      },
      body1: {
        fontSize: 19
      }

    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'GDSTransport';
            src: local('GDSTransport'), local('GDSTransport-Regular'), url(${GDSTransport}) format('woff2');
          }
        `,
      },
    },
  });

  return (
    <>
      <Header />
      <ToggleClassSwitch />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }} className="main">
          <BrowserRouter>
            <Routes>
              <Route index element={<FileUpload />} />
              <Route path="/home" element={<Home />} />
              <Route path="/file-upload" element={<FileUpload />} />
              <Route path="/file-upload/:caseId" element={<FileUpload />} />
              
              {/* Updated routes for case dashboard and services */}
              <Route path="/case-details/:caseId" element={<CaseDetails />} />
              <Route path="/case-details/:caseId/service/:serviceName" element={<ServicePage />} />
              
              <Route path="/loading-page" element={<LoadingPage />} />

        
              <Route path="/parent-planner" element={<ParentPlanner />} />


              <Route path="/pathway/:caseId" element={<Pathway />} />
              <Route path="/pathway" element={<Pathway />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
      <Footer />
    </>
  );
}