import React from 'react';
import ReactDOM from 'react-dom/client';
import AppV5 from './AppV5.jsx';
import '../index.css';
import '../motion.css';
import '../v3/v3.css';
import '../v4/v4.css';
import './v5.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppV5 />
  </React.StrictMode>
);
