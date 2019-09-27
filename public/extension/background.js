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
  inspectedWindowTabs[tabId] = panelPort;
  console.log('Updated panelsPorts:', inspectedWindowTabs);
  panelPort.postMessage({
    payload: tabs[tabId]
  });
  console.log('Sent message to panel');
  console.log('---</message>---');

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
chrome.runtime.onMessage.addListener((request, sender) => {
  console.log('---<message>---');
  console.log(`Background: got message on 'runtime'`, request);
  const tabId = sender.tab.id;
  const data = request;
  tabs[tabId] = data;
  console.log('Updated tabs:', tabs);
  console.log('---</message>---');
  if (tabId in inspectedWindowTabs) {
    inspectedWindowTabs[tabId].postMessage({
      // TODO: this payload should be the machine state
      payload: tabs[tabId]
    });
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
