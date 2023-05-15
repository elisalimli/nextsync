import { graphql } from "../../../gql";

export const File_Fragment = graphql(/* GraphQL */ `
  fragment File_Fragment on PostFile {
    id
    url
    postId
    contentType
    fileSize
    fileName
  }
`);

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
      ...File_Fragment
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
