import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import Home from './views/Home'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Link to="/">Home</Link>
          <hr/>
          <Route path="/" exact component={Home}></Route>
        </div>
      </Router>
    );
  }
}

export default App;