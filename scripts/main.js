import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App';




ReactDOM.render(
  (<Router history={browserHistory}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound}/>
  </Router>),
  document.getElementById('main')
);
