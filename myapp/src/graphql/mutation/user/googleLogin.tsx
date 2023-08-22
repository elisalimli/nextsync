import { graphql } from "../../../gql";

export const googleLoginpMutationDocument = graphql(`
  mutation GoogleLogin($input: GoogleLoginInput!) {
    googleLogin(input: $input) {
      ok
      errors {
        message
        field
      }
      user {
        ...User_Fragment
      }
      authToken {
        token
        expiredAt
      }
    }
  }
`);
