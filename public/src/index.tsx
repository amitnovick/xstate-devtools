import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import queryString from 'query-string';
import { DH_CHECK_P_NOT_PRIME } from 'constants';

let bgConnection;

const renderDevTools = () => {
  const query = queryString.parse(window.location.search);

  if (query.code && window.opener) {
    window.opener.authCallback(query.code);
    setTimeout(() => window.close());
  } else {
    ReactDOM.render(<App />, document.getElementById('root'));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
  }
};

const init = () => {
  const tabId = chrome.devtools.inspectedWindow.tabId.toString();
  bgConnection = chrome.runtime.connect({ name: tabId });
  console.log(`Opened port with 'runtime.connect'`);
  bgConnection.onMessage.addListener(message => {
    console.log('---<message>---');
    console.log(
      `Devtools: @'xstate-viz/public/src/index.tsx': got message: `,
      message
    );
    renderDevTools();
    console.log('---</message>---');
  });
};

init();
