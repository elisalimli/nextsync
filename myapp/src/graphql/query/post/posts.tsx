import { graphql } from "../../../gql";

export const Post_Fragment = graphql(/* GraphQL */ `
  fragment Post_Fragment on Post {
    id
    title
    description
    variant
    type
    language
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
  query Posts {
    posts {
      ...Post_Fragment
    }
  }
`);
