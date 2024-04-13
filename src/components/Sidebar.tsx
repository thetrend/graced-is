import { useQuery } from '@apollo/client'
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
import { Fragment } from 'react'
import { CurrentlyPost } from '../gql/generated/graphql'
import { GetCurrentlyPostsQuery } from '../gql/CurrentlyPosts'

function Sidebar() {
  const { data: currentlyData, loading: currentlyLoading } = useQuery(
    GetCurrentlyPostsQuery
  )

  return (
    <div className="flex md:flex-row justify-evenly flex-col">
      <section className="prose w-full bg-[#ffdc99] hover:bg-[#ffbf47] text-black p-6 rounded-md">
        <h4>Currently</h4>
        {!currentlyLoading && currentlyData && (
          <>
            {currentlyData.currentlyPosts.map((currently: CurrentlyPost) => (
              <Fragment key={currently.updatedAt}>
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
              </Fragment>
            ))}
          </>
        )}
      </section>
      <section className="prose w-full bg-[#8ecaf6] hover:bg-[#54aff1] text-black p-6 rounded-md">
        <h4>Thoughts</h4>
      </section>
    </div>
  )
}

export default Sidebar
