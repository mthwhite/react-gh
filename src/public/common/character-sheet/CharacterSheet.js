import React from 'react';
import PropTypes from 'prop-types';
import SheetText from './sheet-text/SheetText'
import PerkSelection from './perks/PerkSelection'
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';
import "./CharacterSheet.css";

class CharacterSheet extends React.Component {
  updateCharacter(a) {
    if(a.allPerks) {
      var allPerks = a.allPerks;
      delete a.thisPerks;
      var thisCharacter = this.props.characterClassInfo;
      thisCharacter.perks = allPerks;
      a.character = thisCharacter;
    }
    return this.props.onUpdateCharacter(a);
  }

  componentDidMount() {
    this.updateCharacter({
      'hp': this.props.characterClassInfo.hp[this.props.characterInfo.level - 1],
      'maxHp': this.props.characterClassInfo.hp[this.props.characterInfo.level - 1]
    });
 }

 handleChange(e, type) {
    var update = {};
    update[type] = parseInt(e, 10);
    this.updateCharacter(update);
  }

  getLevel() {
    return "Level: " + this.props.characterInfo.level;
  }

  getRetirements() {
    return "Retirements: " + this.props.characterInfo.retirements;
  }

  getChecks() {
    return "Perks from Checks: " + this.props.characterInfo.checks;
  }


  render() {
    return (
    <div className = "character-sheet-wrapper">
      <SheetText label = {this.props.characterClassInfo.fullClass} />
      {/*<SheetText label = 'Name' textField = {true} />*/}
      <DropdownButton bsStyle='default' title = {this.getLevel()} id = 'level-selector' onSelect={(e) => this.handleChange(e, 'level')}>
        <MenuItem eventKey="1">1</MenuItem>
        <MenuItem eventKey="2">2</MenuItem>
        <MenuItem eventKey="3">3</MenuItem>
        <MenuItem eventKey="4">4</MenuItem>
        <MenuItem eventKey="5">5</MenuItem>
        <MenuItem eventKey="6">6</MenuItem>
        <MenuItem eventKey="7">7</MenuItem>
        <MenuItem eventKey="8">8</MenuItem>
        <MenuItem eventKey="9">9</MenuItem>
      </DropdownButton>
      <DropdownButton bsStyle='default' title = {this.getRetirements()} id = 'retirements-selector' onSelect={ (e) => this.handleChange(e, 'retirements')}>
        <MenuItem eventKey="0">0</MenuItem>
        <MenuItem eventKey="1">1</MenuItem>
        <MenuItem eventKey="2">2</MenuItem>
        <MenuItem eventKey="3">3</MenuItem>
        <MenuItem eventKey="4">4</MenuItem>
        <MenuItem eventKey="5">5</MenuItem>
        <MenuItem eventKey="6">6</MenuItem>
        <MenuItem eventKey="7">7</MenuItem>
        <MenuItem eventKey="8">8</MenuItem>
        <MenuItem eventKey="9">9</MenuItem>
      </DropdownButton>
      <DropdownButton bsStyle='default' title = {this.getChecks()} id = 'checks-selector' onSelect={ (e) => this.handleChange(e, 'checks')}>
        <MenuItem eventKey="0">0</MenuItem>
        <MenuItem eventKey="1">1</MenuItem>
        <MenuItem eventKey="2">2</MenuItem>
        <MenuItem eventKey="3">3</MenuItem>
        <MenuItem eventKey="4">4</MenuItem>
        <MenuItem eventKey="5">5</MenuItem>
      </DropdownButton>
      <SheetText label = 'Total Perks' text = {this.props.characterInfo.allPerkCount}/>
      {/*<SheetText label = 'Total xp' text = {this.props.characterInfo.totalXp}/>*/}
      {/*<SheetText label = 'Gold' text = {this.props.characterInfo.gold}/>*/}
      <PerkSelection
        onUpdateCharacter = {(a) => this.updateCharacter(a)}
        fullDeck = {this.props.characterInfo.modifierDeck}
        perks = {this.props.characterInfo.perks}
        allPerks = {this.props.characterClassInfo.perks}
        availablePerks = {this.props.characterInfo.availablePerks}
        />
     </div>
    );
  }
}

CharacterSheet.propTypes = {
  onUpdateCharacter: PropTypes.func.isRequired,
  characterInfo: PropTypes.object.isRequired,
  characterClassInfo: PropTypes.object.isRequired,
};

export default CharacterSheet;
