import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import tw from 'twin.macro'

const StyledAdminApp = styled.div`
  ${tw`
    w-full
    min-h-screen
    p-2
    flex
    flex-col
    items-center
    justify-center
    bg-neutral
  `}
`

function Layout() {
  return (
    <>
      <Helmet>
        <title>Admin Panel</title>
        <meta name="description" content="graced.is admin backend" />
        <meta name="author" content="Grace de la Mora" />
      </Helmet>
      <StyledAdminApp>
        <h1 className="text-2xl font-bold pb-6">Admin Panel</h1>
        <Outlet />
      </StyledAdminApp>
    </>
  )
}

export default Layout
