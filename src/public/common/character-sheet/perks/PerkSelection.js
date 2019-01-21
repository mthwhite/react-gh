import React from 'react';
import PropTypes from 'prop-types';
import PerkCheck from "./PerkCheck";

class PerkSelection extends React.Component {
  updateCharacter(a) {
     if(a.thisPerk) {
       var newPerk = a.thisPerk;
       delete a.thisPerk;
       var allPerks = this.props.allPerks;
       allPerks.forEach(eachPerk => {
         if(eachPerk.perk === newPerk.perk) {
           eachPerk = newPerk;
         }
       });
       a.allPerks = allPerks;
     }
     return this.props.onUpdateCharacter(a);
  }


  render() {
    return (
      <div className="perks">
      <form>
        {this.props.allPerks.map( (element, index) => {
                return (
                    <PerkCheck
                    key = {index}
                    onUpdateCharacter = {(a) => this.updateCharacter(a)}
                    thisPerk = {element}
                    selectedPerks = {this.props.perks}
                    fullDeck = {this.props.fullDeck}
                    availablePerks = {this.props.availablePerks}
                />)
            })}
      </form>
      </div>
    );
  }
}

PerkSelection.propTypes = {
  onUpdateCharacter: PropTypes.func.isRequired,
  allPerks: PropTypes.array.isRequired,
  perks: PropTypes.array.isRequired,
  fullDeck: PropTypes.object.isRequired,
  availablePerks: PropTypes.number.isRequired,
};

export default PerkSelection;
