import { graphql } from "../../../gql";

export const refreshTokenMutationDocument = graphql(`
  mutation RefreshToken {
    refreshToken {
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
