import { useRouter, useSegments } from "expo-router";
import React from "react";
import { User_Fragment, meQueryDocument } from "../src/graphql/query/user/me";
import { User, User_FragmentFragment } from "../src/gql/graphql";
import { FragmentType, useFragment } from "../src/gql";
import { useQuery } from "@apollo/client";

interface ThemeContextType {
  user: User_FragmentFragment | null;
}

const AuthContext = React.createContext<ThemeContextType>({
  user: null,
});

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User_FragmentFragment) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, segments]);
}

export function AuthProvider(props: { children: React.ReactElement }) {
  const { data } = useQuery(meQueryDocument, {});
  console.log("me data data", data);
  // const { data } = useQuery({
  //   queryKey: ["me"],
  //   queryFn: async () =>
  //     request(
  //       "http://localhost:4000/query",
  //       meQueryDocument,
  //       // variables are type-checked too!
  //       {}
  //     ),
  // });
  useProtectedRoute(data?.me as any);

  return (
    <AuthContext.Provider
      value={{
        user: data?.me as User_FragmentFragment,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
