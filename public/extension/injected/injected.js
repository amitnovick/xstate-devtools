const __XSTATE_DEVTOOLS_EXTENSION__ = {
  connect: ({ machine, state }) => {
    window.postMessage({
      type: 'connect',
      payload: {
        machine: JSON.stringify(machine.config),
        state: JSON.stringify(state)
      }
    });

    return {
      send: state => {
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
