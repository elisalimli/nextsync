import { graphql } from "../../../gql";

export const Post_Fragment = graphql(/* GraphQL */ `
  fragment Post_Fragment on Post {
    id
    title
    description
    variant
    type
    language
    createdAt
    updatedAt
    files {
      id
      url
      postId
      contentType
      fileSize
    }
    creator {
      ...User_Fragment
    }
  }
`);

export const postsQueryDocument = graphql(`
  query Posts($input: PostsInput!) {
    posts(input: $input) {
      ...Post_Fragment
    }
  }
`);
