import { graphql } from "../../../gql";

export const deletePostMutationDocument = graphql(`
  mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
      ok
      errors {
        message
        field
      }
    }
  }
`);
