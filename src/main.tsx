import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import ReactGA from 'react-ga4'

import App from './App'
import client from './ApolloClient'

import './styles/global.css'

ReactGA.initialize(import.meta.env.VITE_GA_ID)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
)
