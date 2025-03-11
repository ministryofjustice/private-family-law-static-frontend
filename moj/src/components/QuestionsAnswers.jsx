// QuestionsAnswers.js
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import './QuestionsAnswers.css';

export default function QuestionsAnswers({ queries: initialQueries, caseId, onQueryAdded }) {
  const [queries, setQueries] = React.useState(initialQueries || []); 
  const [question, setQuestion] = React.useState(''); 
  const [isSubmitting, setIsSubmitting] = React.useState(false); 

  // Update queries when initialQueries changes
  React.useEffect(() => {
    setQueries(initialQueries || []);
  }, [initialQueries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/cases/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId: caseId,
          query: question,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) {
        throw new Error('Failed to submit query');
      }
      const result = await response.json();
      
      // Update local state
      setQueries(prevQueries => [...prevQueries, result]);
      // Update parent state
      onQueryAdded(result);
      
      setQuestion('');
    } catch (error) {
      console.error('Error submitting query:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="questionArea mt-4 pt-4">
      <h2 className='largeText'>How can I assist you?</h2>
                        
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { mb: 4, width:'100%' } }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <ul className="questionAnswerList">
          {queries && queries.map((item) => (
            <li key={item.trace_id}>
              <div className="question">{item.query}</div>
              <div className="answer">{item.result}</div>
            </li>
          ))}
        </ul>
        <div>
          <TextField
            id="question-input"
            label="Enter your question"
            multiline
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <Button
          variant="contained"
          sx={{ mt: 0, mr: 0 }}
          type="submit"
          disabled={isSubmitting || !question.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </div>
    </>
  );
}