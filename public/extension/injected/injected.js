const __XSTATE_DEVTOOLS_EXTENSION__ = {
  connect: () => {
    window.postMessage({
      type: 'APP_CONNECTED_TO_DEVTOOLS'
    });

    return {
      init: () => {},
      send: () => {
        window.postMessage({});
      }
    };
  }
};

window.__XSTATE_DEVTOOLS_EXTENSION__ = __XSTATE_DEVTOOLS_EXTENSION__;
