import { graphql } from "../../../gql";

export const User_Fragment = graphql(/* GraphQL */ `
  fragment User_Fragment on User {
    id
    username
    email
    phoneNumber
    createdAt
    updatedAt
  }
`);

export const meQueryDocument = graphql(/* GraphQL */ `
  query Me {
    me {
      ...User_Fragment
    }
  }
`);
