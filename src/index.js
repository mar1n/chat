import React from 'react';
import ReactDOM from 'react-dom';
import "./semantic/semantic-dist/semantic.min.css";
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

if(module.hot) {
  module.hot.accept();
}

