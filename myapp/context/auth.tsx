import { useQuery } from "@tanstack/react-query";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import React from "react";
import { User_FragmentFragment } from "../src/gql/graphql";
import { meQueryDocument } from "../src/graphql/query/user/me";
import { graphqlRequestClient } from "../src/graphql/requestClient";
import { View } from "react-native";

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

  const { isLoading, data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => graphqlRequestClient.request(meQueryDocument),
    retry: 0,
    // networkMode: "offlineFirst",
  });

  useProtectedRoute(data?.me as any);

  if (isLoading) {
    return (
      <View>
        <SplashScreen />
        {props.children}
      </View>
    );
  }

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
