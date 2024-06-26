import { gql } from '@apollo/client'

const CurrentlyFields = gql`
  fragment CurrentlyFields on CurrentlyPost {
    doing
    drinking
    eating
    feeling
    gaming
    listening
    location
    reading
    watching
    weather
    updatedAt
  }
`

const GetCurrentlyPostsQuery = gql`
  query GetCurrentlyPosts {
    currentlyPosts(last: 1) {
      ...CurrentlyFields
    }
  }
  ${CurrentlyFields}
`

// eslint-disable-next-line import/prefer-default-export
export { GetCurrentlyPostsQuery }
