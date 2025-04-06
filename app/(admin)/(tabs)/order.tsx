import { ThemedText } from "@/components/ThemedText";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { Img } from "@/components/ui/Img";
import ModalConfirmation from "@/components/ui/ModalConfirmation";
import api from "@/config/api";
import { toastError, toastSuccess } from "@/helper/toast";
import { Order } from "@/models/Order";
import { Api } from "@/models/Response";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo } from "@expo/vector-icons";
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

const OrderScreen = () => {
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
    Confirmation,
    onClickDel,
    selectedDel,
  } = useOrders();
  return (
    <RefreshControl refreshing={loading} onRefresh={fetchData}>
      <SafeAreaView className="bg-white h-full">
        <ThemedText
          type="title"
          className="line-clamp-1 py-6 px-4 text-center font-omedium"
        >
          Daftar Pesanan
        </ThemedText>

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
              onClickDel={() => onClickDel(item.id)}
              selectedDel={selectedDel || ""}
            />
          )}
        />
        <FloatingAddButton
          onPress={() => router.push("/(admin)/(page)/form-order")}
        />
        <Confirmation />
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
  onClickDel: () => void;
  selectedDel: string;
}
const ListOrder: React.FC<ListOrderProps> = ({
  item,
  expanded,
  onClickExpand,
  loadingIds,
  trackOrder,
  onClickDel,
  selectedDel,
}) => {
  const name = item.orderItems
    .slice(0, 3)
    .map((item) => item?.name)
    .join(", ");

  let buttonText = "";
  if (item.finishedAt) {
    buttonText = "Selesai";
  } else if (item.startedAt) {
    buttonText = "Selesai";
  } else {
    buttonText = "Mulai";
  }
  if (item.isDeleted) {
    buttonText = "Dibatalkan";
  }

  let buttonColor = "bg-custom-1";
  let statusColor = "text-custom-1";
  if (new Date(item.date) < new Date() || item.isDeleted) {
    buttonColor = "bg-red-400";
    statusColor = "text-red-400";
  }

  let textDate = `Tenggat: ${formatDate(item.date, true)}`;
  if (item.finishedAt) {
    textDate = `Selesai: ${formatDate(item.finishedAt, true)}`;
  } else if (item.isDeleted) {
    textDate = `Dibatalkan: ${formatDate(item.updatedAt, true)}`;
  }

  const onPress = () => {
    if (!item.finishedAt && !item.isDeleted) {
      trackOrder(item);
    }
  };

  const isLoading = loadingIds.includes(item.id);

  const isAbleToCancel = !item.startedAt && !item.isDeleted;

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
              <View className="flex flex-row space-x-2">
                {isAbleToCancel && (
                  <Pressable
                    className={`w-fit h-fit px-3 py-2 rounded-xl bg-red-400`}
                    onPress={onClickDel}
                  >
                    <ThemedText className="text-white text-sm">
                      Batalkan
                    </ThemedText>
                  </Pressable>
                )}
                <Pressable
                  className={`w-fit h-fit px-3 py-2 rounded-xl ${buttonColor}`}
                  onPress={onPress}
                >
                  <ThemedText className="text-white text-sm">
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      buttonText
                    )}
                  </ThemedText>
                </Pressable>
              </View>
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
  const sections = ["Mendatang", "Dalam Proses", "Selesai", "Dibatalkan"];

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
    setSelected(null);
    setLoadingIds([]);
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
      setLoadingIds([]);
    }
  };

  const [openDel, setOpenDel] = useState(false);
  const [selectedDel, setSelectedDel] = useState<string | null>(null);

  const onClickDel = (id: string | null) => {
    setSelectedDel(id);
    setOpenDel(!openDel);
  };

  const handleCancel = async () => {
    try {
      if (!selectedDel) return;
      onClickDel(null);
      const res = await api.delete<Api<Order>>(`/orders/${selectedDel}`);
      await fetchData();
      toastSuccess(res?.data?.message);
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setSelectedDel(null);
      setOpenDel(false);
    }
  };

  const Confirmation = () => (
    <ModalConfirmation
      onConfirm={handleCancel}
      setShowAlert={setOpenDel}
      showAlert={openDel}
    />
  );

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
    Confirmation,
    onClickDel,
    selectedDel,
  };
};

export default OrderScreen;
