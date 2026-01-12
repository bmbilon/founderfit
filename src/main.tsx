/**
 * FounderFit Score v2.1: The 6 Execution Forces Framework
 * Main Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

// Dev-only: Validate question bank at startup
if (import.meta.env.DEV) {
  import('./data/validateQuestions').then(({ runQuestionValidation }) => {
    import('./data/questions').then(({ questions }) => {
      runQuestionValidation(questions);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
