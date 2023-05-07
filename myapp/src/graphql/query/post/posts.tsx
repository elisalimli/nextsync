import { graphql } from "../../../gql";

export const Post_Fragment = graphql(/* GraphQL */ `
  fragment Post_Fragment on Post {
    id
    title
    files {
      id
      url
      postId
      contentType
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
