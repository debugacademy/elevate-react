import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainContent from './task/MainContent-Embedded'

export const DrupalContext = React.createContext(
  {
    siteUrl: 'http://website-URL-here/',
    endpoint: '/path-to-API-endpoint-here (/jsonapi)'
  });

ReactDOM.render(<MainContent />, document.getElementById('react-tasks'));
