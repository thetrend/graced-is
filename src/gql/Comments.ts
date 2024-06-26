import { gql } from '@apollo/client'

const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    name
    email
    comment
    private
    updatedAt
    createdAt
  }
`

const GetPostCommentsQuery = gql`
  query PostCommentsQuery($slug: String!) {
    comments(where: { post: { slug: $slug } }, stage: PUBLISHED) {
      ...CommentFields
    }
  }

  ${CommentFields}
`

export { CommentFields, GetPostCommentsQuery }
