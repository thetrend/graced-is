import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { GetPagesQuery } from '../gql'
import { Page } from '../gql/generated/graphql'

function NavLinks() {
  const { data, loading } = useQuery(GetPagesQuery)

  return (
    !loading && (
      <ul className="side-nav md:mt-0 mt-20">
        <Link to="/">
          <li>Home</li>
        </Link>
        {data.pages.map((page: Page) => (
          <Link to={`/page/${page.slug}`} key={page.id}>
            <li>{page.title}</li>
          </Link>
        ))}
        <Link to="/contact">
          <li>Contact</li>
        </Link>
      </ul>
    )
  )
}

export default NavLinks
