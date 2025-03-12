// QuestionsAnswers.js
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
import './QuestionsAnswers.css';

export default function QuestionsAnswers({ queries: initialQueries, caseId, onQueryAdded }) {
  const [queries, setQueries] = React.useState(initialQueries || []);
  const [question, setQuestion] = React.useState(''); 
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState('');
  const [copyId, setCopyId] = React.useState(null);
  
  // Create refs for each answer container
  const answerRefs = React.useRef({});

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

  // Handle key press events for the textarea
  const handleKeyPress = (e) => {
    // Submit on Enter (but not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      handleSubmit(e);
    }
    // Shift+Enter will create a new line naturally (no need to handle specifically)
  };
  
  // Handle copy to clipboard as HTML/rich text
  const handleCopy = (text, id) => {
    try {
      // First approach: Try using newer ClipboardItem API for rich text copying
      if (window.ClipboardItem) {
        // Create HTML content from markdown
        const htmlContent = renderToStaticMarkup(<ReactMarkdown>{text}</ReactMarkdown>);
        
        // Create a blob with HTML content
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        // Also prepare plain text as fallback
        const textBlob = new Blob([text], { type: 'text/plain' });
        
        // Create clipboard data with both formats
        const data = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob
        });
        
        navigator.clipboard.write([data])
          .then(() => {
            setCopySuccess('Copied!');
            setCopyId(id);
            setTimeout(() => {
              setCopySuccess('');
              setCopyId(null);
            }, 2000);
          })
          .catch(err => {
            // Fall back to the selection approach if this fails
            fallbackCopy(text, id);
          });
      } else {
        // Fall back to selection approach for browsers without ClipboardItem
        fallbackCopy(text, id);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      fallbackCopy(text, id);
    }
  };
  
  // Fallback copy method using selection and execCommand
  const fallbackCopy = (text, id) => {
    try {
      // Create a temporary div to hold formatted content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderToStaticMarkup(<ReactMarkdown>{text}</ReactMarkdown>);
      document.body.appendChild(tempDiv);
      
      // Select the content
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Execute copy command
      document.execCommand('copy');
      
      // Clean up
      selection.removeAllRanges();
      document.body.removeChild(tempDiv);
      
      setCopySuccess('Copied!');
      setCopyId(id);
      setTimeout(() => {
        setCopySuccess('');
        setCopyId(null);
      }, 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      // Last resort: just copy the plain text
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopySuccess('Copied (plain text)');
          setCopyId(id);
          setTimeout(() => {
            setCopySuccess('');
            setCopyId(null);
          }, 2000);
        })
        .catch(() => {
          setCopySuccess('Failed to copy');
          setCopyId(id);
          setTimeout(() => {
            setCopySuccess('');
            setCopyId(null);
          }, 2000);
        });
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
              <div className="question">
                {item.query}
              </div>
              <div className="answer">
                <div className="answerHeader">
                  <Tooltip title={copySuccess && copyId === item.trace_id ? copySuccess : "Copy to clipboard"}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleCopy(item.result, item.trace_id)}
                      className="copyButton"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
                <ReactMarkdown>{item.result}</ReactMarkdown>
              </div>
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
            onKeyDown={handleKeyPress}
            disabled={isSubmitting}
          />
        </div>
        <Button
          variant="contained"
          sx={{ mt: 0, mr: 0 }}
          type="submit"
          disabled={isSubmitting || !question.trim()}
        >
          Submit
        </Button>
      </Box>
    </div>
    </>
  );
}