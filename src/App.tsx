import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AdminHome, AdminLayout, Register } from './admin/theme/default'

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
])

function App() {
  return <RouterProvider router={router} fallbackElement={<>Loading...</>} />
}

export default App
