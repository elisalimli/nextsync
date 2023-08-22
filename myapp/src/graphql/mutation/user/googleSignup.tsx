import { graphql } from "../../../gql";

export const googleSignUpMutationDocument = graphql(`
  mutation GoogleSignUp($input: GoogleSignUpInput!) {
    googleSignUp(input: $input) {
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
