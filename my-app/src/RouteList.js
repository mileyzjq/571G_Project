import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    HashRouter
  } from 'react-router-dom';
import Map from './Map';
import About from './About';

class RouteList extends Component {
  render() {
    return (
      <div>
        <h2>hello world</h2>
        <HashRouter>
          <div>
            <ul>
              <li><Link to="/map">Map</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
            <hr/>
            <Route exact path="/#/about" component={About}/>
            <Route exact path="/#/map" component={Map}/>
          </div>
        </HashRouter>
      </div>
    );
  }
}
 
export default RouteList;
