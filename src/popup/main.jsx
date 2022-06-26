import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyles from '~/styles/GlobalStyles';
import Popup from './Popup';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <GlobalStyles />
      <Popup />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
