// Map with keys of tabIds and values as `runtime.Port` instances
let inspectedWindowTabs = {};
/**
 * Map with keys of tabIds and value as an array of objects representing running services.
 * Every service object has the following keys:
 *  `serviceId`: a unique number that identify this service
 *  `machine`: a stringified xstate machine object
 *  `state` : a stringified xstate state object
 */
let tabs = {};

// establishing connection with devtools
chrome.runtime.onConnect.addListener(panelPort => {
  const { name: tabId } = panelPort;
  inspectedWindowTabs[tabId] = panelPort;
  if (tabId in tabs && tabs[tabId].length > 0) {
    const services = tabs[tabId];
    const { serviceId, machine, state } = services[services.length - 1];

    panelPort.postMessage({
      type: 'connect',
      payload: {
        serviceId: serviceId,
        machine: machine,
        state: state
      }
    });
  }
});

const pushOrCreateServicesArray = (tabId, service) => {
  if (tabId in tabs) {
    tabs[tabId].push(service);
  } else {
    tabs[tabId] = [service];
  }
};

// background.js recieves message from content page and forwards it to devTools page
chrome.runtime.onMessage.addListener((message, sender) => {
  const { id: tabId } = sender.tab;
  const { type } = message;
  // eslint-disable-next-line default-case
  switch (type) {
    case 'connect': {
      const { serviceId, machine, state } = message.payload;
      const service = {
        serviceId: serviceId,
        machine: machine,
        state: state
      };
      pushOrCreateServicesArray(tabId, service);
      if (tabId in inspectedWindowTabs) {
        inspectedWindowTabs[tabId].postMessage({
          type: 'connect',
          payload: {
            serviceId: serviceId,
            machine: machine,
            state: state
          }
        });
      }
      return;
    }
    case 'update': {
      const { serviceId, state } = message.payload;
      if (tabId in tabs) {
        const matchingService = tabs[tabId].find(
          service => service.serviceId === serviceId
        );
        if (matchingService !== undefined) {
          matchingService.state = state;
          if (tabId in inspectedWindowTabs) {
            inspectedWindowTabs[tabId].postMessage({
              type: 'update',
              payload: {
                serviceId: serviceId,
                state: state
              }
            });
          }
        }
      }
      return;
    }
  }
});

// when tab is closed, remove the tabid from `tabs`
chrome.tabs.onRemoved.addListener(tabId => {
  delete inspectedWindowTabs[tabId];
  delete tabs[tabId];
});
