import React from 'react';
import GameBoard from './public/common/game-board/GameBoard';
import './index.css';
const stateSvc = require('./service/stateService');

const App = () => (
  <GameBoard
  defaultState = {defaultState}
  saveState = {(a) => thisStateSvc.saveState(a)}
  clearState = {() => thisStateSvc.clearState()}
  />
);

const thisStateSvc = new stateSvc();
var defaultState = thisStateSvc.getDefaultState();
defaultState = thisStateSvc.loadState();

export default App;
