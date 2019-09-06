import * as React from 'react'

const Point = React.lazy(() => import(/* webpackChunkName: "Point" */ './pages/Point'))

export const routes = [
  {
    key: 'point',
    exact: true,
    component: (props: any) => <Point {...props} />,
    path: '/point',
  },
]
