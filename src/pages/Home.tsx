import { useQuery } from '@apollo/client'
import { GetPostsQuery } from '../gql'
import { Post } from '../gql/generated/graphql'
import { PostSnippet } from '../utils/Helpers'

function Home() {
  const { data, loading } = useQuery(GetPostsQuery)
  return !loading && data.posts.map((post: Post) => <PostSnippet post={post} />)
}

export default Home
