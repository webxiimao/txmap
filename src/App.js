import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import Marker from './views/Marker/Marker'
import GraphicsEditing from "./views/GraphicsEditing/GraphicsEditing"
import Direction from "./views/Direction/Direction"
import PointLayout from "./views/PointLayout/PointLayout"
import ArcLayout from "./views/ArcLayout/ArcLayout"
import TrailLayout from "./views/TrailLayout/TrailLayout"
import HeatLayout from "./views/HeatLayout/HeatLayout"
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
            <Padding />
            <Link to="/pointLayout">散点图</Link>
            <Padding />
            <Link to="/arcLayout">弧线图</Link>
            <Padding />
            <Link to="/trailLayout">轨迹图</Link>
            <Padding />
            <Link to="/heatLayout">热力图</Link>
          </div>
          <hr/>
            <div>
              <Route path="/" exact component={Marker}></Route>
              <Route path="/graphicsEditing" exact component={GraphicsEditing}></Route>
              <Route path="/direction" exact component={Direction}></Route>
              <Route path="/pointLayout" exact component={PointLayout}></Route>
              <Route path="/arcLayout" exact component={ArcLayout}></Route>
              <Route path="/trailLayout" exact component={TrailLayout}></Route>
              <Route path="/heatLayout" exact component={HeatLayout}></Route>
            </div>
        </div>
      </Router>
    );
  }
}

export default App;