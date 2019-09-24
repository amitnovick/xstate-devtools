import React, { useEffect } from 'react';

function App() {
  // add event listeners to background script
  useEffect(() => {
    // only open port once
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener(message => {
      const { action } = message;
      console.log('got message!', action);

      switch (action) {
        default:
      }
    });
  });

  return (
    <div>
      <h2>Nothing to show here</h2>
    </div>
  );
}

export default App;
