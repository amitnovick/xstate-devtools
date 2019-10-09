import React, { useEffect, useRef, useCallback } from 'react';
import { EventObject, State, Interpreter, Machine, assign } from 'xstate';
import { isBuiltInEvent } from './utils';
import styled from 'styled-components';
import { StyledButton } from './Button';
import { EventRecord } from './StateChart';
import { format } from 'date-fns';

const StyledEventPanelEvents = styled.ul`
  list-style: none;
  padding: 0;
  overflow-y: scroll;
`;

const StyledEventPanelEvent = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #444;

  > pre {
    margin: 0;
    flex-grow: 1;
  }

  &[data-builtin] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  details {
    width: 100%;
  }

  summary {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 2rem;
    padding: 0 0.5rem;

    > :first-child {
      margin-right: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const StyledEventPanel = styled.section`
  display: grid;
  grid-template-rows: 1fr 10rem;
  grid-template-areas: 'events' 'editor';
  overflow: hidden;
`;

const StyledTime = styled.time`
  color: #777;
  margin-left: 0.5rem;
`;

export const EventPanel: React.FunctionComponent<{
  records: EventRecord[];
  state: State<any>;
}> = ({ records, state }) => {
  const eventsRef = useRef<any>(null);

  useEffect(() => {
    if (eventsRef.current) {
      eventsRef.current.scrollTop = eventsRef.current.scrollHeight;
    }
  }, [eventsRef.current, records.length]);

  return (
    <StyledEventPanel>
      <StyledEventPanelEvents ref={eventsRef}>
        {records.map(({ event, time }, i) => {
          const pastEventCode = JSON.stringify(event, null, 2);
          const isBuiltIn = isBuiltInEvent(event.type);

          return (
            <StyledEventPanelEvent
              key={i}
              title="Double-click to send, click to edit"
              data-builtin={isBuiltIn || undefined}
            >
              <details>
                <summary>
                  {isBuiltIn ? (
                    <em>{event.type}</em>
                  ) : (
                    <>
                      <strong title={event.type}>{event.type}</strong>
                    </>
                  )}
                  <StyledTime>{format(time, 'hh:mm:ss.SS')}</StyledTime>
                </summary>
                <pre>
                  {isBuiltIn ? event.type : JSON.stringify(event, null, 2)}
                </pre>
              </details>
            </StyledEventPanelEvent>
          );
        })}
      </StyledEventPanelEvents>
    </StyledEventPanel>
  );
};
