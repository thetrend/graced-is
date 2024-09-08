import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Layout } from './themes/primarily/components'
import { BlogPage, BlogPost, Contact, Home, NotFound } from './pages'
import { AdminLayout, AdminHome, Register } from './admin/theme/default'

const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'page/:slug',
        element: <BlogPage />,
      },
      {
        path: 'page/contact',
        element: <Contact />,
      },
      {
        path: 'post/:slug',
        element: <BlogPost />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} fallbackElement={<>Loading...</>} />
}

export default App
