import { ThemedText } from "@/components/ThemedText";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { Order } from "@/models/Order";
import { Api } from "@/models/Response";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
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
  } = useOrders();
  return (
    <RefreshControl refreshing={loading} onRefresh={fetchData}>
      <SafeAreaView className="bg-white min-h-screen">
        <ThemedText
          type="title"
          className="line-clamp-1 py-6 px-4 text-center font-omedium"
        >
          Daftar Pesanan
        </ThemedText>

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
            />
          )}
        />
      </SafeAreaView>
    </RefreshControl>
  );
};

interface ListOrderProps {
  item: Order;
  expanded: boolean;
  onClickExpand: (id: string) => void;
}
const ListOrder: React.FC<ListOrderProps> = ({
  item,
  expanded,
  onClickExpand,
}) => {
  const name = item.orderItems
    .slice(0, 3)
    .map((item) => item?.name)
    .join(", ");

  let buttonText = "";
  if (item.finishedAt) {
    buttonText = "Edit Pesanan";
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
          <Entypo name="chevron-thin-right" size={18} />
        </View>
      </View>
      {expanded && (
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
              Total Harga : {formatRupiah(item.totalSellPrice)}
            </ThemedText>
          </View>
          <View className="w-[40%] flex flex-col items-end space-y-2">
            <ThemedText className={`text-sm ${statusColor}`}>
              {textDate}
            </ThemedText>
            <TouchableOpacity
              className={`w-fit h-fit px-6 py-2 rounded-xl ${buttonColor}`}
            >
              <ThemedText className="text-white">{buttonText}</ThemedText>
            </TouchableOpacity>
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

  return {
    data,
    loading,
    fetchData,
    onClickExpand,
    selected,
    onClickSection,
    selectedSection,
    sections,
  };
};

export default OrderScreen;
