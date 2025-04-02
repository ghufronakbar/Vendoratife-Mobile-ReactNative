import { ThemedText } from "@/components/ThemedText";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { C } from "@/constants/Colors";
import { Product } from "@/models/Product";
import { Api } from "@/models/Response";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductScreen = () => {
  const { data, fetchData, loading } = useProducts();
  return (
    <RefreshControl refreshing={loading} onRefresh={fetchData}>
      <SafeAreaView className="bg-white min-h-screen">
        <ThemedText
          type="title"
          className="line-clamp-1 py-6 px-4 text-center font-omedium"
        >
          Daftar Produk
        </ThemedText>

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <ListProduct
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/(admin)/(page)/form-product",
                  params: {
                    id: item.id,
                  },
                })
              }
            />
          )}
        />
        <FloatingAddButton
          onPress={() => router.push("/(admin)/(page)/form-product")}
        />
      </SafeAreaView>
    </RefreshControl>
  );
};

interface ListProductProps {
  item: Product;
  onPress: () => void;
}
const ListProduct: React.FC<ListProductProps> = ({ item, onPress }) => {
  return (
    <Pressable
      className="w-full h-20 bg-white mb-2 border border-gray-200 rounded-2xl shadow-md flex flex-row items-center overflow-hidden py-2 px-2"
      style={{ elevation: 5 }}
      onPress={onPress}
    >
      <Img
        className="h-16 w-16 object-cover aspect-square rounded-xl mr-2"
        uri={item?.image}
      />
      <View className="flex flex-row justify-between items-center w-[75%]">
        <View className="flex flex-col">
          <ThemedText className="text-black">{item.name}</ThemedText>
          <ThemedText>{formatRupiah(item.sellPrice)}</ThemedText>
        </View>
        <Entypo name="chevron-thin-right" size={18} />
      </View>
    </Pressable>
  );
};

const useProducts = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Product[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const res = await api.get<Api<Product[]>>("/products");
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
  };
};

export default ProductScreen;
