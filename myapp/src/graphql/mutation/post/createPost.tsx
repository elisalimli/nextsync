import { graphql } from "../../../gql";

export const createPostMutationDocument = graphql(`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ok
      errors {
        message
        field
      }
      post {
        id
        title
        description
      }
    }
  }
`);
