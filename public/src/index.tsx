import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import queryString from 'query-string';
import { Machine, State } from 'xstate';

let backgroundPort;

let machine;
let state;

const renderDevTools = () => {
  const query = queryString.parse(window.location.search);

  if (query.code && window.opener) {
    window.opener.authCallback(query.code);
    setTimeout(() => window.close());
  } else {
    ReactDOM.render(
      <App machine={machine} state={state} />,
      document.getElementById('root')
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
  }
};

const init = () => {
  const tabId = chrome.devtools.inspectedWindow.tabId.toString();
  backgroundPort = chrome.runtime.connect({ name: tabId });
  console.log(`Opened port with 'runtime.connect'`);
  backgroundPort.onMessage.addListener(message => {
    console.log('---<message>---');
    console.log(
      `Devtools: @'xstate-viz/public/src/index.tsx': got message: `,
      message
    );
    console.log('---</message>---');

    const { type } = message;
    switch (type) {
      case 'connect': {
        const { machine: m, state: s } = message.payload;
        machine = Machine(JSON.parse(m));
        state = State.create(JSON.parse(s));
        renderDevTools();
        return;
      }
      case 'update': {
        const { state: s } = message.payload;
        state = State.create(JSON.parse(s));
        return;
      }
    }
  });
};

init();
