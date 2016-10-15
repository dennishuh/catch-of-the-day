import React, {Component} from 'react';
import Rebase from 're-base';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import SampleFishes from '../sample-fishes.js';
import h from '../helpers';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

let base = Rebase.createClass('https://catch-of-the-day-72ad1.firebaseio.com/');

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {}
    }

    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.renderFish = this.renderFish.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
  }

  componentDidMount() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });

    let localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    let timestamp = (new Date()).getTime();
    this.state.fishes['fish-' + timestamp] = fish;
    this.setState({
      fishes: this.state.fishes
    })
  }

  removeFish(key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;

      this.setState({
        fishes: this.state.fishes
      })
    }
  }

  loadSamples() {
    let sampleFishes = SampleFishes;
    let newFishes = Object.assign({}, this.state.fishes, sampleFishes);
    this.setState({
      fishes: newFishes
    })
  }

  renderFish(key) {
    return (
      <Fish
        key={key}
        index={key}
        details={this.state.fishes[key]}
        addToOrder={this.addToOrder}
      />
    )
  }

  addToOrder(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({
      order: this.state.order
    })
  }

  removeFromOrder(e, key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    })
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          linkState={this.linkState}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          fishes={this.state.fishes}
          addFish={this.addFish}
          loadSamples={this.loadSamples}
          removeFish={this.removeFish}
          linkState={this.linkState.bind(this)}
          {...this.props}
        />
      </div>
    );
  }
};


reactMixin.onClass(App, Catalyst.LinkedStateMixin);
