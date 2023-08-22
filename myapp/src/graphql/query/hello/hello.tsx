import { graphql } from "../../../gql";

export const helloQueryDocument = graphql(`
  query Hello {
    hello
  }
`);
