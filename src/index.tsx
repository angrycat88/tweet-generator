import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TweetGenerator from './components/TweetGenerator';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TweetGenerator />
  </React.StrictMode>
);
