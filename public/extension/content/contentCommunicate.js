// listening to messages from `xstate` package
window.addEventListener('message', msg => {
  const { type } = msg.data;
  switch (type) {
    case 'connect': {
      chrome.runtime.sendMessage(msg.data);
      return;
    }
    case 'update': {
      chrome.runtime.sendMessage(msg.data);
      return;
    }
  }
});
