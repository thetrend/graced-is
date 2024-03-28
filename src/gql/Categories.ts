import { gql } from '@apollo/client'

const CategoryFields = gql`
  fragment CategoryFields on Category {
    id
    title
    slug
  }
`

const GetCategoriesQuery = gql`
  query GetCategories {
    categories(stage: PUBLISHED) {
      ...CategoryFields
    }
  }
  ${CategoryFields}
`

const GetCategoryPostCountQuery = gql`
  query GetCategoryPostCount($slug: String!) {
    categoriesConnection(
      where: { posts_every: { categories_every: { slug: $slug } } }
      stage: PUBLISHED
    ) {
      aggregate {
        count
      }
    }
  }
`

export { CategoryFields, GetCategoriesQuery, GetCategoryPostCountQuery }
