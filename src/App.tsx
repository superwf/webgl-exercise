import * as React from 'react';
import { History } from 'history'
import { Router } from 'react-router-dom'
import logo from './logo.svg';
import { RouteProps } from 'react-router'

import { TransitionRoute } from './TransitionRoute'
import { Nav } from './Nav'
import './App.css';
import s from './App.module.less'

interface IProps {
  routes: RouteProps[]
  history: History
}

const App: React.FC<IProps> = (props) => {
  const { routes, history } = props
  return (
    <div className="App">
      <header className={s.nav}>
        <Nav />
      </header>
      <section className="App-header">
        <canvas id="canvas" />
        <Router history={history}>
          <TransitionRoute routes={routes} />
        </Router>
      </section>
    </div>
  );
}

export default App;
