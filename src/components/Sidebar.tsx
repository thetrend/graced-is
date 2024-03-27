import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { GetCategoriesQuery, GetTagsQuery } from '../gql'
import {
  Category,
  GetCategoryPostCountDocument,
  Tag,
} from '../gql/generated/graphql'

function CountCategoryPosts({ slug }: { slug: string }) {
  const { data, loading } = useQuery(GetCategoryPostCountDocument, {
    variables: { slug },
  })
  const count = data?.categoriesConnection?.aggregate?.count
  return !loading && <>({count ?? 0})</>
}

function Sidebar() {
  const { data: catData, loading: catLoading } = useQuery(GetCategoriesQuery)
  const { data: tagData, loading: tagLoading } = useQuery(GetTagsQuery)

  return (
    <div className="prose flex flex-col flex-shrink w-full md:w-1/4 bg-[#f7f2f7] border-t md:border-l shadow p-6 min-0 justify-end md:justify-between">
      <section>
        <h4>Categories</h4>
        {!catLoading && catData && (
          <ul>
            {catData.categories.map((category: Category) => (
              <li key={category.id}>
                <Link to={`/categories/${category.slug}`}>
                  {category.title} <CountCategoryPosts slug={category.slug} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h4>Tags</h4>
        {!tagLoading && tagData && (
          <ul>
            {tagData.tags.map((tag: Tag) => (
              <li key={tag.id}>
                <Link to={`/tags/${tag.slug}`}>{tag.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h4>Currently</h4>
      </section>
      <section>
        <h4>Thoughts</h4>
      </section>
      <section>
        &copy; 2022-2024, Grace de la Mora. Opinions expressed are my own and do
        not reflect those of my employer or anyone associated with me, unless
        explicitly stated.
      </section>
    </div>
  )
}

export default Sidebar
