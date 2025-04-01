import { ThemedText } from "@/components/ThemedText";
import { Img } from "@/components/ui/Img";
import api from "@/config/api";
import { Product } from "@/models/Product";
import { Api } from "@/models/Response";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductScreen = () => {
  const { data, fetchData, loading } = useProducts();
  return (
    <SafeAreaView className="bg-white min-h-screen">
      <ThemedText
        type="title"
        className="line-clamp-1 py-6 px-4 text-center font-omedium"
      >
        Daftar Produk
      </ThemedText>

      <FlatList
        data={data}
        refreshing={loading}
        onRefresh={fetchData}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <ListProduct item={item} />}
      />
      {!loading && data.length === 0 && (
        <View className="w-full items-center justify-center h-40">
          <ThemedText type="default" className="text-neutral-400">
            Tidak ada produk
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
};

interface ListProductProps {
  item: Product;
}
const ListProduct: React.FC<ListProductProps> = ({ item }) => {
  return (
    <Pressable
      className="w-full h-20 bg-white mb-2 border border-gray-200 rounded-2xl shadow-md flex flex-row items-center overflow-hidden py-2 px-2"
      style={{ elevation: 5 }}
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

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    fetchData,
  };
};

export default ProductScreen;
