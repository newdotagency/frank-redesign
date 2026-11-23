import React from 'react';
import ReactDOM from 'react-dom/client';
import CompetitorPage from './CompetitorPage.jsx';
import listenLabs from './competitors/listenLabs';
import '../index.css';
import '../motion.css';
import '../v9/v9.css';
import './v19.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CompetitorPage c={listenLabs} />
  </React.StrictMode>
);
