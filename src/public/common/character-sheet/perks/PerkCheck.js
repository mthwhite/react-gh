import React from 'react';
import PropTypes from 'prop-types';
import "./PerkCheck.css"

class PerkCheck extends React.Component {
  checked = [false, false];

  updateCharacter(a) {
     return this.props.onUpdateCharacter(a);
  }

  canBeToggled(index) {
      return (this.props.availablePerks > 0 || this.checked[index])? false : true;
  }

  toggle(index) {
      this.checked[index] = (this.checked[index])? false : true;
      var thisPerk = this.props.thisPerk;
      if(this.checked[index]) {
                this.props.selectedPerks.push(this.props.thisPerk);
                this.props.thisPerk.effects.forEach((info) => {
                    if(this.props.fullDeck[info.card] === undefined) {
                        this.props.fullDeck[info.card] = 0;
                    }
                    this.props.fullDeck[info.card] += (info.amount);
                });

                thisPerk.used++;
                this.updateCharacter({
                  'modifierDeck': this.props.fullDeck,
                  'thisPerk': thisPerk,
                  'perks': this.props.selectedPerks,
                  'availablePerks': this.props.availablePerks - 1
                });
      } else {
                var newPerks = [];
                var found = 0;
                this.props.selectedPerks.forEach((thisPerk) => {
                    if(thisPerk.perk !== this.props.thisPerk.perk || found) {
                        newPerks.push(thisPerk);
                    } else {
                        found = 1;
                    }
                });
                this.props.thisPerk.effects.forEach((info) => {
                    this.props.fullDeck[info.card] += (info.amount) * (-1);
                });

                thisPerk.used--;
                this.updateCharacter({
                  'modifierDeck': this.props.fullDeck,
                  'thisPerk': thisPerk,
                  'perks': newPerks,
                  'availablePerks': this.props.availablePerks + 1
                });
      }
  }

  render() {
      var checkboxes = [];
      for (var i = 1; i <= this.props.thisPerk.amount ; i++) {
         checkboxes.push(i);
         if(this.props.thisPerk.used >= i) {
           this.checked[i-1] = true;
         } else {
           this.checked[i-1] = false;
         }
       }
    return (
        <div className = 'perk'>
        <label>
        {checkboxes.map( (element, index) => {
                return (
                    <input
                      key = {index}
                      className = "perkCheckBox"
                      disabled = {this.canBeToggled(index)}
                      ref={"perk" + index}
                      type="checkbox"
                      checked = {this.checked[index]}
                      onChange={() => {this.toggle(index)}} />)
            })}
            &nbsp;
            {this.props.thisPerk.perk}
        </label>
        </div>
    );
  }
}

PerkCheck.propTypes = {
  onUpdateCharacter: PropTypes.func.isRequired,
  thisPerk: PropTypes.object.isRequired,
  selectedPerks: PropTypes.array.isRequired,
  fullDeck: PropTypes.object.isRequired,
  availablePerks: PropTypes.number.isRequired,
};

export default PerkCheck;
