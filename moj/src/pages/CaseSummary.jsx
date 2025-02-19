import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';


import SummaryCard from '../components/SummaryCard';

import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GDSTransport from '../fonts/GDSTransportWebsite.woff2';
import '../App.css';

export default function CaseSummary() {
  
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
    <Grid size={{ xs: 12, md: 12, lg: 12 }}>
      <div className="mb-3">
        <a href="/file-upload" >&lt; Back</a>
      </div>
    </Grid>

    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box sx={{ flexGrow: 1 }} className="main">
      <Typography variant="h2">Case Summary Page</Typography>
      <Grid container spacing={4}>
        <Grid container spacing={4} size={{ xs: 12, md: 12, lg: 12 }}>
          <Grid container spacing={4} size={{ xs: 12, md: 12, lg: 12 }}>
              <Grid size={{ xs: 12, lg: 12 }}>
                <SummaryCard />
              </Grid>
            </Grid>
        </Grid>
      </Grid>
    </Box>
    </ThemeProvider>
    </>
  );
}
