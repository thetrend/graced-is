import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { DateTime } from 'luxon'
import { GetPostQuery } from '../gql'
import NotFound from './NotFound'
import { Post } from '../gql/generated/graphql'

function BlogPost() {
  const { slug } = useParams()
  const { data, loading } = useQuery(GetPostQuery, {
    variables: { slug },
  })

  if (!loading && data) {
    const { post }: { post: Post } = data

    if (!post) {
      return <NotFound />
    }

    return (
      post && (
        <>
          <h1>{post.title}</h1>
          {post.subtitle && <h2>{post.subtitle}</h2>}
          <RichText
            content={post.content.json}
            references={post.content.references}
          />
          <em>
            Last Updated:{' '}
            {DateTime.fromISO(post.updatedAt).toRelativeCalendar()}
          </em>
        </>
      )
    )
  }
}

export default BlogPost
