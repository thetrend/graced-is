import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([{}])

function App() {
  return <RouterProvider router={router} fallbackElement={<>Loading...</>} />
}

export default App
