// Map with keys of tabIds and values as `runtime.Port` instances
let inspectedWindowTabs = {};
/**
 * Map with keys of tabIds and value as an array of objects representing running services.
 * Every service object has the following keys:
 *  `serviceId`: a unique number that identify this service
 *  `machine`: a stringified xstate machine object
 *  `state` : a stringified xstate state object
 *  `events` : an array of objects with keys: `event`: an Event object, `time`: a number
 */
let tabs = {};

const startOrRestartDevTools = tabId => {
  if (tabId in tabs) {
    const services = tabs[tabId];
    if (tabId in inspectedWindowTabs) {
      const panelPort = inspectedWindowTabs[tabId];
      console.log(
        'startOrRestartDevTools: sending `connect` with `services`:',
        services
      );
      panelPort.postMessage({
        type: 'connect',
        payload: {
          services: services
        }
      });
    }
  }
};

// establishing connection with devtools
chrome.runtime.onConnect.addListener(panelPort => {
  console.log('runtime.onConnect: tabs: ', tabs);
  const { name: tabId } = panelPort;
  inspectedWindowTabs[tabId] = panelPort;
  startOrRestartDevTools(tabId);
});

const pushOrCreateServicesArray = (tabId, service) => {
  if (tabId in tabs) {
    tabs[tabId].push(service);
  } else {
    tabs[tabId] = [service];
  }
};

const initializeTab = ({ tabId, serviceId, machine, state, events }) => {
  const service = {
    serviceId: serviceId,
    machine: machine,
    state: state,
    events: events
  };
  pushOrCreateServicesArray(tabId, service);
};

// background.js recieves message from content page and forwards it to devTools page
chrome.runtime.onMessage.addListener((message, sender) => {
  const { id: tabId } = sender.tab;
  const { type } = message;
  // eslint-disable-next-line default-case
  switch (type) {
    case 'connect': {
      const { serviceId, machine, state } = message.payload;
      console.log('connect: `tabs` before:', tabs);
      const events = [];
      initializeTab({ tabId, serviceId, machine, state, events });
      console.log('connect: `tabs` after:', tabs);
      startOrRestartDevTools(tabId);
      return;
    }
    case 'update': {
      const { serviceId, state, event } = message.payload;
      console.log('update: `tabs` before:', tabs);

      if (tabId in tabs) {
        const matchingService = tabs[tabId].find(
          service => service.serviceId === serviceId
        );
        if (matchingService !== undefined) {
          matchingService.state = state;
          matchingService.events.push(event);
          console.log('update: `tabs` after:', tabs);

          if (tabId in inspectedWindowTabs) {
            inspectedWindowTabs[tabId].postMessage({
              type: 'update',
              payload: {
                serviceId: serviceId,
                state: state,
                event: event
              }
            });
          }
        }
      }
      return;
    }
    case 'disconnect': {
      const { serviceId } = message.payload;
      console.log('disconnect: `tabs` before:', tabs);

      if (tabId in tabs) {
        const matchingService = tabs[tabId].find(
          service => service.serviceId === serviceId
        );
        if (matchingService !== undefined) {
          if (tabId in inspectedWindowTabs) {
            inspectedWindowTabs[tabId].postMessage({
              type: 'disconnect',
              payload: {
                serviceId: serviceId
              }
            });
          }
        }
      }
      return;
    }
  }
});

const removeTabId = tabId => {
  delete inspectedWindowTabs[tabId];
  delete tabs[tabId];
};

// when tab is closed, remove the tabid from `tabs`
chrome.tabs.onRemoved.addListener(tabId => {
  console.log('tabs.onRemoved');
  removeTabId(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, { status }) => {
  if (status === 'loading') {
    console.log('tabs.onUpdated');
    tabs[tabId] = [];
    startOrRestartDevTools(tabId);
  }
});
