import React from 'react';
import { StateChart } from './index';
import styled from 'styled-components';
import queryString from 'query-string';
import { LayoutButton } from './LayoutButton';

import AppContext from './AppContext';

const StyledApp = styled.main`
  --color-app-background: #fff;
  --color-border: #c9c9c9;
  --color-primary: rgba(87, 176, 234, 1);
  --color-primary-faded: rgba(87, 176, 234, 0.5);
  --color-primary-shadow: rgba(87, 176, 234, 0.1);
  --color-link: rgba(87, 176, 234, 1);
  --color-disabled: #b3b3b3;
  --color-edge: #c9c9c9;
  --color-edge-active: var(--color-primary);
  --color-secondary: rgba(255, 152, 0, 1);
  --color-secondary-light: rgba(255, 152, 0, 0.5);
  --color-sidebar: #272722;
  --color-gray: #555;
  --color-failure: #ee7170;
  --color-success: #31ae00;
  --radius: 0.2rem;
  --border-width: 2px;
  --sidebar-width: 25rem;
  --shadow: 0 0.5rem 1rem var(--shadow-color, rgba(0, 0, 0, 0.2));
  --duration: 0.2s;
  --easing: cubic-bezier(0.5, 0, 0.5, 1);

  height: 100%;
  overflow: auto;
`;

const query = queryString.parse(window.location.search);

function layoutReducer(state, event) {
  switch (state) {
    case 'full':
      switch (event) {
        case 'TOGGLE':
          return 'viz';
        default:
          return state;
      }
    case 'viz':
      switch (event) {
        case 'TOGGLE':
          return 'full';
        default:
          return state;
      }
    default:
      return state;
  }
}

export function App({ machine, state, serviceSummary }) {
  const [layout, dispatchLayout] = React.useReducer(
    layoutReducer,
    query.layout || (!!query.embed ? 'viz' : 'full')
  );

  return (
    <StyledApp data-layout={layout} data-embed={query.embed}>
      <AppContext.Provider value={{ machine: machine, state: state }}>
        <StateChart
          machine={machine}
          state={state}
          serviceSummary={serviceSummary}
        />
        <LayoutButton onClick={() => dispatchLayout('TOGGLE')}>
          {{ full: 'Hide', viz: 'Code' }[layout] || 'Show'}
        </LayoutButton>
      </AppContext.Provider>
    </StyledApp>
  );
}
