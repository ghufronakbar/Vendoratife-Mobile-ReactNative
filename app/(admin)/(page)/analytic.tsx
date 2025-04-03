import { ThemedText } from "@/components/ThemedText";
import LoadingView from "@/components/ui/LoadingView";
import api from "@/config/api";
import { C } from "@/constants/Colors";
import {
  ChartIncome,
  Overview,
  PartnerOverview,
  TopProduct,
} from "@/models/Dashboard";
import { Api } from "@/models/Response";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import StackedBarChart, {
  StackedBarChartData,
} from "react-native-chart-kit/dist/StackedBarChart";

const AnalyticScreen = () => {
  const {
    overview,
    chartProductData,
    sbChartConfig,
    productSold,
    colors,
    loading,
    fetchData,
    onClickSection,
    sections,
    selectedSection,
    partners,
    isVisible,
  } = useDashboard();
  if (loading) return <LoadingView />;
  return (
    <ScrollView
      className="h-full bg-white"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }
    >
      <View className="flex flex-col space-y-4 h-full">
        <View className="flex flex-row">
          {sections.map((item, index) => (
            <TouchableOpacity
              className={`px-4 py-2 h-12 rounded-lg flex flex-col`}
              onPress={() => onClickSection(item)}
            >
              <ThemedText
                className={`${
                  selectedSection === item ? "text-custom-1" : " text-black"
                }`}
              >
                {item}
              </ThemedText>
              <View
                className={`h-[1px] w-full ${
                  selectedSection === item && "bg-custom-1"
                } mt-2`}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View
          className={`flex flex-col space-y-2 px-4 ${isVisible("Ringkasan")}`}
        >
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <View className="flex flex-row justify-between">
              <View className="flex flex-col">
                <ThemedText>Penjualan Kotor (IDR)</ThemedText>
                <ThemedText className="text-sm">
                  Terakhir Diperbarui {formatDate(new Date(), true, true)}
                </ThemedText>
                <ThemedText className="text-2xl font-osemibold mt-1 text-black">
                  {formatRupiah(overview?.sales?.totalIncome)}
                </ThemedText>
              </View>
              <View className="rounded-full bg-[#F5F5F5] flex items-center justify-center w-10 h-10">
                <MaterialIcons name="bar-chart" color={C[1]} size={30} />
              </View>
            </View>
            {/* CHART */}
            <ScrollView className="overflow-x-scroll w-full" horizontal>
              {chartProductData.data.length > 0 && !loading && (
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
                  <ThemedText className="-mt-1 text-sm">
                    {formatRupiah(item.totalSellPrice)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText>Penjualan Bersih (IDR)</ThemedText>
            <ThemedText className="text-2xl font-osemibold mt-1 text-black">
              {formatRupiah(overview?.sales?.totalProfit)}
            </ThemedText>
            <ThemedText className="text-sm">
              Total penjualan setelah dipotong biaya modal produksi
            </ThemedText>
          </View>
        </View>
        <View
          className={`flex flex-col space-y-2 px-4 ${isVisible("Penjualan")}`}
        >
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText>Total Pesanan Terjual</ThemedText>
            <ThemedText className="text-2xl font-osemibold mt-1 text-black">
              {overview?.orderItem?.total || 0}
            </ThemedText>
          </View>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText className="mb-4">Barang Terlaris</ThemedText>
            {productSold?.map((item, index) => (
              <View
                key={index}
                className="mb-2 flex flex-row justify-between items-center"
              >
                <View className="flex flex-col">
                  <ThemedText>{item.name}</ThemedText>
                  <ThemedText className="text-2xl text-black">
                    {item.quantity}
                  </ThemedText>
                </View>
                <Entypo name="chevron-thin-right" size={18} color={"gray"} />
              </View>
            ))}
          </View>
        </View>
        <View className={`flex flex-col space-y-2 px-4 ${isVisible("Mitra")}`}>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText>Rata-Rata Transaksi Mitra</ThemedText>
            <ThemedText className="text-2xl font-osemibold mt-1 text-black">
              {formatRupiah(overview?.sales?.averageTransactionValue)}
            </ThemedText>
            <ThemedText className="text-sm leading-4">
              Rata-rata nilai pembelian dari setiap mitra (penjualan bersih
              dibagi dengan total pesanan)
            </ThemedText>
          </View>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText>Total Mitra Bergabung</ThemedText>
            <ThemedText className="text-2xl font-osemibold mt-1 text-black">
              {partners?.totalPartners || 0}
            </ThemedText>
            <ThemedText className="text-sm leading-4">
              Rata-rata nilai pembelian dari setiap mitra (penjualan bersih
              dibagi dengan total pesanan)
            </ThemedText>
          </View>
          <View
            className="w-full h-fit bg-white rounded-xl flex flex-col p-4"
            style={{ elevation: 5 }}
          >
            <ThemedText className="mb-4">Penjualan Terbanyak</ThemedText>
            {partners?.topPartners?.map((item, index) => (
              <View
                key={index}
                className="mb-2 flex flex-row justify-between items-center"
              >
                <View className="flex flex-col">
                  <ThemedText>{item.name}</ThemedText>
                  <ThemedText className="text-2xl text-black">
                    {item?.totalQuantity}
                  </ThemedText>
                </View>
                <Entypo name="chevron-thin-right" size={18} color={"gray"} />
              </View>
            ))}
          </View>
        </View>
        <View className="h-40 w-full" />
      </View>
    </ScrollView>
  );
};

const useDashboard = () => {
  const [overview, setOverview] = useState<Overview>({} as Overview);
  const [chartProduct, setChartProduct] = useState<ChartIncome>();
  const [productSold, setProductSold] = useState<TopProduct[]>();
  const [partners, setPartners] = useState<PartnerOverview>();

  const [selectedSection, setSelectedSection] = useState("Ringkasan");
  const sections = ["Ringkasan", "Penjualan", "Mitra"];

  const loading = !overview || !chartProduct || !productSold || !partners;

  useNavigation().setOptions({
    headerShown: !loading,
  });

  const onClickSection = (section: string) => {
    setSelectedSection(section);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchOverview = async () => {
    const res = await api.get<Api<Overview>>("/dashboard/overview");
    setOverview(res.data.data);
  };

  const fetchChartProduct = async () => {
    const res = await api.get<Api<ChartIncome>>("/dashboard/chart-income");
    setChartProduct(res.data.data);
  };

  const fetchPartnerOverview = async () => {
    const res = await api.get<Api<PartnerOverview>>(
      "/dashboard/partner-overview"
    );
    setPartners(res.data.data);
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
    await Promise.all([
      fetchOverview(),
      fetchChartProduct(),
      fetchProductSold(),
      fetchPartnerOverview(),
    ]);
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

  const isVisible = (section: string) => {
    return section === selectedSection ? "flex" : "hidden";
  };

  return {
    overview,
    chartProductData,
    loading,
    sbChartConfig,
    colors,
    productSold,
    fetchData,
    onClickSection,
    sections,
    selectedSection,
    partners,
    isVisible,
  };
};
export default AnalyticScreen;
