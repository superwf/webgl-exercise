import * as React from 'react'

const Point = React.lazy(() => import(/* webpackChunkName: "Point" */ './pages/Point'))
const Points = React.lazy(() => import(/* webpackChunkName: "Points" */ './pages/Points'))

export const routes = [
  {
    key: '1 point',
    exact: true,
    component: (props: any) => <Point {...props} />,
    path: '/point',
  },
  {
    key: '3 points',
    exact: true,
    component: (props: any) => <Points {...props} />,
    path: '/points',
  },
]
