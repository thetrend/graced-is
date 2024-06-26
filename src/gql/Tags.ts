import { gql } from '@apollo/client'

const TagFields = gql`
  fragment TagFields on Tag {
    id
    title
    slug
  }
`

const GetTagsQuery = gql`
  query GetTags {
    tags(stage: PUBLISHED) {
      ...TagFields
    }
  }
  ${TagFields}
`
export { TagFields, GetTagsQuery }
