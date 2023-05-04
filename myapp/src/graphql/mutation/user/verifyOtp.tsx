import { graphql } from "../../../gql";

export const verifyOtpMutation = graphql(`
  mutation VerifyOTP($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
      ok
      errors {
        message
        field
      }
      authToken {
        token
        expiredAt
      }
    }
  }
`);
