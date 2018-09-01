import React, { Component } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import routes from './routes/';

import './App.css';

import Header from './components/header';
import IdentityProvider from './ContextProvider';

const hist = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <IdentityProvider>
        <Router history={hist}>
          <div className="App">
            <Header />

            <Switch>
              {routes.map((prop, key) => {
                if (prop.redirect) return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
                if (prop.collapse)
                  // eslint-disable-next-line
                  return prop.views.map((prop, key) => (
                    <Route path={prop.path} component={prop.component} key={key} />
                  ));
                return <Route path={prop.path} component={prop.component} key={key} />;
              })}
            </Switch>
          </div>
        </Router>
      </IdentityProvider>
    );
  }
}

export default App;
