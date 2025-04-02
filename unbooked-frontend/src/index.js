// index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './UserContext';
import App from './App';

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);
