// store ports in an array
let inspectedWindowTabs = {}; // Map with keys of tabIds and values as `runtime.Port` instances
let tabs = {}; // Map with keys of tabIds and value as xstate machine data

// establishing connection with devtools
chrome.runtime.onConnect.addListener(panelPort => {
  const tabId = panelPort.name;
  console.log('---<message>---');
  console.log(
    `Background: got message on 'runtime.onConnect' from tabId:`,
    tabId
  );
  console.log('---</message>---');
  inspectedWindowTabs[tabId] = panelPort;
  console.log('Updated inspectedWindowTabs:', inspectedWindowTabs);
  if (tabId in tabs) {
    const { machine, state } = tabs[tabId];

    panelPort.postMessage({
      type: 'connect',
      payload: {
        machine: machine,
        state: state
      }
    });
    console.log('Sent message to panel');
  }

  // // push every port connected to the ports array
  // portsArr.push(port);

  // port.postMessage({
  //   type: 'initialConnectSnapshots'
  // });

  // // every time devtool is closed, remove the port from portsArr
  // port.onDisconnect.addListener(disconnectedPort => {
  //   portsArr.filter(port => port === disconnectedPort);
  // });

  // // receive snapshot from devtools and send it to contentScript
  // port.onMessage.addListener(msg => {});
});

// background.js recieves message from content page and forwards it to devTools page
chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('---<message>---');
  console.log(`Background: got message on 'runtime'`, message);
  console.log('Updated tabs:', tabs);
  console.log('---</message>---');

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

  // const { type } = request;
  // // IGNORE THE AUTOMTAIC MESSAGE SENT BY CHROME WHEN CONTENT SCRIPT IS FIRST LOADED
  // if (type !== 'SIGN_CONNECT') {
  //   portsArr.forEach(bg => bg.postMessage({}));
  // }
});

// when tab is closed, remove the tabid from the tabsObj
chrome.tabs.onRemoved.addListener(tabId => {
  console.log('---<message>---');
  console.log(
    `
'Background: receievd message on 'tabs.onRemoved' for tabId: ${tabId}`
  );
  delete inspectedWindowTabs[tabId];
  delete tabs[tabId];
  console.log(
    `
Background: removed tab. inspectedWindowTabs: ${JSON.stringify(
      inspectedWindowTabs
    )}
`
  );
  console.log('---</message>---');
  // // tell devtools which tab to delete
  // portsArr.forEach(bg => bg.postMessage({}));
});
