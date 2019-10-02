// Map with keys of tabIds and values as `runtime.Port` instances
let inspectedWindowTabs = {};
/**
 * Map with keys of tabIds and value as an object with the following keys:
 *  `machine`: a stringified xstate machine object
 *  `state` : a stringified xstate state object
 */
let tabs = {};

// establishing connection with devtools
chrome.runtime.onConnect.addListener(panelPort => {
  const { name: tabId } = panelPort;
  inspectedWindowTabs[tabId] = panelPort;
  if (tabId in tabs) {
    const { machine, state } = tabs[tabId];

    panelPort.postMessage({
      type: 'connect',
      payload: {
        machine: machine,
        state: state
      }
    });
  }
});

// background.js recieves message from content page and forwards it to devTools page
chrome.runtime.onMessage.addListener((message, sender) => {
  const { id: tabId } = sender.tab;
  const { type } = message;
  // eslint-disable-next-line default-case
  switch (type) {
    case 'connect': {
      const { machine, state } = message.payload;
      tabs[tabId] = {
        machine: machine,
        state: state
      };
      if (tabId in inspectedWindowTabs) {
        inspectedWindowTabs[tabId].postMessage({
          type: 'connect',
          payload: {
            machine: machine,
            state: state
          }
        });
      }
      return;
    }
    case 'update': {
      const { state } = message.payload;
      tabs[tabId].state = state;
      if (tabId in inspectedWindowTabs) {
        inspectedWindowTabs[tabId].postMessage({
          type: 'update',
          payload: {
            state: state
          }
        });
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
