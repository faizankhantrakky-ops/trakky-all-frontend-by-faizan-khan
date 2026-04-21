import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./Faqs.css";



const FaqSection = ({ title, questions }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const titleStyle = {
    color: '#6B45BC',
    backgroundColor: '#FFFFFF', // Add this line for the title background color
    padding: '8px',
    
    // Optional: Add padding for better aesthetics
  };

  return (
    <div className='faq-container'>
    <h2 className='subheading'>{title}</h2>
    
    {questions.map((question, index) => (
      <Accordion key={index} expanded={expandedIndex === index}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={() => handleToggle(index)}
        >
          <Typography>{question.question}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{question.answer}</Typography>
        </AccordionDetails>
      </Accordion>
    ))}
  </div>
  );
};

const Faqs = () => {
  const faqData = {
    serviceAvailability: [
      { question: 'What If I am not satisfied with the salon?', answer: 'You can reach out to our customer support for assistance.' },
      { question: 'What if I have a problem getting my service?', answer: 'Contact the salon directly or use the Trakky App to report the issue.' },
      { question: 'Will I get multiple services at a single salon?', answer: 'Yes, most salons offer a variety of services, and you can choose multiple services.' },
      { question: 'Will I choose multiple salon service at a single point of time?', answer: 'You may need to schedule appointments for each service separately.' },
      { question: 'What if I am not satisfied with Trakky App?', answer: 'Please provide feedback through our support channels so we can improve your experience.' },
      { question: 'How will my services be delivered?', answer: 'Service delivery details depend on the salon and the type of service. Contact the salon for specific information.' },
    ],
    payments: [
      { question: 'What kind of payment modes are accepted?', answer: 'Accepted payment modes vary by salon. Check with the specific salon for available payment options.' },
    ],
    salons: [
      { question: 'How have you selected these Salons?', answer: 'Salons on Trakky App are selected based on various factors, including customer reviews, quality of services, and location.' },
      { question: 'You don\'t have the salon service I need, what should I do?', answer: 'You can suggest a salon or service through the Trakky App, and we will consider adding it based on demand and feasibility.' },
    ],
    feedback: [
      { question: 'Is there any option to appreciate Trakky App?', answer: 'Yes, you can provide positive feedback and ratings on the app store or through our customer support.' },
      { question: 'What if I am not satisfied with Trakky App?', answer: 'Please contact our support team so we can address your concerns and improve your experience.' },
      { question: 'Is there any option to appreciate the salon?', answer: 'Certainly! You can leave positive reviews and ratings for the salon on the Trakky App.' },
    ],
  };

  return (
    <div >

      <h1 className='faqs-heading'>FAQs</h1>
      <div className="faqs">
        <FaqSection title="Service Availability" questions={faqData.serviceAvailability} />
        <FaqSection title="Payments" questions={faqData.payments} />
        <FaqSection title="Salons" questions={faqData.salons} />
        <FaqSection title="Feedback" questions={faqData.feedback} />
      </div>
    </div>
  );
};

export default Faqs;
