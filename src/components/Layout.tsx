import { Outlet } from 'react-router-dom'
import NavLinks from './NavLinks'

function Layout() {
  return (
    <>
      <NavLinks />
      <div className="prose">
        <Outlet />
      </div>
    </>
  )
}

export default Layout
