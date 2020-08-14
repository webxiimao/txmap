import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import Marker from './views/Marker/Marker'
import GraphicsEditing from "./views/GraphicsEditing/GraphicsEditing"
import Direction from "./views/Direction/Direction"
import 'bootstrap/dist/css/bootstrap.min.css';
import Padding from '@/components/Padding'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div style={{ background: '#fff' }}>
            <Link to="/">点标记</Link>
            <Padding />
            <Link to="/graphicsEditing">图形绘制</Link>
            <Padding />
            <Link to="/direction">路线规划</Link>
          </div>
          <hr/>
            <div>
              <Route path="/" exact component={Marker}></Route>
              <Route path="/graphicsEditing" exact component={GraphicsEditing}></Route>
              <Route path="/direction" exact component={Direction}></Route>
            </div>
        </div>
      </Router>
    );
  }
}

export default App;