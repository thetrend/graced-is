import { useQuery } from '@apollo/client'
import { DateTime } from 'luxon'
import Markdown from 'react-markdown'
import { Comment, Post } from '../../../gql/generated/graphql'
import { GetPostCommentsQuery } from '../../../gql/Comments'

function SingleComment({ comment }: { comment: Comment }) {
  return (
    <div key={comment.id} className="pb-6">
      <span className="block">
        <em>{comment.name}</em> wrote on{' '}
        {DateTime.fromISO(comment.createdAt).toLocaleString(
          DateTime.DATETIME_FULL
        )}
        :
      </span>
      <Markdown>{comment.comment}</Markdown>
    </div>
  )
}

function PostComments({ post }: { post: Post }) {
  const { data, loading } = useQuery(GetPostCommentsQuery, {
    variables: { slug: post.slug },
  })

  return (
    !loading &&
    data && (
      <div className="prose">
        <h4>Comments</h4>
        {data.comments.map((comment: Comment) => (
          <SingleComment comment={comment} />
        ))}
      </div>
    )
  )
}

export default PostComments
