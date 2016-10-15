import React, {Component} from 'react';
import AddFishForm from './AddFishForm';
import Firebase from 'firebase';
const config = {
    apiKey: "AIzaSyCO0xEevRYIA4upYniNJKjkKI4lvE-qZag",
    authDomain: "catch-of-the-day-72ad1.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-72ad1.firebaseio.com",
    storageBucket: "catch-of-the-day-72ad1.appspot.com",
    messagingSenderId: "988176006292"
  };
  Firebase.initializeApp(config);

  let auth = Firebase.auth();
  let ref = Firebase.database().ref()

export default class Inventory extends Component {
  static propTypes = {
    fishes: React.PropTypes.object.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      uid: ''
    }
  }

  componentWillUpdate() {
    let token = localStorage.getItem('token');

    if (token) {
      // auth.signInWithCustomToken(token)
      //   .then(function(result) {
      //     console.log(result);
      //   })
    }
  }

  logout() {
    auth.signOut();
    localStorage.removeItem('token');
    this.setState({
      uid: null
    })
  }

  removeFish(e, key) {
    this.props.removeFish(key);
  }

  authenticate(login) {
    let provider;
    let _this = this;

    switch (login) {
      case 'github':
        provider = new Firebase.auth.GithubAuthProvider();
        break;
      default:

    }
    auth.signInWithPopup(provider)
    .then(function(result) {
      console.log(result);
      localStorage.setItem('token', result.credential.accessToken);

      const storeRef = ref.child(_this.props.params.storeId);

      console.log(storeRef);
      storeRef.on('value', (snapshot) => {
        var data = snapshot.val() || {};

        if(!data.owner) {
          storeRef.set({
            owner: result.user.uid
          });
        }

        _this.setState({
          uid: result.user.uid,
          owner: data.owner || result.user.uid
        })
      })
    })
    .catch(function(error) {
      // An error occurred
    });
  }

  authHandler(result) {
    console.log(result);
    localStorage.setItem('token', result.credential.accessToken);

    const storeRef = ref.child(_this.props.params.storeId);

    console.log(storeRef);
    storeRef.on('value', (snapshot) => {
      var data = snapshot.val() || {};

      if(!data.owner) {
        storeRef.set({
          owner: result.user.uid
        });
      }

      this.setState({
        uid: result.user.uid,
        owner: data.owner || result.user.uid
      })
    })
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={(e) => this.authenticate('github')}>Log in with Github</button>
      </nav>
    )
  }

  renderInventory(key) {
    var linkState = this.props.linkState;
      return (
        <div className="fish-edit" key={key}>
          <input type="text" valueLink={linkState('fishes.' + key + '.name')} />
          <input type="text" valueLink={linkState('fishes.' + key + '.price')} />
          <select name="" id="" valueLink={linkState('fishes.' + key + '.status')}>
            <option value="unavailable">Sold Out!</option>
            <option value="available">Fresh!</option>
          </select>
          <textarea valueLink={linkState('fishes.' + key + '.desc')}></textarea>
          <input valueLink={linkState('fishes.' + key + '.image')} />
          <button onClick={(e) => this.removeFish(e, key)}>Remove Fish</button>
        </div>
      )
  }

  render() {
    let logoutButton = <button onClick={this.logout}>Log Out</button>;
    if (!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      );
    }

    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store!</p>
          {logoutButton}
        </div>
      )
    }
    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
};
