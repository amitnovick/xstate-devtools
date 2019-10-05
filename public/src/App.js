import './App.css';
import { App as XStateViz } from '@statecharts/xstate-viz';
import React from 'react';

const App = props => {
  return <XStateViz {...props} />;
};

export default App;
