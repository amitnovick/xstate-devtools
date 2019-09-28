//@ts-check
import React from 'react';
import './App.css';
import { Machine, assign } from 'xstate';

let devtools;

const machine = Machine({
  id: 'fetch',
  initial: 'idle',
  context: {
    retries: 0
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      on: {
        RESOLVE: 'success',
        REJECT: 'failure'
      }
    },
    success: {
      type: 'final'
    },
    failure: {
      on: {
        RETRY: {
          target: 'loading',
          actions: assign({
            retries: (context, event) => context.retries + 1
          })
        }
      }
    }
  }
});

setTimeout(() => {
  console.log('machine before sending:', machine);
  devtools = window.__XSTATE_DEVTOOLS_EXTENSION__.connect({
    machine: JSON.stringify(machine.config),
    state: JSON.stringify(machine.initialState)
  });
}, 1000);

setTimeout(() => {
  const nextState = machine.transition(machine.initialState, 'FETCH');
  console.log('nextState before sending:', nextState);
  devtools.send(JSON.stringify(nextState));
}, 20000);

function App() {
  return <h2>Extension Consumer</h2>;
}

export default App;
