import { gql } from '@apollo/client'

const CategoryFields = gql`
  fragment CategoryFields on Category {
    id
    title
    slug
  }
`

// eslint-disable-next-line import/prefer-default-export
export { CategoryFields }
