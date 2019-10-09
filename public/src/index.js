//@ts-nocheck
/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import queryString from 'query-string';
import { Machine, State } from 'xstate';

let backgroundPort;

let services = [];

const renderDevTools = () => {
  const query = queryString.parse(window.location.search);

  if (query.code && window.opener) {
    window.opener.authCallback(query.code);
    setTimeout(() => window.close());
  } else {
    ReactDOM.render(
      <App services={services} />,
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
        const { services: servicesFromBg } = message.payload;
        console.log('servicesFromBg:', servicesFromBg);
        const parsedServicesFromBg = servicesFromBg.map(service => {
          const { serviceId, machine, state, events } = service;

          return {
            serviceId: serviceId,
            machine: Machine(JSON.parse(machine)),
            state: State.create(JSON.parse(state)),
            events: events.map(event => JSON.parse(event))
          };
        });
        services = parsedServicesFromBg.map(service => ({
          ...service,
          hasStopped: false
        }));
        renderDevTools();

        return;
      }
      case 'update': {
        const { state, serviceId, event } = message.payload;

        const matchingService = services.find(
          service => service.serviceId === serviceId
        );
        if (matchingService !== undefined) {
          matchingService.state = State.create(JSON.parse(state));
          matchingService.events.push(JSON.parse(event));
          renderDevTools();
        }
        return;
      }
      case 'disconnect': {
        const { serviceId } = message.payload;

        const matchingService = services.find(
          service => service.serviceId === serviceId
        );
        if (matchingService !== undefined) {
          services = services.map(service => {
            if (service.serviceId === serviceId) {
              return {
                ...service,
                hasStopped: true
              };
            } else {
              return service;
            }
          });
          renderDevTools();
        }
        return;
      }
    }
  });
};

init();
