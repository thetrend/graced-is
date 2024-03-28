import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { GetPostQuery } from '../gql'
import NotFound from './NotFound'
import { Post } from '../gql/generated/graphql'
import { RelativeDate } from '../components/Helpers'

function BlogPost() {
  const { slug } = useParams()
  const { data, loading } = useQuery(GetPostQuery, {
    variables: { slug },
  })

  if (!loading && data) {
    const { post }: { post: Post } = data

    if (!post) {
      return (
        <div className="prose">
          <NotFound />
        </div>
      )
    }

    return (
      post && (
        <div className="prose">
          <h1>{post.title}</h1>
          {post.subtitle && <h2>{post.subtitle}</h2>}
          <RichText
            content={post.content.json}
            references={post.content.references}
          />
          <em>
            Last Updated: <RelativeDate date={post.updatedAt} />
          </em>
        </div>
      )
    )
  }
}

export default BlogPost
