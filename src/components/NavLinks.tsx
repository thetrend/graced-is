import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { GetPagesQuery } from '../gql'
import { Page } from '../gql/generated/graphql'

function NavLinks() {
  const { data, loading } = useQuery(GetPagesQuery)
  // const { data: catData, loading: catLoading } = useQuery(GetCategoriesQuery)

  return (
    !loading && (
      <menu className="side-nav md:mt-0 mt-20">
        <Link to="/">Home</Link>
        {data.pages.map((page: Page) => (
          <Link to={`/page/${page.slug}`} key={page.id}>
            {page.title}
          </Link>
        ))}
        {/* {!catLoading &&
          catData &&
          catData.categories.map((category: Category) => (
            <Link to={`/categories/${category.slug}`}>{category.title}</Link>
          ))}
        <Link to="/tags/">Tags</Link> */}
        {/* <Link to="/page/contact">Contact</Link> */}
      </menu>
    )
  )
}

export default NavLinks
