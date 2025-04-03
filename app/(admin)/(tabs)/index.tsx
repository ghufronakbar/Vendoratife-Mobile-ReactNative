import { ThemedText } from "@/components/ThemedText";
import api from "@/config/api";
import { C, Colors } from "@/constants/Colors";
import { useProfile } from "@/hooks/useProfile";
import { ChartProduct, Overview, TopProduct } from "@/models/Dashboard";
import { Api } from "@/models/Response";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackedBarChart } from "react-native-chart-kit";
import { StackedBarChartData } from "react-native-chart-kit/dist/StackedBarChart";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";

const HomeScreen = () => {
  const { profile, signOut } = useProfile();
  const { goToProfile, isSetting, toggleSetting, goToChange } = useHome();
  const {
    overview,
    chartProductData,
    sbChartConfig,
    productSold,
    colors,
    loading,
    fetchData,
  } = useDashboard();

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        className="h-full"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
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
            <View className="w-40 h-fit bg-white absolute -bottom-24 z-20 flex flex-col border border-[#F5F5F5] rounded-lg">
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
                className="flex flex-row items-center px-2 py-1 space-x-2 border-b border-[#F5F5F5]"
                onPress={goToChange}
              >
                <Ionicons name="lock-closed" color={"#ffa500"} />
                <ThemedText className="text-black text-lg">
                  Ubah Password
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
                    {overview?.order?.total
                      ? overview?.order?.total + " Pesanan"
                      : "Loading..."}
                  </ThemedText>
                  <ThemedText className="-mb-1 leading-4">
                    {overview?.order?.message || "Loading..."}
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity
                className="w-[43vw] h-[43vw] bg-white rounded-xl flex flex-col p-4 justify-between"
                style={{ elevation: 5 }}
                onPress={() => router.push("/(admin)/(page)/analytic")}
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
                  <ThemedText className="font-osemibold text-xl">
                    {overview?.sales?.totalIncome
                      ? formatRupiah(overview?.sales?.totalIncome, false)
                      : "Loading..."}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-col space-y-2">
            <ThemedText className="text-black text-2xl font-omedium px-4">
              Analisis
            </ThemedText>
            <View className="flex flex-row w-full justify-between px-4">
              <View
                className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
                style={{ elevation: 5 }}
              >
                <View className="flex flex-row justify-between">
                  <View className="flex flex-col">
                    <ThemedText className="text-3xl font-osemibold">
                      {overview?.orderItem?.total || 0}
                    </ThemedText>
                    <ThemedText>Total Pesanan</ThemedText>
                  </View>
                  <View className="rounded-full bg-[#F5F5F5] flex items-center justify-center w-10 h-10">
                    <MaterialIcons name="bar-chart" color={C[1]} size={30} />
                  </View>
                </View>
                {/* CHART */}
                <ScrollView className="overflow-x-scroll w-full" horizontal>
                  {chartProductData.data.length > 0 && (
                    <StackedBarChart
                      data={chartProductData}
                      width={
                        Dimensions.get("window").width * 0.1 +
                        Dimensions.get("window").width *
                          (0.2 * chartProductData.data.length)
                      }
                      height={180}
                      chartConfig={sbChartConfig}
                      fromZero
                      hideLegend
                      withHorizontalLabels={false}
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        padding: 0,
                        marginLeft: -50,
                      }}
                    />
                  )}
                </ScrollView>
                <View className="w-full flex flex-row flex-wrap justify-between mt-4 px-4">
                  {productSold?.map((item, index) => (
                    <View
                      className="flex flex-col w-[48%] items-start mb-2"
                      key={index}
                    >
                      <View
                        className="w-2 h-2"
                        style={{
                          backgroundColor: colors[index] || C[1],
                        }}
                      ></View>
                      <ThemedText>{item.name}</ThemedText>
                      <ThemedText className="-mt-1">{item.quantity}</ThemedText>
                    </View>
                  ))}
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
  const goToProfile = () => {
    setIsSetting(false);
    router.push("/(admin)/(page)/profile");
  };
  const goToChange = () => {
    setIsSetting(false);
    router.push("/(admin)/(page)/change-password");
  };

  return { isSetting, toggleSetting, goToProfile, goToChange };
};

const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<Overview>({} as Overview);
  const [chartProduct, setChartProduct] = useState<ChartProduct>();
  const [productSold, setProductSold] = useState<TopProduct[]>();

  const fetchOverview = async () => {
    const res = await api.get<Api<Overview>>("/dashboard/overview");
    setOverview(res.data.data);
  };

  const fetchChartProduct = async () => {
    const res = await api.get<Api<ChartProduct>>("/dashboard/chart-product");
    setChartProduct(res.data.data);
  };

  const fetchProductSold = async () => {
    const res = await api.get<Api<TopProduct[]>>("/dashboard/product-sold");
    setProductSold(res.data.data);
  };

  const dataProduct = chartProduct?.chart.map((item) =>
    Object.values(item).filter((value) => typeof value === "number")
  ) || [[]];

  const colors: string[] = [];
  const productLength = chartProduct?.keys?.length || 0;
  for (let i = 0; i < productLength; i++) {
    const key = Object.keys(C)[i % Object.keys(C).length] as keyof typeof C;
    colors.push(C[key]);
  }

  const chartProductData: StackedBarChartData = {
    labels:
      chartProduct?.chart.map((item) => item?.month?.substring(0, 3)) || [],
    legend: chartProduct?.keys || [],
    data: dataProduct,
    barColors: colors,
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchOverview(),
      fetchChartProduct(),
      fetchProductSold(),
    ]);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const sbChartConfig: AbstractChartConfig = {
    backgroundGradientFrom: "#FAFAFA",
    backgroundGradientTo: "#FAFAFA",
    decimalPlaces: 0,
    color: () => `gray`,
    labelColor: () => "#181D27",
    barPercentage: 0.5,
    barRadius: 1,
    propsForLabels: {
      fontFamily: "Outfit-Regular",
    },
  };

  return {
    overview,
    chartProductData,
    loading,
    sbChartConfig,
    colors,
    productSold,
    fetchData,
  };
};

export default HomeScreen;
