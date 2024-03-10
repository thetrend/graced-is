import { gql } from '@apollo/client'

const TagFields = gql`
  fragment TagFields on Tag {
    id
    title
    slug
  }
`

// eslint-disable-next-line import/prefer-default-export
export { TagFields }
