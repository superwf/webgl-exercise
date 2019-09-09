import * as React from 'react'
import { history } from 'src/history'
import { routes } from 'src/routes'
import s from './style.module.less'

const routeTo = (e: React.MouseEvent) => {
  e.preventDefault()
  const a = e.target as HTMLAnchorElement
  const path = a.getAttribute('href') as string
  history.push(path)
}

export const Nav = () => {
  return (
    <nav className={s.nav}>
      {routes.map(route => {
        return (
          <a className={s.link} key={route.key} href={route.path} onClick={routeTo}>
            {route.key}
          </a>
        )
      })}
    </nav>
  )
}
