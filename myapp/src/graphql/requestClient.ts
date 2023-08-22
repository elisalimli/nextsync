import { GraphQLClient } from "graphql-request";
import { constants } from "../constants";

export const graphqlRequestClient = new GraphQLClient(
  constants.apiBase + constants.apiGraphql,
  {
    credentials: "include",
    // mode: "cors",
  }
);
