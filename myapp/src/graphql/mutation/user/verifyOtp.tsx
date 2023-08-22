import { graphql } from "../../../gql";

export const verifyOtpMutation = graphql(`
  mutation VerifyOTP($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
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
