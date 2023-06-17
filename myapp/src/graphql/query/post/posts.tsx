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

export const Catalog_Fragment = graphql(/* GraphQL */ `
  fragment Catalog_Fragment on Catalog {
    id
    name
    code
  }
`);

export const Tag_Fragment = graphql(/* GraphQL */ `
  fragment Tag_Fragment on Tag {
    id
    name
    code
    catalog {
      ...Catalog_Fragment
    }
  }
`);

export const Post_Fragment = graphql(/* GraphQL */ `
  fragment Post_Fragment on Post {
    id
    title
    description
    htmlContent
    tags {
      ...Tag_Fragment
    }
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
      hasMore
      posts {
        ...Post_Fragment
      }
    }
  }
`);
