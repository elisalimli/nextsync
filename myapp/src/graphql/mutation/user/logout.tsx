import { graphql } from "../../../gql";

export const logoutMutationDocument = graphql(`
  mutation Logout {
    logout
  }
`);
