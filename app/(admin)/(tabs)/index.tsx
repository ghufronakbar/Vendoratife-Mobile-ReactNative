import { ThemedText } from "@/components/ThemedText";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { C } from "@/constants/Colors";
import { useProfile } from "@/hooks/useProfile";
import { Api } from "@/models/Response";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { profile, signOut } = useProfile();
  const { goToProfile, isSetting, toggleSetting } = useHome();

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        className="h-full"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
      >
        <Pressable
          className="flex flex-row space-x-4 w-full px-4 py-4 items-center relative z-20"
          onPress={toggleSetting}
        >
          <ThemedText
            type="title"
            className="line-clamp-1 font-omedium max-w-[70%]"
          >
            Hi, {profile.name}
          </ThemedText>
          <Entypo name="chevron-thin-down" size={18} />
          {isSetting && (
            <View className="w-40 h-fit bg-white absolute -bottom-14 z-20 flex flex-col border border-[#F5F5F5] rounded-lg">
              <TouchableOpacity
                className="flex flex-row items-center px-2 py-1 space-x-2 border-b border-[#F5F5F5]"
                onPress={goToProfile}
              >
                <Ionicons name="person" />
                <ThemedText className="text-black text-lg">
                  Edit Profile
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex flex-row items-center px-2 py-1 space-x-2 "
                onPress={signOut}
              >
                <Ionicons name="power" color={"#f87171"} />
                <ThemedText className="text-black text-lg">Logout</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
        <View className="flex flex-col space-y-4 h-full">
          <View className="flex flex-col space-y-2">
            <ThemedText className="text-black text-2xl font-omedium px-4">
              Overview
            </ThemedText>
            <View className="flex flex-row w-full justify-between px-4">
              <View
                className="w-[43vw] h-[43vw] bg-[#F5F5F5] rounded-xl flex flex-col p-4 justify-between"
                style={{ elevation: 5 }}
              >
                <View className="flex flex-row w-full bg-white items-center px-2 py-1 rounded-3xl space-x-2">
                  <MaterialIcons
                    name="bakery-dining"
                    color={"#ca8a04"}
                    size={24}
                  />
                  <ThemedText className="font-omedium text-xl">
                    Hari Ini
                  </ThemedText>
                </View>
                <View className="flex flex-col">
                  <ThemedText className="text-xl font-osemibold">
                    2 Pesanan
                  </ThemedText>
                  <ThemedText className="-mb-1">Harus segera</ThemedText>
                  <ThemedText>dikirim hari ini!</ThemedText>
                </View>
              </View>
              <View
                className="w-[43vw] h-[43vw] bg-white rounded-xl flex flex-col p-4 justify-between"
                style={{ elevation: 5 }}
              >
                <View className="flex flex-row w-full bg-white items-center px-2 py-1 rounded-3xl space-x-2">
                  <View className="rounded-full bg-[#F5F5F5] flex items-center justify-center w-8 h-8">
                    <MaterialIcons name="bar-chart" color={C[1]} size={24} />
                  </View>
                  <ThemedText className="font-omedium text-xl">
                    Sales
                  </ThemedText>
                </View>
                <View className="flex flex-col">
                  <ThemedText className="font-osemibold">Rp</ThemedText>
                  <ThemedText className="font-osemibold text-2xl">
                    100.000.000
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
          <View className="flex flex-col space-y-2">
            <ThemedText className="text-black text-2xl font-omedium px-4">
              Analisis
            </ThemedText>
            <View className="flex flex-row w-full justify-between px-4">
              <View
                className="w-[43vw] h-[43vw] bg-[#F5F5F5] rounded-xl flex flex-col p-4 justify-between"
                style={{ elevation: 5 }}
              >
                <View className="flex flex-row w-full bg-white items-center px-2 py-1 rounded-3xl space-x-2">
                  <MaterialIcons
                    name="bakery-dining"
                    color={"#ca8a04"}
                    size={24}
                  />
                  <ThemedText className="font-omedium text-xl">
                    Hari Ini
                  </ThemedText>
                </View>
                <View className="flex flex-col">
                  <ThemedText className="text-xl font-osemibold">
                    2 Pesanan
                  </ThemedText>
                  <ThemedText className="-mb-1">Harus segera</ThemedText>
                  <ThemedText>dikirim hari ini!</ThemedText>
                </View>
              </View>
              <View
                className="w-[43vw] h-[43vw] bg-white rounded-xl flex flex-col p-4 justify-between"
                style={{ elevation: 5 }}
              >
                <View className="flex flex-row w-full bg-white items-center px-2 py-1 rounded-3xl space-x-2">
                  <View className="rounded-full bg-[#F5F5F5] flex items-center justify-center w-8 h-8">
                    <MaterialIcons name="bar-chart" color={C[1]} size={24} />
                  </View>
                  <ThemedText className="font-omedium text-xl">
                    Sales
                  </ThemedText>
                </View>
                <View className="flex flex-col">
                  <ThemedText className="font-osemibold">Rp</ThemedText>
                  <ThemedText className="font-osemibold text-2xl">
                    100.000.000
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
          <View className="h-40 w-full" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useHome = () => {
  const [isSetting, setIsSetting] = useState(false);

  const toggleSetting = () => setIsSetting(!isSetting);
  const goToProfile = () => router.push("/(admin)/(page)/profile");

  return { isSetting, toggleSetting, goToProfile };
};

export default HomeScreen;
