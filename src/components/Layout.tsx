import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Drawer from './Drawer'
import Sidebar from './Sidebar'
import siteBanner from '../assets/site.svg'
import siteHeader from '../assets/siteheader.webp'

function Layout() {
  return (
    <>
      <Helmet>
        <title>grace d. is</title>
        <meta name="description" content="This is a description of my page" />
        <meta name="keywords" content="react, meta tags, seo" />
        <meta name="author" content="Grace de la Mora" />
        <meta property="og:title" content="My Page Title" />
        <meta
          property="og:description"
          content="This is a description of my page"
        />
        <meta property="og:image" content="https://example.com/image.jpg" />
        <meta property="og:url" content="https://example.com/my-page" />
        <meta name="twitter:title" content="My Page Title" />
        <meta
          name="twitter:description"
          content="This is a description of my page"
        />
        <meta name="twitter:image" content="https://example.com/image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

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
            <img
              src={siteBanner}
              alt="grace d. is"
              style={{ height: '10vh' }}
              width="100%"
              height="100%"
            />
          </div>
          <div className="mx-auto md:w-5/6 mt-4 md:mt-20 min-h-screen md:min-h-auto">
            <Outlet />
          </div>
        </div>
        <Sidebar />
      </div>
    </>
  )
}

export default Layout
