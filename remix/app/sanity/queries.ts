// ./app/sanity/queries.ts

import { gql } from "graphql-request";

// Get all `post` type documents that have a slug
export const GET_POSTS = gql`
  query allPost {
    allPost(
      where: { slug: { current: { neq: null } } }
      sort: { publishedAt: DESC }
    ) {
      _id
      slug {
        current
      }
      title
      publishedAt
    }
  }
`;

// Get all `post` type documents with this slug
export const GET_POST = gql`
  query allPost($slug: String!) {
    allPost(where: { slug: { current: { eq: $slug } } }) {
      _id
      slug {
        current
      }
      title
      publishedAt
    }
  }
`;

export type Post = {
  _id: string
  _originalId?: string
  slug: { current: string }
  title?: string
  publishedAt?: string
};

export type AllPost = { allPost: Post[] };
