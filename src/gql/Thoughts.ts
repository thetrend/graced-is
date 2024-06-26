import { gql } from '@apollo/client'

const ThoughtFields = gql`
  fragment ThoughtFields on Thought {
    content
    updatedAt
  }
`

const GetThoughtQuery = gql`
  query getThoughts {
    thoughts(last: 1, stage: PUBLISHED) {
      ...ThoughtFields
    }
  }
  ${ThoughtFields}
`

export { ThoughtFields, GetThoughtQuery }
