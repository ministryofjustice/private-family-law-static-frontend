import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, IconButton, Tooltip, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'
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
  const [pendingQueries, setPendingQueries] = React.useState([]);
  
  // Create refs for each answer container
  const answerRefs = React.useRef({});
  // Ref for the question list container
  const questionListRef = React.useRef(null);

  // Combine regular queries and pending queries for display
  // Define allQueries before any useEffect that depends on it
  const allQueries = React.useMemo(() => {
    return [...queries, ...pendingQueries];
  }, [queries, pendingQueries]);

  // Update queries when initialQueries changes
  React.useEffect(() => {
    setQueries(initialQueries || []);
  }, [initialQueries]);

  // Scroll to bottom when new queries are added
  React.useEffect(() => {
    if (questionListRef.current) {
      questionListRef.current.scrollTop = questionListRef.current.scrollHeight;
    }
  }, [allQueries]); // Now allQueries is defined before this useEffect

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Generate a temporary ID for the pending query
    const tempId = `temp-${Date.now()}`;
    
    // Add the question to pendingQueries immediately
    const newPendingQuery = {
      trace_id: tempId,
      query: question,
      isPending: true,
      timestamp: new Date().toISOString()
    };
    
    setPendingQueries(prev => [...prev, newPendingQuery]);
    setIsSubmitting(true);
    
    // Clear the input field immediately
    setQuestion('');
    
    try {
      const response = await fetch('/api/cases/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId: caseId,
          query: newPendingQuery.query,
          timestamp: newPendingQuery.timestamp
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit query');
      }
      
      const result = await response.json();
      
      // Remove from pending queries
      setPendingQueries(prev => prev.filter(q => q.trace_id !== tempId));
      
      // Update local state with the real result
      setQueries(prevQueries => [...prevQueries, result]);
      
      // Update parent state
      onQueryAdded(result);
      
    } catch (error) {
      console.error('Error submitting query:', error);
      // Keep the question but mark it as errored
      setPendingQueries(prev => 
        prev.map(q => q.trace_id === tempId ? {...q, error: true} : q)
      );
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
    <div className="questionArea pt-1" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        component="form"
        sx={{ 
          '& .MuiTextField-root': { 
            mb: 2, // Reduced margin for compact floating display
            width:'100%' 
          },
          display: 'flex',
          flexDirection: 'column',
          height: '100%', // Make the box take full height
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {/* Question/Answer list with scroll capability */}
        <Box 
          ref={questionListRef}
          sx={{ 
            flexGrow: 1, // This will make it take up all available space
            overflowY: allQueries.length > 0 ? 'auto' : 'hidden', // Only show scrollbar when needed
            mb: 2,
            pr: 1, // Add some padding for scrollbar
            minHeight: 0 // This prevents flexbox children from expanding beyond container
          }}
        >
          <ul className="questionAnswerList">
            {allQueries && allQueries.map((item, index) => (
              <li key={item.trace_id || `query-${index}`}>
                <div className="question">
                  {item.query}
                </div>
                <div className="answer">
                  {!item.isPending ? (
                    <>
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
                      <div className="markdown-content">
                        <ReactMarkdown>{item.result}</ReactMarkdown>
                      </div>
                    </>
                  ) : (
                    <div className="pendingAnswer">
                      <CircularProgress size={24} />
                      <span className="ml-2">Retrieving answer...</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Box>
        
        {/* Input area anchored at the bottom */}
        <Box className="input-container" sx={{ marginTop: 'auto' }}>
          <TextField
            id="question-input"
            label="Enter your question"
            placeholder="Please type your query"
            multiline
            minRows={1}
            maxRows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isSubmitting}
            sx={{
              '& .MuiInputBase-root': {
                minHeight: '50px', // Reduced from 75px
                alignItems: 'flex-start', // Changed from center
                padding: '8px 14px' // Adjust padding to be more compact
              },
              '& .MuiOutlinedInput-root': {
                paddingBottom: 0,
              },
              mb: 0 // Remove bottom margin
            }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting || !question.trim()}
            sx={{ 
              height: '50px', // Reduced from 75px
              opacity: question.trim() ? 1 : 0.7,
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </div>
  );
}