import { graphql } from "../../../gql";

export const tagsQueryDocument = graphql(`
  query Tags {
    tags {
      id
      name
    }
  }
`);
