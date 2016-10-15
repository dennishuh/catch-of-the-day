import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import h from '../helpers';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

@autobind
class StorePicker extends Component {
  constructor() {
    super();
    this.goToStore = this.goToStore.bind(this);
  }

  goToStore(e) {
    e.preventDefault();
    let storeId = this.refs.storeId.value;
    browserHistory.push('/store/' + storeId);
  }
  render() {
    // normal comments
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter a Store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="submit" value="Submit"/>
      </form>
    );
  }
};

export default StorePicker;
