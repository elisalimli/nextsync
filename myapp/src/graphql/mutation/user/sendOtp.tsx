import { graphql } from "../../../gql";

export const sendOtpMutation = graphql(`
  mutation SendOTP($input: SendOtpInput!) {
    sendOtp(input: $input) {
      ok
      errors {
        message
        field
      }
    }
  }
`);
