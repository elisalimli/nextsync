import { graphql } from "../../../gql";

export const postQueryDocument = graphql(`
  query Post($input: PostInput!) {
    post(input: $input) {
      ...Post_Fragment
    }
  }
`);
