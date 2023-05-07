import { useQuery } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { User_Fragment, meQueryDocument } from "../../../graphql/query/user/me";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFragment } from "../../../gql";
import Input from "../../Form/Input";

import { useForm } from "react-hook-form";
import { Animated } from "react-native";

interface HomeHeaderProps {}

const HomeHeader = (props: HomeHeaderProps) => {
  const { control } = useForm();
  const { data } = useQuery(meQueryDocument, {
    nextFetchPolicy: "cache-only", // Used for subsequent executions
  });

  const user = useFragment(User_Fragment, data?.me);

  const insets = useSafeAreaInsets();

  const [openSearch, setOpenSearch] = useState(false);

  const handleSearchPress = () => {
    setOpenSearch((prevState) => !prevState);
    Animated.timing(searchAnimation, {
      toValue: openSearch ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const searchAnimation = useRef(new Animated.Value(0)).current;

  const searchBarOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const closedSearchBarOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const actionBarClassname =
    "flex-1 flex-row items-center justify-between absolute w-full h-full";

  return (
    <View>
      <StatusBar style="light" />

      <View
        style={{ paddingTop: insets.top + 10 }}
        className="w-full rounded-b-8xl bg-primary"
      >
        <View className="px-8">
          <View className="w-full h-12">
            <Animated.View
              style={{ opacity: searchBarOpacity }}
              className={actionBarClassname}
            >
              <Input
                containerClassName="flex-1"
                className="bg-white p-2 rounded-lg"
                name="search"
                control={control}
                placeholder="Search..."
              />
              <TouchableOpacity onPress={handleSearchPress} className="ml-2">
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={{ opacity: closedSearchBarOpacity }}
              className={actionBarClassname}
            >
              <TouchableOpacity onPress={handleSearchPress}>
                <AntDesign name="plus" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSearchPress}>
                <AntDesign name="search1" size={24} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View className="flex justify-center items-center mb-6">
            <Text className="text-white text-3xl font-bold">
              Hi, {user?.username}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {},
});
