import { graphql } from "../../../gql";

export const googleLoginOrSignUpMutationDocument = graphql(`
  mutation GoogleLoginOrSignUp($input: GoogleLoginOrSignUpInput!) {
    googleLoginOrSignUp(input: $input) {
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
