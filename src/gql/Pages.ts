import { gql } from '@apollo/client'

const PageFields = gql`
  fragment PageFields on Page {
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
    navLink
  }
`

const GetPagesQuery = gql`
  query GetPages {
    pages(stage: PUBLISHED) {
      ...PageFields
    }
  }
  ${PageFields}
`

const GetPageQuery = gql`
  query GetPage($slug: String!) {
    page(where: { slug: $slug }, stage: PUBLISHED) {
      ...PageFields
    }
  }
  ${PageFields}
`

export { PageFields, GetPagesQuery, GetPageQuery }
