import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import './VerticalStepper.css';

const steps = [
  {
    label: 'Information and guidance',
    description: `Essential knowledge and support to help individuals make informed decisions.`,
  },
  {
    label: 'Child arrangement plan',
    description:
      `Details about living arrangements and visitation for the child's well-being.`,
  },
  {
    label: 'Attend MIAM',
    description: `Required step to explore mediation before applying to court for family disputes.`,
  },
  {
    label: 'Attend mediation',
    description: `Helps resolve disputes through structured discussions with a neutral mediator.`,
  },
  {
    label: 'Recommend court application',
    description: `Seeking legal action when other options fail.`,
  },
  {
    label: 'Go to court',
    description: `Pursuing legal action when alternative solutions are ineffective.`,
  },
  {
    label: 'Attend further hearing',
    description: `Continue legal proceedings and provide additional information.`,
  },
  {
    label: 'Court order',
    description: `Legal directive requiring parties to follow specific actions or terms.`,
  },
  {
    label: 'After court guidance',
    description: `Instructions or recommendations to help parties comply with court decisions or resolve issues.`,
  },
];

export default function VerticalStepper() {
  const [activeStep, setActiveStep] = React.useState(3)

  return (
    <Box className="verticalStepper mt-4 pb-4 sticky">
      <h3 className="mb-2">You next steps</h3>
      <Stepper className="verticalStepperSteps" activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  sx={{ mt: 1, mr: 1 }}
                >
                  Go to next step
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      
    </Box>
  );
}

