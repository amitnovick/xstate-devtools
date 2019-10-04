//@ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import queryString from 'query-string';
import { Machine, State } from 'xstate';

let backgroundPort;

let localServiceId;
let localMachine;
let localState;
let isAlreadyConneted = false;

const renderDevTools = () => {
  const query = queryString.parse(window.location.search);

  if (query.code && window.opener) {
    window.opener.authCallback(query.code);
    setTimeout(() => window.close());
  } else {
    ReactDOM.render(
      <App machine={localMachine} state={localState} />,
      document.getElementById('root')
    );
  }
};

const init = () => {
  const tabId = chrome.devtools.inspectedWindow.tabId.toString();
  backgroundPort = chrome.runtime.connect({ name: tabId });
  backgroundPort.onMessage.addListener(message => {
    const { type } = message;
    switch (type) {
      case 'connect': {
        if (isAlreadyConneted === false) {
          const { serviceId, machine, state } = message.payload;
          localServiceId = serviceId;
          localMachine = Machine(JSON.parse(machine));
          localState = State.create(JSON.parse(state));
          isAlreadyConneted = true;
          renderDevTools();
        }
        return;
      }
      case 'update': {
        const { state, serviceId } = message.payload;
        if (isAlreadyConneted && serviceId === localServiceId) {
          localState = State.create(JSON.parse(state));
          renderDevTools();
        }
        return;
      }
    }
  });
};

init();
