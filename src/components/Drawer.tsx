import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faLinkedin,
  faSpotify,
} from '@fortawesome/free-brands-svg-icons'
import NavLinks from './NavLinks'

// function CountCategoryPosts({ slug }: { slug: string }) {
//   const { data, loading } = useQuery(GetCategoryPostCountDocument, {
//     variables: { slug },
//   })
//   const count = data?.categoriesConnection?.aggregate?.count
//   return !loading && <>({count ?? 0})</>
// }

function Drawer() {
  return (
    <aside className="drawer">
      <NavLinks />
      <div className="flex flex-row px-6 justify-around">
        <a
          href="https://linkedin.com/in/thetrend"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          target="_blank"
        >
          <FontAwesomeIcon size="2x" icon={faLinkedin} />
        </a>
        <a
          href="https://github.com/thetrend"
          rel="noopener noreferrer"
          aria-label="Github"
          target="_blank"
        >
          <FontAwesomeIcon size="2x" icon={faGithub} />
        </a>
        <a
          href="https://open.spotify.com/playlist/148pHWD3SgVHytpp49oudQ?si=aAXtpGQlR3SLhAbbIir0Tg&pi=u-0-q7x9cCTWeL"
          rel="noopener noreferrer"
          aria-label="Spotify"
          target="_blank"
        >
          <FontAwesomeIcon size="2x" icon={faSpotify} />
        </a>
      </div>
    </aside>
  )
}

export default Drawer
