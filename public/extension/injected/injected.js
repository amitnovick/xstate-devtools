const __XSTATE_DEVTOOLS_EXTENSION__ = {
  connect: ({ machine, state }) => {
    window.postMessage({
      type: 'connect',
      payload: {
        machine: machine,
        state: state
      }
    });

    return {
      send: state => {
        window.postMessage({
          type: 'update',
          payload: {
            state: state
          }
        });
      }
    };
  }
};

window.__XSTATE_DEVTOOLS_EXTENSION__ = __XSTATE_DEVTOOLS_EXTENSION__;
