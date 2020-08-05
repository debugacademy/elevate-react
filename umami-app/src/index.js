import React from 'react';
import ReactDOM from 'react-dom';
import App from './task/App'

export const DrupalContext = React.createContext(
  {
    siteUrl: 'http://website-URL-here/',
    endpoint: '/path-to-API-endpoint-here (/jsonapi)'
  });

ReactDOM.render(<App />, document.getElementById('react-manage'));
