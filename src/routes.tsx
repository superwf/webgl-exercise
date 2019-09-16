import * as React from 'react'

const Point = React.lazy(() => import(/* webpackChunkName: "Point" */ './pages/Point'))
const Points = React.lazy(() => import(/* webpackChunkName: "Points" */ './pages/Points'))
const Sampler = React.lazy(() => import(/* webpackChunkName: "Sampler" */ './pages/Sampler'))
const OrthographicProjection = React.lazy(() =>
  import(/* webpackChunkName: "OrthographicProjection" */ './pages/OrthographicProjection'),
)
const PerspectiveProjection = React.lazy(() =>
  import(/* webpackChunkName: "PerspectiveProjection" */ './pages/PerspectiveProjection'),
)

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
  {
    key: 'sampler',
    exact: true,
    component: (props: any) => <Sampler {...props} />,
    path: '/sampler',
  },
  {
    key: 'Orthographic projection',
    exact: true,
    component: (props: any) => <OrthographicProjection {...props} />,
    path: '/orthographic-projection',
  },
  {
    key: 'Perspective projection',
    exact: true,
    component: (props: any) => <PerspectiveProjection {...props} />,
    path: '/perspective-projection',
  },
]
