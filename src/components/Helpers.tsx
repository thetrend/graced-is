import { DateTime } from 'luxon'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Link } from 'react-router-dom'
import { Category, Post, Scalars, Tag } from '../gql/generated/graphql'

function RelativeDate({ date }: { date: Scalars['DateTime']['output'] }) {
  return <>{DateTime.fromISO(date).toRelativeCalendar()}</>
}

function PostCategoriesMap({ categories }: { categories: Category[] }) {
  return categories.map((category: Category) => (
    <span key={category.id}>{category.title}</span>
  ))
}

function PostTagsMap({ tags }: { tags: Tag[] }) {
  return tags.map((tag: Tag) => (
    <Link to={`/tags/${tag.slug}`} key={tag.id}>
      {tag.title}
    </Link>
  ))
}

function PostSnippet({ post }: { post: Post }) {
  return (
    <div className="prose" key={post.id}>
      <h3>
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h3>
      <h4>
        {post.subtitle} Published: <RelativeDate date={post.publishedAt} />
      </h4>
      <h5>
        Filed under: <PostCategoriesMap categories={post.categories} />
      </h5>
      <h6>
        Tags: <PostTagsMap tags={post.tags} />
      </h6>
      <RichText
        content={post.content.json}
        references={post.content.references}
      />
    </div>
  )
}

export { RelativeDate, PostSnippet }
