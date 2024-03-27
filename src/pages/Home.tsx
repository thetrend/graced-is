import { useQuery } from '@apollo/client'
import { DateTime } from 'luxon'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Link } from 'react-router-dom'
import { GetPostsQuery } from '../gql'
import { Category, Post, Tag } from '../gql/generated/graphql'

function Home() {
  const { data, loading } = useQuery(GetPostsQuery)

  return (
    !loading &&
    data.posts.map((post: Post) => (
      <div className="prose" key={post.id}>
        <h3>
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>
        <h4>
          {post.subtitle} Published:{' '}
          {DateTime.fromISO(post.publishedAt).toRelativeCalendar()}
        </h4>
        <h5>
          Filed under:{' '}
          {post.categories.map((category: Category) => (
            <span key={category.id}>{category.title}</span>
          ))}
        </h5>
        <h6>
          Tags:{' '}
          {post.tags.map((tag: Tag) => (
            <span key={tag.id}>{tag.title}</span>
          ))}
        </h6>
        <RichText
          content={post.content.json}
          references={post.content.references}
        />
      </div>
    ))
  )
}

export default Home
