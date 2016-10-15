import React, {Component} from 'react';
import h from '../helpers';

const Fish = ({index, details, addToOrder}) => {
  let isAvailable = (details.status === 'available' ? true : false);
  let buttonText = (isAvailable ? 'Add To Order' : 'Sold Out!')
  function onButtonClick() {
    addToOrder(index);
  }
  return (
    <li className="menu-fish">
      <img src={details.image} alt={details.name} />
      <h3 className="fish-name">{details.name}<span className="price">{h.formatPrice(details.price)}</span></h3>
      <p>{details.desc}</p>
      <button disabled={!isAvailable} onClick={onButtonClick}>{buttonText}</button>
    </li>
  )
}

Fish.propTypes = {
  index: React.PropTypes.string.isRequired,
  details: React.PropTypes.object.isRequired,
  addToOrder: React.PropTypes.func.isRequired
}

export default Fish;
