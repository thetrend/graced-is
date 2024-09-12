import Register from './Register'

function Home() {
  const authenticated = isAuthenticated()

  return authenticated ? <>DASHBOARD</> : <Register />
}

export default Home
