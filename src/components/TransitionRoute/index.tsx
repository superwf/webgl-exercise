import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { RouteProps } from 'react-router'

import s from './style.m.less'

interface IProps {
  routes: RouteProps[]
}

const Loading = () => <div>Loading ... </div>

const TransitionRouteComponent = (props: IProps) => {
  const { routes } = props
  return (
    <TransitionGroup className={s.wrapper}>
      <CSSTransition key={window.location.pathname} classNames="route" timeout={300}>
        <Suspense fallback={<Loading />}>
          <Switch>
            {routes.map(r => (
              <Route {...r} />
            ))}
            <Route component={() => <div>nav manus in the header</div>} />
          </Switch>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  )
}

export const TransitionRoute = TransitionRouteComponent
