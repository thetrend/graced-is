import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'
import logo from '../assets/icon.svg'
import Drawer from './Drawer'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <>
      <Helmet>
        <title>grace d. is</title>
        <meta
          name="description"
          content="The personal blog of Grace de la Mora"
        />
        <meta
          name="keywords"
          content="programming, blogging, lifestyle, writing"
        />
        <meta name="author" content="Grace de la Mora" />
      </Helmet>

      <div className="flex flex-col w-screen lg:flex-row lg:justify-between lg:justify-items-stretch">
        <Drawer />
        <div className="p-6 w-full flex flex-col justify-evenly">
          <header className="px-6 text-5xl font-bold self-start">
            <img
              src={logo}
              alt="graced.is logo"
              style={{ height: '6vh', display: 'inline' }}
              className="pr-6"
            />
            grace <span className="text-[#d81159]">d.</span> is
            <small className="font-normal text-2xl pl-10">
              a personal blog
            </small>
          </header>
          <div className="mx-auto md:w-5/6 flex-grow mt-4 md:mt-12 md:min-h-auto">
            <Outlet />
          </div>
          <Sidebar />
          <section className="text-center pt-20">
            &copy; 2022-2024, Grace de la Mora. Opinions expressed are my own,
            unless explicitly stated.
          </section>
        </div>
      </div>
    </>
  )
}

export default Layout
