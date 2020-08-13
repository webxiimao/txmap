import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import Marker from './views/Marker'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Link to="/">点标记</Link>
          <hr/>
          <Route path="/" exact component={Marker}></Route>
        </div>
      </Router>
    );
  }
}

export default App;