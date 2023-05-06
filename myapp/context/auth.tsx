import { useRouter, useSegments } from "expo-router";
import React from "react";
import { User_Fragment, meQueryDocument } from "../src/graphql/query/user/me";
import { User, User_FragmentFragment } from "../src/gql/graphql";
import { FragmentType, useFragment } from "../src/gql";
import { useQuery } from "@apollo/client";

interface AuthContextType {
  user: User_FragmentFragment | null;
  token: string;
  phoneNumber: string;
  setToken: (token: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  token: "",
  phoneNumber: "",
  setToken: () => {},
  setPhoneNumber: () => {},
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
  const [token, setToken] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const { data } = useQuery(meQueryDocument, {
    fetchPolicy: "cache-only", // Used for subsequent executions
  });
  useProtectedRoute(data?.me as any);

  return (
    <AuthContext.Provider
      value={{
        user: data?.me as User_FragmentFragment,
        token,
        phoneNumber,
        setToken: (token: string) => setToken(token),
        setPhoneNumber: (phoneNumber: string) => setPhoneNumber(phoneNumber),
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
