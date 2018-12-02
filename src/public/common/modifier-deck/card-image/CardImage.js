import React from 'react';
import PropTypes from 'prop-types';
import "./CardImage.css";
import BlankCard from'../../../images/BlankCard.png';

class CardImage extends React.Component {

  componentDidMount() {
  }

  getCardExtras() {
      var extras = [];
      const cardExtras = [
        'Plus', 'Back', 'Zero', 'One', 'Two', 'Times', 'Minus', 'Miss',
         'Muddle', 'Poison', 'Wound',
         'Light', 'Night', 'Wind', 'Leaf',
         'Chain', 'Heal'];
      cardExtras.forEach((extra) => {
          var re = new RegExp(extra, 'i');
          if(this.props.card.match(re)) {
              extras.push(extra);
          }
      });
      if(this.props.card === 'bless') {
          extras.push('Times');
          extras.push('Two');
          extras.push('Bless');
      } else if(this.props.card === 'curse') {
          extras.push('Miss');
          extras.push('Curse');
      }
      return extras;
  }

  getCardColor() {
      if(this.props.card.match(/plusZero/i)) {
          return 'standard';
      }else if(this.props.card.match(/Plus/i)) {
          return 'positive';
      } else if(this.props.card.match(/Minus/i)) {
          return 'negative';
      } else if(this.props.card.match(/Times|Bless/i)) {
          return 'crit';
      } else if(this.props.card.match(/Miss|Curse/i)) {
          return 'miss';
      }
      return 'standard';
  }



  render() {
    var extras = [];
    this.getCardExtras().forEach(
        (type, index) => {
            extras.push(<img className = {type} src={require("../../../images/" + type + ".png")} alt={type} key = {index} />)
    });
    var cardType = this.getCardColor();
    return (
        <div className="whole-card">
          <img className = {"blank-card " + cardType} src={BlankCard} alt='Blank Card Back'/>
          {extras}
        </div>
    );
  }
}

CardImage.propTypes = {
  card: PropTypes.string.isRequired,
};

export default CardImage;
