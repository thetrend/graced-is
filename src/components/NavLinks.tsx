import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { GetPagesQuery } from '../gql'
import { Page } from '../gql/generated/graphql'

function NavLinks() {
  const { data, loading } = useQuery(GetPagesQuery)

  return (
    !loading && (
      <ul>
        <li className="inline-block">
          <Link to="/">Home</Link>
        </li>
        {data.pages.map((page: Page) => (
          <li className="inline-block ml-4" key={page.id}>
            <Link to={`/page/${page.slug}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    )
  )
}

export default NavLinks
