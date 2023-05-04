import { ApolloCache } from "@apollo/client";
import { meQueryDocument } from "./query/user/me";

export const updateMeCache = (cache: ApolloCache<any>, data: any) => {
  if (data) {
    cache.writeQuery({
      query: meQueryDocument,
      data: {
        me: {
          __typename: "User",
          ...data,
        },
      },
    });
  }
};
