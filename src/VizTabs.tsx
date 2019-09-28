import React, { useState, useMemo } from 'react';
import { Interpreter, Machine } from 'xstate';
import { StateChartVisualization } from './StateChartVisualization';
import styled from 'styled-components';

interface StateChartContainerProps {}

export const StyledStateChartContainer = styled.section`
  display: grid;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  padding: 0 1rem;

  &[data-child] {
    grid-template-columns: 1fr 1fr;
  }
`;

export const StateChartContainer: React.SFC<
  StateChartContainerProps
> = ({}) => {
  return (
    <StyledStateChartContainer>
      <StateChartVisualization visible={true} />
    </StyledStateChartContainer>
  );
};
