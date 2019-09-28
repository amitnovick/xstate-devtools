//@ts-check
import React from 'react';
import './App.css';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

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

function App() {
  const [state, send] = useMachine(machine, {
    devTools: true
  });
  console.log('App State:', state);
  console.log('App State string:', JSON.stringify(state));

  if (state.matches('idle')) {
    return (
      <div>
        <h2>Idle</h2>
        <button onClick={() => send('FETCH')}>FETCH</button>
      </div>
    );
  } else {
    return <h2>Non-idle state</h2>;
  }
}

export default App;
