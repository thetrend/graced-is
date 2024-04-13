import { gql } from '@apollo/client'
import { CategoryFields } from './Categories'
import { TagFields } from './Tags'

const PostFields = gql`
  fragment PostFields on Post {
    id
    publishedAt
    updatedAt
    title
    subtitle
    content {
      references {
        ... on Asset {
          id
          url
        }
      }
      json
    }
    publishedBy {
      name
      picture
    }
    slug
    categories {
      ...CategoryFields
    }
    tags {
      ...TagFields
    }
  }
  ${CategoryFields}
  ${TagFields}
`

const GetPostsQuery = gql`
  query GetPosts {
    posts(stage: PUBLISHED, orderBy: id_DESC) {
      ...PostFields
    }
  }
  ${PostFields}
`

const GetPostQuery = gql`
  query GetPost($slug: String!) {
    post(where: { slug: $slug }, stage: PUBLISHED) {
      ...PostFields
    }
  }
  ${PostFields}
`

export { PostFields, GetPostsQuery, GetPostQuery }
