// App.js
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { Box, Toolbar } from '@mui/material';
import TitleBar from './components/TitleBar/TitleBar';
import FileUpload from './components/FileUpload/FileUpload';
import Reports from './components/Reports/Reports';
import CaseView from './components/CaseView/CaseView';  // Add this import
import Layout from './components/Layout/Layout';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <TitleBar toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
          <Layout open={drawerOpen} setOpen={setDrawerOpen}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Navigate to="/reports" replace />} />
              <Route path="/upload" element={<Box sx={{ p: 3 }}><FileUpload /></Box>} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/case/:caseNumber" element={<CaseView />} />
            </Routes>
          </Layout>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;