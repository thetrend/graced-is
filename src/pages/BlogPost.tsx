import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Helmet } from 'react-helmet'
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
        <>
          <Helmet>
            <title>{post.title} &middot; graced.is</title>
            <meta
              property="og:title"
              content={`${post.title} &middot; graced.is`}
            />
            <meta
              name="description"
              content={post.subtitle ?? 'A blog post from Grace de la Mora'}
            />
            <meta
              property="og:description"
              content={post.subtitle ?? 'A blog post from Grace de la Mora'}
            />
          </Helmet>
          <article className="prose pb-10">
            <h1>{post.title}</h1>
            <RichText
              content={post.content.json}
              references={post.content.references}
            />
            <em>
              Last Updated: <RelativeDate date={post.updatedAt} />
            </em>
          </article>
          {/* <Comments post={post} /> */}
        </>
      )
    )
  }
}

export default BlogPost
