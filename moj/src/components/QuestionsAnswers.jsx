import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

import './QuestionsAnswers.css';

export default function QuestionsAnswers() {
  return (
    <>
    <div className="questionArea mt-4 pt-4">
      <h2 className='largeText'>How can I assist you?</h2>
                        
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { mb: 4, width:'100%' } }}
        noValidate
        autoComplete="off"
      >
        <ul className="questionAnswerList">
          <li>
            <div className="question">This is the first question</div>
            <div className="answer">This is the first answer</div>
          </li>
          <li>
            <div className="question">This is the second question</div>
            <div className="answer">This is the second answer</div>
          </li>
        </ul>
        <div>
          <TextField
            id=""
            label="Enter your question"
            multiline
            rows={4}
          />
        </div>
        <Button
          variant="contained"
          sx={{ mt: 0, mr: 0 }}
        >
          Submit
        </Button>
      </Box>
    </div>
    </>
  );
}
