import { ThemedText } from "@/components/ThemedText";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { toastError, toastSuccess } from "@/helper/toast";
import { useProfile } from "@/hooks/useProfile";
import { Order } from "@/models/Order";
import { Api } from "@/models/Response";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeOrderScreen = () => {
  const {
    data,
    fetchData,
    loading,
    onClickExpand,
    selected,
    onClickSection,
    sections,
    selectedSection,
    loadingIds,
    trackOrder,
  } = useOrders();

  const { goToProfile, isSetting, toggleSetting, goToChange } = useHome();
  const { profile, signOut } = useProfile();
  return (
    <RefreshControl refreshing={loading} onRefresh={fetchData}>
      <SafeAreaView className="bg-white h-full">
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
            <View className="w-fit h-fit bg-white absolute -bottom-24 z-20 flex flex-col border border-[#F5F5F5] rounded-lg">
              <TouchableOpacity
                className="flex flex-row items-center px-2 py-1 space-x-2 border-b border-[#F5F5F5]"
                onPress={goToProfile}
              >
                <Ionicons name="person" size={20} />
                <ThemedText className="text-black text-xl">
                  Edit Profile
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex flex-row items-center px-2 py-1 space-x-2 border-b border-[#F5F5F5]"
                onPress={goToChange}
              >
                <Ionicons name="lock-closed" color={"#ffa500"} size={20} />
                <ThemedText className="text-black text-xl">
                  Ubah Password
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex flex-row items-center px-2 py-1 space-x-2 "
                onPress={signOut}
              >
                <Ionicons name="power" color={"#f87171"} size={20} />
                <ThemedText className="text-black text-xl">Logout</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>

        <View className="flex flex-row space-x-2">
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

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <ListOrder
              item={item}
              expanded={selected === item.id}
              onClickExpand={onClickExpand}
              loadingIds={loadingIds}
              trackOrder={trackOrder}
            />
          )}
        />
        <FloatingAddButton
          onPress={() => router.push("/(employee)/(page)/form-order")}
        />
      </SafeAreaView>
    </RefreshControl>
  );
};

interface ListOrderProps {
  item: Order;
  expanded: boolean;
  onClickExpand: (id: string) => void;
  loadingIds: string[];
  trackOrder: (item: Order) => void;
}
const ListOrder: React.FC<ListOrderProps> = ({
  item,
  expanded,
  onClickExpand,
  loadingIds,
  trackOrder,
}) => {
  const name = item.orderItems
    .slice(0, 3)
    .map((item) => item?.name)
    .join(", ");

  let buttonText = "";
  if (item.finishedAt) {
    buttonText = "Pesanan Selesai";
  } else if (item.startedAt) {
    buttonText = "Selesai";
  } else {
    buttonText = "Mulai";
  }

  let buttonColor = "bg-custom-1";
  let statusColor = "text-custom-1";
  if (new Date(item.date) < new Date()) {
    buttonColor = "bg-red-400";
    statusColor = "text-red-400";
  }

  let textDate = `Tenggat: ${formatDate(item.date, true)}`;
  if (item.finishedAt) {
    textDate = `Selesai: ${formatDate(item.finishedAt, true)}`;
  }

  const onPress = useCallback(() => {
    if (!item.finishedAt) {
      trackOrder(item);
    }
  }, [item]);

  const isLoading = loadingIds.includes(item.id);

  return (
    <Pressable
      className="w-full h-fit bg-white mb-2 border border-gray-200 rounded-2xl shadow-md overflow-hidden py-2 px-2"
      style={{ elevation: 5 }}
      onPress={() => onClickExpand(item.id)}
    >
      <View className="flex flex-row items-center ">
        <Img
          className="h-16 w-16 object-cover aspect-square rounded-xl mr-2"
          uri={item?.partner?.image}
        />
        <View className="flex flex-row justify-between items-center w-[75%]">
          <View className="flex flex-col">
            <ThemedText className="text-black line-clamp-1" numberOfLines={1}>
              {name}
            </ThemedText>
            <ThemedText>{item.partner.name}</ThemedText>
          </View>
          <Entypo
            name={expanded ? "chevron-thin-down" : "chevron-thin-right"}
            size={18}
          />
        </View>
      </View>
      {expanded && (
        <View className="flex flex-col">
          <View className="flex flex-col mt-2">
            <ThemedText className="text-black">Alamat:</ThemedText>
            <ThemedText>{item.partner.address}</ThemedText>
          </View>
          <View className="flex flex-col mt-2">
            <ThemedText className="text-black">Catatan:</ThemedText>
            <ThemedText>{item.note || "-"}</ThemedText>
          </View>
          <View className="flex flex-row justify-between items-end mt-2 w-full">
            <View className="w-[60%] flex flex-col items-start">
              {item.orderItems.map((oi, index) => (
                <View className="flex flex-col" key={index}>
                  <ThemedText className="text-black">
                    {oi.name} ({oi.quantity} {oi.unit})
                  </ThemedText>
                  <ThemedText>{formatRupiah(oi.totalSellPrice)}</ThemedText>
                </View>
              ))}
              <ThemedText className="text-black font-omedium mt-2">
                Total: {formatRupiah(item.totalSellPrice)}
              </ThemedText>
            </View>
            <View className="w-[40%] flex flex-col items-end space-y-2">
              <ThemedText className={`text-sm ${statusColor}`}>
                {textDate}
              </ThemedText>
              <TouchableOpacity
                className={`w-fit h-fit px-6 py-2 rounded-xl ${buttonColor}`}
                onPress={onPress}
              >
                <ThemedText className="text-white">
                  {isLoading ? <ActivityIndicator color="white" /> : buttonText}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const useOrders = () => {
  const [loading, setLoading] = useState(true);
  const [d, setData] = useState<Order[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState("Mendatang");
  const sections = ["Mendatang", "Dalam Proses", "Selesai"];

  const data = d.filter((item) => item.status === selectedSection);

  const onClickSection = (section: string) => {
    setSelectedSection(section);
    setSelected(null);
  };

  const onClickExpand = (id: string) => {
    if (selected === id) {
      setSelected(null);
    } else {
      setSelected(id);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get<Api<Order[]>>("/orders");
    setData(res.data.data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const trackOrder = async (item: Order) => {
    try {
      if (loadingIds.includes(item.id)) return;
      setLoadingIds([...loadingIds, item.id]);
      const res = await api.post<Api<Order>>(`/orders/${item.id}/track`);
      await fetchData();
      toastSuccess(res.data.message);
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setLoadingIds(loadingIds.filter((id) => id !== item.id));
    }
  };

  return {
    data,
    loading,
    fetchData,
    onClickExpand,
    selected,
    onClickSection,
    selectedSection,
    sections,
    trackOrder,
    loadingIds,
  };
};

const useHome = () => {
  const [isSetting, setIsSetting] = useState(false);

  const toggleSetting = () => setIsSetting(!isSetting);
  const goToProfile = () => {
    setIsSetting(false);
    router.push("/(employee)/(page)/profile");
  };
  const goToChange = () => {
    setIsSetting(false);
    router.push("/(employee)/(page)/change-password");
  };

  return { isSetting, toggleSetting, goToProfile, goToChange };
};

export default HomeOrderScreen;
