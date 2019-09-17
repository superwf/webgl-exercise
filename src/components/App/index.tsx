import * as React from 'react'
import { History } from 'history'
import { Router } from 'react-router-dom'
import logo from 'assets/logo.svg'
import { RouteProps } from 'react-router'

import { TransitionRoute } from 'components/TransitionRoute'
import { Nav } from 'components/Nav'
import s from './style.module.less'

interface IProps {
  routes: RouteProps[]
  history: History
}

const App: React.FC<IProps> = props => {
  const { routes, history } = props
  return (
    <div className={s.app}>
      <header className={s.nav}>
        <Nav />
      </header>
      <section className={s.appContent}>
        <canvas width="500p" height="500" id="canvas" className={s.canvas} />
        <Router history={history}>
          <TransitionRoute routes={routes} />
        </Router>
      </section>
    </div>
  )
}

export default App
