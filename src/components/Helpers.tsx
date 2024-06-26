import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDay,
  faFolderOpen,
  faTags,
} from '@fortawesome/free-solid-svg-icons'
import { Category, Post, Scalars, Tag } from '../gql/generated/graphql'

function RelativeDate({ date }: { date: Scalars['DateTime']['output'] }) {
  return <>{DateTime.fromISO(date).toRelativeCalendar()}</>
}

function PostCategoriesMap({ categories }: { categories: Category[] }) {
  return categories.map((category: Category) => (
    // <Link to={`/categories/${category.slug}`} key={category.id}>
    //   {category.title}
    // </Link>
    <strong key={category.id}>{category.title}</strong>
  ))
}

function PostTagsMap({ tags }: { tags: Tag[] }) {
  return tags.map((tag: Tag) => (
    // <Link to={`/tags/${tag.slug}`} key={tag.id}>
    //   {tag.title}
    // </Link>
    <strong key={tag.id}>{tag.title}</strong>
  ))
}

function PostSnippet({ post }: { post: Post }) {
  return (
    <div className="prose pb-10" key={post.id}>
      <h2>
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h2>
      <p>{post.subtitle}</p>
      <span>
        <FontAwesomeIcon icon={faCalendarDay} className="pr-2" />
        Posted: <RelativeDate date={post.publishedAt} />
      </span>
      <span>
        <FontAwesomeIcon icon={faFolderOpen} className="px-2" />
        Filed under: <PostCategoriesMap categories={post.categories} />
        <FontAwesomeIcon icon={faTags} className="px-2" />
        Tags: <PostTagsMap tags={post.tags} />
        {/* <FontAwesomeIcon icon={faComment} className="px-2" />
        Comments (0) */}
      </span>
    </div>
  )
}

export { RelativeDate, PostSnippet }
