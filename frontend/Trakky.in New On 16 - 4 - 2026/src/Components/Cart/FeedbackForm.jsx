import React from 'react';
import './FeedbackForm.css';
import { TextField, Button } from '@mui/material';

const FeedbackForm = () => {
  return (
    <div className="Cart-Feedback-container">
      <div className="Cart-Feedback-header">
        <h1>Feedback</h1>
      </div>
      <form className="Cart-Feedback-form">
        <div className="Cart-Feedback-row">
          <div className="Cart-Feedback-input-icon">
            <TextField 
              label="Name"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="Cart-Feedback-input-icon">
            <TextField 
              label="Phone no."
              variant="outlined"
              fullWidth
            />
          </div>
        </div>
        <div className="Cart-Feedback-row">
          <div className="Cart-Feedback-input-icon" style={{width:'100%'}}>
            <TextField 
              label="Email"
              variant="outlined"
              fullWidth
            />
          </div>
        </div>
        <div className="Cart-Feedback-row">
          <div className="Cart-Feedback-input-icon" style={{width:'100%'}}>
            <TextField 
              label="Message..."
              variant="outlined"
              multiline
              rows={4}
              fullWidth
            />
          </div>
        </div>
        <div className="Cart-Feedback-row">
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth
            className="Cart-Feedback-submit"
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
