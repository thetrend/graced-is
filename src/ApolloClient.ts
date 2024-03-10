import { ApolloClient, InMemoryCache } from '@apollo/client'

// Initialize Apollo Client
const client = new ApolloClient({
  uri: import.meta.env.VITE_HYGRAPH_API,
  cache: new InMemoryCache(),
})

export default client
