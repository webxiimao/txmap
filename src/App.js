import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import Marker from './views/Marker/Marker'
import 'bootstrap/dist/css/bootstrap.min.css';
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Link to="/">点标记</Link>
          <hr/>
            <div>
              <Route path="/" exact component={Marker}></Route>
            </div>
        </div>
      </Router>
    );
  }
}

export default App;