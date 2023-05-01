import { graphql } from "../../../gql";

export const loginMutationDocument = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ok
      errors {
        message
        field
      }
      authToken {
        token
        expiredAt
      }
      user {
        ...User_Fragment
      }
    }
  }
`);
