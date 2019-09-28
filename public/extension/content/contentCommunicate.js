// listening for messages from npm package
window.addEventListener('message', msg => {
  const { type } = msg.data;
  if (type === 'connect') {
    console.log(`Content: got message on 'window':`, msg.data);
    chrome.runtime.sendMessage(msg.data);
  }
  // // window listener picks up the message it sends, so we should filter
  // // messages sent by contentscript
  // if (msg.data.action !== 'contentScriptStarted' && firstMessage) {
  //   // since contentScript is run everytime a page is refreshed
  //   // tell the background script that the tab has reloaded
  //   chrome.runtime.sendMessage({ action: 'tabReload' });
  //   firstMessage = false;
  // }

  // // post initial Message to npm package
  // const { action } = msg.data;
  // if (action === 'recordSnap') chrome.runtime.sendMessage(msg.data);
});
