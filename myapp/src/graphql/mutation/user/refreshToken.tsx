export const refreshTokenMutationDocument = `
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
`;
