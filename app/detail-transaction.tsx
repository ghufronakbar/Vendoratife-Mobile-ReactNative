import { ThemedText } from "@/components/ThemedText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInputText } from "@/components/ui/CustomInputText";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { C } from "@/constants/Colors";
import { toastError } from "@/helper/toast";
import { Api } from "@/models/Response";
import { Transaction } from "@/models/Transaction";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const DetailTransactionScreen = () => {
  const {
    data,
    fetchData,
    loading,
    handlePay,
    pending,
    getStatusInfo,
    location,
    setLocation,
  } = useTransaction();

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={C[1]} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 ">
      <ScrollView
        className="z-10 "
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
      >
        <View>
          <View className="w-full h-60">
            {!data?.auction?.images?.length && (
              <Img className="w-[100vw] h-full object-cover" />
            )}
            <FlatList
              data={data.auction.images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Img uri={item} className="w-[100vw] h-full object-cover" />
              )}
              horizontal
              pagingEnabled
            />
          </View>
          <View className="flex flex-col py-2 space-y-2 mt-2">
            <View className="px-4 flex flex-col space-y-2">
              <ThemedText className="text-3xl font-omedium text-black">
                {data.auction.name}
              </ThemedText>
              <View className="flex flex-row items-center justify-between mb-4">
                <View
                  className={`px-2 py-1 rounded-lg flex items-center justify-center w-auto ${
                    getStatusInfo(data).color
                  }`}
                >
                  <ThemedText className="text-white font-omedium text-sm">
                    {getStatusInfo(data).label}
                  </ThemedText>
                </View>
                <ThemedText className="text-base text-neutral-600">
                  {formatDate(data.createdAt, true, true)}
                </ThemedText>
              </View>
              <View
                className="flex flex-row space-x-4 w-full h-auto px-2 py-2 rounded-lg bg-white items-center my-2"
                style={{ elevation: 4 }}
              >
                <Img
                  uri={data.auction.seller.image}
                  className="w-12 h-12 rounded-full"
                  type="profile"
                />
                <View className="flex flex-col max-w-[70%]">
                  <ThemedText className="font-omedium text-black text-lg">
                    {data.auction.seller.name}
                  </ThemedText>
                  <ThemedText className="text-xs text-neutral-600">
                    {data.auction.location}
                  </ThemedText>
                </View>
              </View>
            </View>
            <View className="my-4 space-y-2 px-4">
              {data.location ? (
                <View
                  className="flex flex-row space-x-4 w-full h-auto px-2 py-2 rounded-lg bg-white items-center"
                  style={{ elevation: 4 }}
                >
                  <View className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden relative">
                    <Image
                      className="w-full h-full object-cover absolute opacity-60"
                      source={require("@/assets/images/bg.jpg")}
                    />
                    <Ionicons
                      name="location-outline"
                      color={"black"}
                      size={24}
                    />
                  </View>
                  <View className="flex flex-col">
                    <ThemedText className="font-omedium text-black text-lg">
                      Shipping Address
                    </ThemedText>
                    <ThemedText className="text-xs text-neutral-600">
                      {data.location}
                    </ThemedText>
                  </View>
                </View>
              ) : (
                <CustomInputText
                  value={location}
                  label="Shipping Address"
                  onChangeText={(value) => setLocation(value)}
                  placeholder="Jl Lempongsari 13 Rt 01/02 Ngaglik, Sleman, Yogyakarta"
                  multiline
                />
              )}
            </View>
          </View>
        </View>
        <View className="h-20 w-full" />
      </ScrollView>
      <View
        className="w-full h-auto bg-white z-50 fixed bottom-0  flex flex-col px-4 rounded-t-3xl py-4"
        style={{ elevation: 4 }}
      >
        <ThemedText>Total Amount</ThemedText>
        <View className="flex flex-row items-center space-x-2">
          <ThemedText className="text-2xl font-omedium text-custom-1 mb-2">
            {formatRupiah(data.amount)}
          </ThemedText>
          <ThemedText className="text-sm">Include Admin Fee (5%)</ThemedText>
        </View>

        <CustomButton
          text={
            data.status === "Pending" ? "Pay Now" : getStatusInfo(data).label
          }
          cn={`w-auto ${getStatusInfo(data).color}`}
          cnText="font-osemibold text-lg"
          onPress={handlePay}
          loading={pending}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default DetailTransactionScreen;

const useTransaction = () => {
  const [data, setData] = useState<Transaction>();
  const [loading, setLoading] = useState(false);
  const id = (useLocalSearchParams().id as string) || "";
  const [location, setLocation] = useState<string>("");
  const [pending, setPending] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Api<Transaction>>(`/transactions/${id}`);
      setData(res.data.data);
      if (res.data.data.location) {
        setLocation(res.data.data.location);
      }
    } catch (error) {
      console.log(error);
      toastError(error);
      setTimeout(() => {
        router.back();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (transaction: Transaction) => {
    switch (transaction.status) {
      case "Pending":
        return { label: "Pending", color: "bg-custom-1" };
      case "Paid":
        return { label: "Paid", color: "bg-blue-400" };
      case "Delivered":
        return { label: "Delivered", color: "bg-green-400" };
      case "Completed":
        return { label: "Completed", color: "bg-black" };
      case "Expired":
        return { label: "Expired", color: "bg-red-400" };
      default:
        return { label: "Unknown Status", color: "bg-gray-400" };
    }
  };

  const handlePay = async () => {
    try {
      if (!data) return;
      if (pending) return;
      if (data.status !== "Pending") return;
      if (!location) {
        toastError("Please fill your shipping address");
        return;
      }

      setPending(true);

      if (data && !data.location) {
        await api.patch<Api<Transaction>>(`/transactions/${id}/location`, {
          location: location,
        });
      }

      setPending(false);

      router.push({
        pathname: "/payment",
        params: {
          redirectUrl: data?.directUrl,
          snapToken: data?.snapToken,
        },
      });
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setPending(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return {
    data,
    loading,
    fetchData,
    getStatusInfo,
    location,
    setLocation,
    handlePay,
    pending,
  };
};
