import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Options from './Options';
import GlobalStyles from '~/styles/GlobalStyles';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <GlobalStyles />
      <Options />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
