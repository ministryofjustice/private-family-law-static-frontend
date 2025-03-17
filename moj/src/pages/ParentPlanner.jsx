import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import GoBackButton from '../components/GoBackButton';
import SupportTools from '../components/SupportTools';
import SummaryCardActions from '../components/SummaryCardActions';
import SummaryCardDocuments from '../components/SummaryCardDocuments';
import CaseSummary from '../components/CaseSummary';
import SuccessfulCases from '../components/SuccessfulCases';
import RelevantVideos from '../components/RelevantVideos';
import VerticalStepper from '../components/VerticalStepper';

export default function ParentPlanner() {
  return (
    <>
      <GoBackButton />

      <Box className="parentPlannerWrapper"
        sx={{ flexGrow: 1, display: 'flex' }}
      >
        <Grid className="container" container spacing={0} size={{ xs: 12, md: 12, lg: 12 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <SupportTools />
          </Grid>
          <Grid className="contentArea" size={{ xs: 12, md: 9 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, lg: 12 }}>
                <h2>Parent planner</h2>
                <p>Organise and track parenting schedules, agreements, and key events. Coordinate time-sharing and ensure smooth communication for consistent child care.</p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}