import { Outlet } from 'react-router-dom'
import NavLinks from './NavLinks'
import siteBanner from '../assets/site.svg'
import siteHeader from '../assets/siteheader.png'

function Layout() {
  return (
    <>
      <div className="inline-flex p-10">
        <img
          src={siteHeader}
          style={{ minHeight: '60px', maxHeight: '300px' }}
          alt="Laptop, stylus, and makeup brush"
        />
        <img
          src={siteBanner}
          style={{ height: '100px' }}
          className="ml-10"
          alt="grace d. is"
        />
      </div>
      <NavLinks />
      <div className="prose">
        <Outlet />
      </div>
    </>
  )
}

export default Layout
