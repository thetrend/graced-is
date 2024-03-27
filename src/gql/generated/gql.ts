/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  fragment CategoryFields on Category {\n    id\n    title\n    slug\n  }\n':
    types.CategoryFieldsFragmentDoc,
  '\n  query GetCategories {\n    categories(stage: PUBLISHED) {\n      ...CategoryFields\n    }\n  }\n  \n':
    types.GetCategoriesDocument,
  '\n  query GetCategoryPostCount($slug: String!) {\n    categoriesConnection(\n      where: { posts_every: { categories_every: { slug: $slug } } }\n      stage: PUBLISHED\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n':
    types.GetCategoryPostCountDocument,
  '\n  fragment PageFields on Page {\n    id\n    publishedAt\n    updatedAt\n    title\n    subtitle\n    content {\n      references {\n        ... on Asset {\n          id\n          url\n        }\n      }\n      json\n    }\n    publishedBy {\n      name\n      picture\n    }\n    slug\n    navLink\n  }\n':
    types.PageFieldsFragmentDoc,
  '\n  query GetPages {\n    pages(stage: PUBLISHED) {\n      ...PageFields\n    }\n  }\n  \n':
    types.GetPagesDocument,
  '\n  query GetPage($slug: String!) {\n    page(where: { slug: $slug }, stage: PUBLISHED) {\n      ...PageFields\n    }\n  }\n  \n':
    types.GetPageDocument,
  '\n  fragment PostFields on Post {\n    id\n    publishedAt\n    updatedAt\n    title\n    subtitle\n    content {\n      references {\n        ... on Asset {\n          id\n          url\n        }\n      }\n      json\n    }\n    publishedBy {\n      name\n      picture\n    }\n    slug\n    categories {\n      ...CategoryFields\n    }\n    tags {\n      ...TagFields\n    }\n  }\n  \n  \n':
    types.PostFieldsFragmentDoc,
  '\n  query GetPosts {\n    posts(stage: PUBLISHED) {\n      ...PostFields\n    }\n  }\n  \n':
    types.GetPostsDocument,
  '\n  query GetPost($slug: String!) {\n    post(where: { slug: $slug }, stage: PUBLISHED) {\n      ...PostFields\n    }\n  }\n  \n':
    types.GetPostDocument,
  '\n  fragment TagFields on Tag {\n    id\n    title\n    slug\n  }\n':
    types.TagFieldsFragmentDoc,
  '\n  query GetTags {\n    tags(stage: PUBLISHED) {\n      ...TagFields\n    }\n  }\n  \n':
    types.GetTagsDocument,
}

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment CategoryFields on Category {\n    id\n    title\n    slug\n  }\n'
): (typeof documents)['\n  fragment CategoryFields on Category {\n    id\n    title\n    slug\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetCategories {\n    categories(stage: PUBLISHED) {\n      ...CategoryFields\n    }\n  }\n  \n'
): (typeof documents)['\n  query GetCategories {\n    categories(stage: PUBLISHED) {\n      ...CategoryFields\n    }\n  }\n  \n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetCategoryPostCount($slug: String!) {\n    categoriesConnection(\n      where: { posts_every: { categories_every: { slug: $slug } } }\n      stage: PUBLISHED\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetCategoryPostCount($slug: String!) {\n    categoriesConnection(\n      where: { posts_every: { categories_every: { slug: $slug } } }\n      stage: PUBLISHED\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment PageFields on Page {\n    id\n    publishedAt\n    updatedAt\n    title\n    subtitle\n    content {\n      references {\n        ... on Asset {\n          id\n          url\n        }\n      }\n      json\n    }\n    publishedBy {\n      name\n      picture\n    }\n    slug\n    navLink\n  }\n'
): (typeof documents)['\n  fragment PageFields on Page {\n    id\n    publishedAt\n    updatedAt\n    title\n    subtitle\n    content {\n      references {\n        ... on Asset {\n          id\n          url\n        }\n      }\n      json\n    }\n    publishedBy {\n      name\n      picture\n    }\n    slug\n    navLink\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetPages {\n    pages(stage: PUBLISHED) {\n      ...PageFields\n    }\n  }\n  \n'
): (typeof documents)['\n  query GetPages {\n    pages(stage: PUBLISHED) {\n      ...PageFields\n    }\n  }\n  \n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetPage($slug: String!) {\n    page(where: { slug: $slug }, stage: PUBLISHED) {\n      ...PageFields\n    }\n  }\n  \n'
): (typeof documents)['\n  query GetPage($slug: String!) {\n    page(where: { slug: $slug }, stage: PUBLISHED) {\n      ...PageFields\n    }\n  }\n  \n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment PostFields on Post {\n    id\n    publishedAt\n    updatedAt\n    title\n    subtitle\n    content {\n      references {\n        ... on Asset {\n          id\n          url\n        }\n      }\n      json\n    }\n    publishedBy {\n      name\n      picture\n    }\n    slug\n    categories {\n      ...CategoryFields\n    }\n    tags {\n      ...TagFields\n    }\n  }\n  \n  \n'
): (typeof documents)['\n  fragment PostFields on Post {\n    id\n    publishedAt\n    updatedAt\n    title\n    subtitle\n    content {\n      references {\n        ... on Asset {\n          id\n          url\n        }\n      }\n      json\n    }\n    publishedBy {\n      name\n      picture\n    }\n    slug\n    categories {\n      ...CategoryFields\n    }\n    tags {\n      ...TagFields\n    }\n  }\n  \n  \n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetPosts {\n    posts(stage: PUBLISHED) {\n      ...PostFields\n    }\n  }\n  \n'
): (typeof documents)['\n  query GetPosts {\n    posts(stage: PUBLISHED) {\n      ...PostFields\n    }\n  }\n  \n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetPost($slug: String!) {\n    post(where: { slug: $slug }, stage: PUBLISHED) {\n      ...PostFields\n    }\n  }\n  \n'
): (typeof documents)['\n  query GetPost($slug: String!) {\n    post(where: { slug: $slug }, stage: PUBLISHED) {\n      ...PostFields\n    }\n  }\n  \n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment TagFields on Tag {\n    id\n    title\n    slug\n  }\n'
): (typeof documents)['\n  fragment TagFields on Tag {\n    id\n    title\n    slug\n  }\n']
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query GetTags {\n    tags(stage: PUBLISHED) {\n      ...TagFields\n    }\n  }\n  \n'
): (typeof documents)['\n  query GetTags {\n    tags(stage: PUBLISHED) {\n      ...TagFields\n    }\n  }\n  \n']

export function gql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
