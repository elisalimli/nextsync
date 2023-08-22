import { graphql } from "../../../gql";

export const helloQueryDocument = graphql(/* GraphQL */ `
  query Hello {
    hello
  }
`);
