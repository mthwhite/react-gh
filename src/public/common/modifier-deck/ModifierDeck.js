import React from 'react';
import {
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import CardImage from "./card-image/CardImage";
import "./ModifierDeck.css";

class ModifierDeck extends React.Component {
    updateCharacter(a) {
       return this.props.onUpdateCharacter(a);
    }

  addToFullDeck(card, change) {
      if(this.props.fullDeck[card] === undefined) {
          this.props.fullDeck[card] = change;
      } else {
        this.props.fullDeck[card] += change;
      }
      this.updateCharacter({
        'modifierDeck': this.props.fullDeck
      });
  }

  addToPartialDeck(card, change) {
      for(var j = 0;j < change;j++) {
         this.props.shuffledDeck.push(card);
      }
      this.shufflePartialDeck();
  }

  addToLastDraw(card) {
    var thisDraw = this.props.lastDraw;
    thisDraw.unshift(card);
    this.updateCharacter({
      'lastDraw': thisDraw
    });
  }

  modifyCard(card, change) {
      this.addToFullDeck(card, change);
      this.addToPartialDeck(card, change);
      this.tickCount(card, change);
  }

  tickCount(card, change) {
    if(card.match(/bless|curse/i)) {
        this[card] += change;
    }
  }

  shufflePartialDeck() {
      return this.props.shuffle(this.props.shuffledDeck);
  }

  shuffleButtonElement = (this.props.promptToShuffle)? this.shuffleButton() : "";

  shuffleButton() {
      return (<Button bsSize="lg" bsStyle="danger" onClick={() => {this.shuffleButtonPress()}}>End Round and Shuffle</Button>)
  }

  shuffleButtonPress() {
      this.props.shuffleDeck();
      this.shuffleButtonElement = "";
      this.addToLastDraw('~~Deck Shuffled~~');
  }

  createCard(cardName) {
      return (cardName)
  }

  loadCard(cardType) {
    return cardType;
  }

  handleCardEffects(card) {
    if(card.remove) {
      this.addToFullDeck(card.name, -1);
      this.tickCount(card.name, -1);
    }
    if(card.shuffle) {
      this.updateCharacter({
        'promptToShuffle': true,
      });
      this.shuffleButtonElement = this.shuffleButton();
      this.addToLastDraw('~~Shuffle at end of round~~');
    }
  }

  handleChain(cards) {
    var chain = 1;
    cards.forEach(function(card){if(!card.chain) { chain = 0 }});
    if(chain) {
      this.drawCards('normal');
    }
  }

  putLastDrawInDiscard() {
    var discard = this.props.discard;
    this.props.lastDraw.slice().reverse().forEach(function(card) {
      discard.unshift(card);
    });
    this.updateCharacter({
      'discard': discard,
      'lastDraw': []
    });
    return 1;
  }

  drawCard() {
    var drawnCard = this.props.shuffledDeck.pop();
    this.addToLastDraw(this.createCard(drawnCard));

    if(this.props.shuffledDeck.length === 0) {
        this.addToLastDraw('~~Deck shuffled due to being out of cards~~');
        this.props.shuffleDeck();
    }

    return this.getCardData(drawnCard);
  }

  setUpDraw(type) {
    var promise = new Promise((resolve, reject) => {
        var worked = this.putLastDrawInDiscard();
          if (worked) {
            resolve(1);
          } else {
            reject(0);
          }
    });
    promise.then(response => this.drawCards(type));
  }

  drawCards(type) {
      if(type.match(/advantage/i)) {
        this.addToLastDraw('------end '+type+'------');
      }
      var cards = [];

      const card_one = this.drawCard();
      this.handleCardEffects(card_one);
      cards.push(card_one);

      if(type.match(/advantage/i)) {
        const card_two = this.drawCard();
        this.handleCardEffects(card_two);
        cards.push(card_two);
      }
      if(!type.match(/disadvantage/i)) {
        this.handleChain(cards);
      }

      if(type.match(/advantage/i)) {
        this.addToLastDraw('--------'+type+'--------');
      }
  }

  getCardData(cardName) {
    const cardData = {
      name: cardName,
      shuffle: this.getCardShuffle(cardName),
      remove: this.getCardRemove(cardName),
      chain: this.getCardChain(cardName),
    };

    return cardData;
  }

  getCardShuffle(cardName) {
      if(cardName.match(/timesTwo|Miss/i)) {
          return 1;
      }
      return 0;
  }

  getCardRemove(cardName) {
      if(cardName.match(/bless|curse/i)) {
          return 1;
      }
      return 0;
  }

  getCardChain(cardName) {
      if(cardName.match(/chain/i)) {
          return 1;
      }
      return 0;
  }

  componentDidMount() {
      if(this.props.shuffledDeck.length === 0) {
          this.props.shuffleDeck();
      }
      this.curse = this.checkDeckFor('curse');
      this.bless = this.checkDeckFor('bless');
  }

  checkDeckFor(type) {
    return this.props.fullDeck[type];
  }


  render() {
    this.curse = this.checkDeckFor('curse');
    this.bless = this.checkDeckFor('bless');
    return (
        <div className = 'modifierDeck'>
        <div className = 'additional-cards'>
            <ButtonGroup>
             <Button bsSize="lg" bsStyle="danger" onClick={() => this.modifyCard('bless', 1)}>Add Bless ({this.bless})</Button>
             <Button bsSize="lg" bsStyle="danger" onClick={() => this.modifyCard('curse', 1)}>Add Curse ({this.curse})</Button>
            </ButtonGroup>
        </div>
        <div className = 'draw-deck'>
            <CardImage card = {'cardBack'} />
            <div className = 'draw-buttons'>
                <ButtonGroup vertical>
                    <Button bsSize="small" bsStyle="danger" onClick={() => this.setUpDraw('normal')}>Draw Card</Button>
                    <Button bsSize="small" bsStyle="danger" onClick={() => this.setUpDraw('advantage')}>Draw Advantage</Button>
                    <Button bsSize="small" bsStyle="danger" onClick={() => this.setUpDraw('disadvantage')}>Draw Disadvantage</Button>
                </ButtonGroup>
            </div>
        </div>
        <div className = "shuffle-button">
            {this.shuffleButtonElement}
         </div>
         <div className = 'lastDraw'>
            Current Draw: {this.props.lastDraw.map((card, index) => {return (<div key = {index}><CardImage card = {card} /></div>)})}
         </div>
        <div className = 'discard'>
          Previous Draws:  {this.props.discard.map((card, index) => {return (<div key = {index}><CardImage card = {card} /></div>)})}
        </div>
        </div>
    );
  }
}

ModifierDeck.propTypes = {
  onUpdateCharacter: PropTypes.func.isRequired,
  lastDraw: PropTypes.array.isRequired,
  discard: PropTypes.array.isRequired,
  shuffledDeck: PropTypes.array.isRequired,
  fullDeck: PropTypes.object.isRequired,
  shuffleDeck: PropTypes.func.isRequired,
  shuffle: PropTypes.func.isRequired,
  promptToShuffle: PropTypes.bool.isRequired,
};

export default ModifierDeck;
