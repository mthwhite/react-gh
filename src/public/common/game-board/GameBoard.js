// Linter changes
/* jslint browser */
/* global window */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Tab,
  Row,
  Col,
  Nav,
  NavItem,
} from 'react-bootstrap';

// App Components
import CharacterSheet from '../character-sheet/CharacterSheet';
import ModifierDeck from '../modifier-deck/ModifierDeck';
import HpXpBoard from '../hp-xp-board/HpXpBoard';
import Options from '../options/Options';

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.props.defaultState;
    this.tick = this.tick.bind(this);
    this.updateCharacter = this.updateCharacter.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
  }


  componentDidMount() {
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateForSession.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateForSession.bind(this)
    );

    // saves if component has a chance to unmount
    this.saveStateForSession();
  }

  saveStateForSession() {
     return this.props.saveState(this.state);
  }

  tick(value, amount) {
    var newState = this.state;
    newState.currentStats[value] += (amount);
    this.updateState(newState);
  }

  updateState(newState) {
    this.setState(newState);
  }

  updateCharacter(obj) {
      var newState = this.state;
      var shuffleDeck = 0;
      if(typeof obj.resetEverything !== 'undefined' && obj.resetEverything) {
        newState = this.props.clearState();
      } else {
        Object.keys(obj).forEach(function(field) {
          var newValue = obj[field];
          if(!(newState.currentStats[field] === undefined)) {
              newState.currentStats[field] = newValue;
          } else {
              newState.characterInfo[field] = newValue;
          }

          if(field === 'level' || field === 'retirements' || field === 'checks') {
            newState.characterInfo.allPerkCount =
              (newState.characterInfo.level - 1)
              + newState.characterInfo.retirements
              + newState.characterInfo.checks;

              newState.characterInfo.availablePerks =
                newState.characterInfo.allPerkCount
                - newState.characterInfo.perks.length
                ;
          }

          if(field === 'level') {
            newState.currentStats.hp = newState.currentStats.character.hp[newState.characterInfo.level - 1];
            newState.currentStats.maxHp = newState.currentStats.hp;
          }

          if(field === 'perks' || field === 'modifierDeck') {
              shuffleDeck = 1;
          }
        });
        if(shuffleDeck) {
          this.shuffleDeck();
        }
      }
      this.updateState(newState);
  }

  shuffle(array) {
      var cIndex = array.length;
      var tValue;
      var rIndex;

      while (0 !== cIndex) {
          rIndex = Math.floor(Math.random() * cIndex);
          cIndex += -1;
          tValue = array[cIndex];
          array[cIndex] = array[rIndex];
          array[rIndex] = tValue;
      }

      return array;
  }

  shuffleDeck() {
      var deck = [];
      for(var key in this.state.characterInfo.modifierDeck) {
          for(var cardNumber = 0; cardNumber < this.state.characterInfo.modifierDeck[key];cardNumber++) {
              deck.push(key);
          }
      }
      var newState = this.state;
      newState.currentStats.shuffledDeck = this.shuffle(deck);
      newState.currentStats.promptToShuffle = false;
      this.updateState(newState);
  }

  render() {
    return (
      <div className="gameboard-wrapper">
      <div className="tracker">
        <HpXpBoard onTick = {(a,b) => this.tick(a,b)} currentStats = {this.state.currentStats}/>
      </div>
        <div className = 'tabbedContent'>
        <Tab.Container id="left-tab" defaultActiveKey="first">
          <Row className="clearfix">
            <Col sm={2}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="first">Modifier Deck</NavItem>
                <NavItem eventKey="second">Character Info</NavItem>
                <NavItem eventKey="third">Options</NavItem>
              </Nav>
            </Col>
            <Col sm={8}>
              <Tab.Content animation>
                <Tab.Pane eventKey="first"><ModifierDeck
                    onUpdateCharacter = {(a) => this.updateCharacter(a)}
                    fullDeck = {this.state.characterInfo.modifierDeck}
                    shuffledDeck={this.state.currentStats.shuffledDeck}
                    discard = {this.state.currentStats.discard}
                    lastDraw = {this.state.currentStats.lastDraw}
                    shuffleDeck = {() => this.shuffleDeck()}
                    shuffle = {(array) => this.shuffle(array)}
                    promptToShuffle = {this.state.currentStats.promptToShuffle}
                    /></Tab.Pane>
                <Tab.Pane eventKey="second"><div className="character">
                  <CharacterSheet
                  onUpdateCharacter = {(a) => this.updateCharacter(a)}
                  characterInfo = {this.state.characterInfo}
                  characterClassInfo = {this.state.currentStats.character}
                  />
                  </div></Tab.Pane>
                  <Tab.Pane eventKey="third"><div className="options">
                    <Options
                    onUpdateCharacter = {(a) => this.updateCharacter(a)}
                    currentStats = {this.state.currentStats}
                    characterInfo = {this.state.characterInfo}
                    />
                </div></Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        </div>
      </div>
    );
  }
}

GameBoard.propTypes = {
  defaultState: PropTypes.object.isRequired,
  saveState: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
};
export default GameBoard;
