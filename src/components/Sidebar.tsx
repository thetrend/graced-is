import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faCalendar,
  faClock,
  faCloud,
  faFilm,
  faGamepad,
  faGlassWater,
  faLocationDot,
  faMasksTheater,
  faMusic,
  faPuzzlePiece,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons'
import { DateTime } from 'luxon'
import { GetCategoriesQuery, GetTagsQuery } from '../gql'
import {
  Category,
  CurrentlyPost,
  GetCategoryPostCountDocument,
  Tag,
} from '../gql/generated/graphql'
import { GetCurrentlyPostsQuery } from '../gql/CurrentlyPosts'

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
  const { data: currentlyData, loading: currentlyLoading } = useQuery(
    GetCurrentlyPostsQuery
  )

  return (
    <div className="prose flex flex-col flex-shrink w-full md:w-2/5 bg-[#f7f2f7] border-t md:border-l shadow p-6 min-0 justify-end md:justify-between">
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
        {!currentlyLoading && currentlyData && (
          <>
            {currentlyData.currentlyPosts.map((currently: CurrentlyPost) => (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <span title="Time">
                    <FontAwesomeIcon icon={faClock} className="pr-2" />
                    {DateTime.fromISO(currently.updatedAt).toLocaleString(
                      DateTime.TIME_SIMPLE
                    )}
                  </span>
                  <span title="Date">
                    <FontAwesomeIcon icon={faCalendar} className="pr-2" />
                    {DateTime.fromISO(currently.updatedAt).toFormat(
                      'ccc LLL d'
                    )}
                  </span>
                  {currently.location && (
                    <span title="Location">
                      <FontAwesomeIcon icon={faLocationDot} className="pr-2" />
                      {currently.location}
                    </span>
                  )}
                  {currently.weather && (
                    <span title="Weather">
                      <FontAwesomeIcon icon={faCloud} className="pr-2" />
                      {currently.weather}
                    </span>
                  )}
                  {currently.eating && (
                    <span title="Eating">
                      <FontAwesomeIcon icon={faUtensils} className="pr-2" />
                      {currently.eating}
                    </span>
                  )}
                  {currently.drinking && (
                    <span title="Drinking">
                      <FontAwesomeIcon icon={faGlassWater} className="pr-2" />
                      {currently.drinking}
                    </span>
                  )}
                  {currently.doing && (
                    <span title="Doing">
                      <FontAwesomeIcon icon={faPuzzlePiece} className="pr-2" />
                      {currently.doing}
                    </span>
                  )}
                  {currently.feeling && (
                    <span title="Feeling">
                      <FontAwesomeIcon icon={faMasksTheater} className="pr-2" />
                      {currently.feeling}
                    </span>
                  )}
                </div>
                {(currently.listening ||
                  currently.watching ||
                  currently.reading) && (
                  <div className="grid grid-cols-1 pt-4">
                    {currently.listening && (
                      <span title="Listening to">
                        <FontAwesomeIcon icon={faMusic} className="pr-2" />
                        {currently.listening}
                      </span>
                    )}
                    {currently.watching && (
                      <span title="Watching">
                        <FontAwesomeIcon icon={faFilm} className="pr-2" />
                        {currently.watching}
                      </span>
                    )}
                    {currently.reading && (
                      <span title="Reading">
                        <FontAwesomeIcon icon={faBookOpen} className="pr-2" />
                        {currently.reading}
                      </span>
                    )}
                    {currently.gaming && (
                      <span title="Playing">
                        <FontAwesomeIcon icon={faGamepad} className="pr-2" />
                        {currently.gaming}
                      </span>
                    )}
                  </div>
                )}
              </>
            ))}
          </>
        )}
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
