const __XSTATE_DEVTOOLS_EXTENSION__ = {
  connect: ({ machine, state }) => {
    console.log('injected: connect: Calling `window.psotMessage`');
    window.postMessage({
      type: 'connect',
      payload: {
        machine: JSON.stringify(machine.config),
        state: JSON.stringify(state)
      }
    });

    return {
      send: state => {
        console.log('injected: send: Calling `window.psotMessage`');
        window.postMessage({
          type: 'update',
          payload: {
            state: JSON.stringify(state)
          }
        });
      }
    };
  }
};

window.__XSTATE_DEVTOOLS_EXTENSION__ = __XSTATE_DEVTOOLS_EXTENSION__;
