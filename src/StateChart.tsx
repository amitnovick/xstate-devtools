import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Machine as _Machine,
  StateNode,
  State,
  EventObject,
  Machine,
  assign,
  send,
  spawn,
  StateMachine
} from 'xstate';
import * as XState from 'xstate';
import { StateChartContainer, StyledStateChartContainer } from './VizTabs';
import { StatePanel } from './StatePanel';
import { raise } from 'xstate/lib/actions';
import { getEdges } from 'xstate/lib/graph';

const StyledViewTab = styled.li`
  padding: 0 1rem;
  border-bottom: 2px solid transparent;
  list-style: none;
  text-transform: uppercase;
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:not([data-active]):hover {
    border-color: var(--color-secondary-light);
  }

  &[data-active] {
    border-color: var(--color-secondary);
  }
`;

const StyledViewTabs = styled.ul`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  margin: 0;
  padding: 0;
  flex-grow: 0;
  flex-shrink: 0;
  position: sticky;
  top: 0;
`;

const StyledSidebar = styled.div`
  background-color: var(--color-sidebar);
  color: white;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2rem 1fr;
  border-top-left-radius: 1rem;
  box-shadow: var(--shadow);
  transition: transform 0.6s cubic-bezier(0.5, 0, 0.5, 1);
  z-index: 1;
`;

export const StyledStateChart = styled.div`
  grid-area: content;
  display: grid;
  grid-template-columns: 1fr var(--sidebar-width, 25rem);
  grid-template-rows: 1fr;
  grid-template-areas: 'content sidebar';
  font-family: sans-serif;
  font-size: 12px;
  overflow: hidden;
  max-height: inherit;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  > ${StyledSidebar} {
    grid-area: sidebar;
  }

  > ${StyledStateChartContainer} {
    grid-area: content;
  }

  > * {
    max-height: inherit;
    overflow-y: auto;
  }

  [data-layout='viz'] & {
    > :not(${StyledSidebar}) {
      grid-column: 1 / -1;
    }

    > ${StyledSidebar} {
      transform: translateX(100%);
    }
  }
`;

export interface EventRecord {
  event: EventObject;
  time: number;
}
export interface StateChartState {
  machine: StateNode<any>;
  preview?: State<any, any>;
  previewEvent?: string;
  view: string; // "state" | "events"
  code: string;
  toggledStates: Record<string, boolean>;
  error?: any;
  events: Array<EventRecord>;
}

export class StateChart extends React.Component<any, any> {
  state: any = (() => {
    const machine = this.props.machine;

    return {
      preview: undefined,
      previewEvent: undefined,
      view: 'state',
      machine: machine,
      code:
        typeof this.props.machine === 'string'
          ? this.props.machine
          : `Machine(${JSON.stringify(machine.config, null, 2)})`,
      toggledStates: {},
      events: []
    };
  })();

  renderView() {
    const { view, events } = this.state;
    const { serviceSummary, state: current } = this.props;

    switch (view) {
      case 'state':
        return <StatePanel state={current} serviceSummary={serviceSummary} />;
      default:
        return null;
    }
  }

  render() {
    const { className } = this.props;
    const { code } = this.state;

    return (
      <StyledStateChart
        className={className}
        key={code}
        style={{
          background: 'var(--color-app-background)'
        }}
      >
        <StateChartContainer />
        <StyledSidebar /* TODO: Check that under this works */>
          <StyledViewTabs>
            {['state'].map(view => {
              return (
                <StyledViewTab
                  onClick={() => this.setState({ view })}
                  key={view}
                  data-active={this.state.view === view || undefined}
                >
                  {view}
                </StyledViewTab>
              );
            })}
          </StyledViewTabs>
          {this.renderView()}
        </StyledSidebar>
      </StyledStateChart>
    );
  }
}
