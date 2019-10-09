let id = 0;

function generateId() {
  const currentId = id;
  id++;
  return currentId;
}

const __XSTATE_DEVTOOLS_EXTENSION__ = {
  connect: ({ machine, state }) => {
    const serviceId = generateId();
    window.postMessage({
      type: 'connect',
      payload: {
        serviceId: serviceId,
        machine: JSON.stringify(machine.config),
        state: JSON.stringify(state)
      }
    });

    return {
      send: ({ state, event }) => {
        const formattedEvent = {
          event: event,
          time: Date.now()
        };
        window.postMessage({
          type: 'update',
          payload: {
            serviceId: serviceId,
            state: JSON.stringify(state),
            event: JSON.stringify(formattedEvent)
          }
        });
      },
      disconnect: () => {
        window.postMessage({
          type: 'disconnect',
          payload: {
            serviceId: serviceId
          }
        });
      }
    };
  }
};

window.__XSTATE_DEVTOOLS_EXTENSION__ = __XSTATE_DEVTOOLS_EXTENSION__;
