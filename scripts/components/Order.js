import React, {Component} from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import h from '../helpers';


export default class Order extends Component {
  static propTypes = {
    fishes: React.PropTypes.object.isRequired,
    order: React.PropTypes.object.isRequired,
    removeFromOrder: React.PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.renderOrder = this.renderOrder.bind(this);
  }
  renderOrder(key) {
    let fish = this.props.fishes[key];
    let count = this.props.order[key];
    let removeButton = <button onClick={(e) => this.props.removeFromOrder(e, key)}>&times;</button>
    if (!fish) {
      return (
        <li key={key}>
          Sorry, fish no longer available!
          {removeButton}
        </li>
      )
    }
    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup component="span" transitionName="count" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
            <span key={count}>{count}</span>
          </CSSTransitionGroup>
           lbs
          {fish.name} {removeButton}
        </span>
        <span className="price">{h.formatPrice(count * fish.price)}</span>

      </li>
    )
  }

  render() {
    let orderIds = Object.keys(this.props.order);
    let totals = orderIds.reduce((prevTotal, key) => {
      let fish = this.props.fishes[key];
      let count = this.props.order[key];
      let isAvailable = fish && fish.status === 'available';

      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0)
    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(totals)}
          </li>
        </CSSTransitionGroup>
      </div>
    );
  }
};
