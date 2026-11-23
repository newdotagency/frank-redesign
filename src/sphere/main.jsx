// Preview: <ParticleSphere /> alone, filling the viewport.
import React from 'react';
import ReactDOM from 'react-dom/client';
import ParticleSphere from '../components/ParticleSphere.jsx';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{ height: '100dvh' }}>
      <ParticleSphere />
    </div>
  </React.StrictMode>
);
