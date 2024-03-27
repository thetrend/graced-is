import { Outlet } from 'react-router-dom'
import Drawer from './Drawer'
import Sidebar from './Sidebar'
import siteBanner from '../assets/site.svg'
import siteHeader from '../assets/siteheader.png'

function Layout() {
  return (
    <div className="flex flex-col w-screen md:flex-row justify-between justify-items-stretch">
      <Drawer />
      <div className="p-6 w-full flex-grow">
        <div className="w-full flex flex-row">
          <img
            src={siteHeader}
            alt="laptop with makeup brush, stylus"
            className="hidden md:inline md:mr-10"
            style={{ height: '10vh' }}
          />
          <img src={siteBanner} alt="grace d. is" style={{ height: '10vh' }} />
        </div>
        <div className="mx-auto md:w-5/6 mt-4 md:mt-20 min-h-screen md:min-h-auto">
          <Outlet />
        </div>
      </div>
      <Sidebar />
    </div>
  )
}

export default Layout
