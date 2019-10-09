import React, { useState } from 'react';
import { State, Interpreter } from 'xstate';
import styled from 'styled-components';

const StyledField = styled.div`
  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  margin-top: 0.5rem;
  width: 100%;
  overflow: hidden;

  > label {
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
    opacity: 0.5;
  }

  &[data-empty] {
    opacity: 0.5;
    > label {
      margin-bottom: 0;
    }
  }
`;

interface FieldProps {
  label: string;
  children: any;
  disabled?: boolean;
  style?: any;
}
function Field({ label, children, disabled, style }: FieldProps) {
  return (
    <StyledField
      style={{ ...style, ...(disabled ? { opacity: 0.5 } : undefined) }}
      data-empty={!children || undefined}
    >
      <label>{label}</label>
      {children}
    </StyledField>
  );
}

const StyledDetails = styled.details`
  margin: 0;
  padding: 0 1rem;

  & & {
    border-left: 2px solid #737373;
  }

  > summary {
    font-weight: bold;
    font-size: 1rem;
  }
`;

const StyledPanelAction = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 1ch;

  & + & {
    margin-top: 0.5rem;
  }

  pre {
    margin: 0;
  }
`;

export const StatePanel: React.FunctionComponent<{
  state: State<any, any>;
  serviceSummary: any;
}> = ({ state, serviceSummary }) => {
  const simplifiedState = {
    value: state.value,
    context: state.context
  };

  return (
    <StyledDetails key={serviceSummary} open={true}>
      <summary>{serviceSummary}</summary>
      <Field label="state">
        <pre>{JSON.stringify(simplifiedState, null, 2)}</pre>
      </Field>
    </StyledDetails>
  );
};
