import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { DateTime } from 'luxon'
import { GetPageQuery } from '../gql'
import { Page } from '../gql/generated/graphql'
import NotFound from './NotFound'

function BlogPage() {
  const { slug } = useParams()
  const { data, loading } = useQuery(GetPageQuery, {
    variables: { slug },
  })

  if (!loading && data) {
    const { page }: { page: Page } = data

    if (!page) {
      return <NotFound />
    }

    return (
      page && (
        <div className="prose">
          <h1>{page.title}</h1>
          {page.subtitle && <h2>{page.subtitle}</h2>}
          <RichText
            content={page.content.json}
            references={page.content.references}
          />
          <em>
            Last Updated:{' '}
            {DateTime.fromISO(page.updatedAt).toRelativeCalendar()}
          </em>
        </div>
      )
    )
  }
}

export default BlogPage
