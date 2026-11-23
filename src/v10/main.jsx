import React from 'react';
import ReactDOM from 'react-dom/client';
import AppV10 from './AppV10.jsx';
import '../index.css';
import '../motion.css';
import '../v9/v9.css';
import './v10.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppV10 />
  </React.StrictMode>
);
