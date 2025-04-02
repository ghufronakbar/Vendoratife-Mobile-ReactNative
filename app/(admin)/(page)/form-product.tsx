import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import FormInput from "@/components/ui/FormInput";
import LoadingView from "@/components/ui/LoadingView";
import SelectImage from "@/components/ui/SelectImage";
import { Ionicons } from "@expo/vector-icons";
import { toastError, toastSuccess } from "@/helper/toast";
import api from "@/config/api";
import { Api } from "@/models/Response";
import { Product } from "@/models/Product";
import { Dropdown } from "react-native-element-dropdown";
import ModalConfirmation from "@/components/ui/ModalConfirmation";

const FormProduct = () => {
  const {
    form,
    loading,
    onChange,
    UNITS,
    handleSubmit,
    pending,
    id,
    Confirmation,
  } = useProduct();

  if (loading) return <LoadingView />;

  return (
    <ScrollView className="px-5 flex-1 bg-white min-h-screen">
      <View>
        <View className="flex-row">
          <ThemedText className="text-3xl font-obold">Yuk, </ThemedText>
          <ThemedText className="text-3xl font-obold text-custom-1">
            Lengkapi Produk
          </ThemedText>
        </View>
        <View className="flex flex-col space-y-2 mt-4">
          <FormInput
            label="Nama Produk"
            value={form.name}
            onChangeText={(text) => onChange("name", text)}
          />
          <FormInput
            label="Modal Produk (Rp)"
            value={form.buyPrice}
            onChangeText={(text) => onChange("buyPrice", text)}
            keyboardType="numeric"
          />
          <FormInput
            label="Harga Jual (Rp)"
            value={form.sellPrice}
            onChangeText={(text) => onChange("sellPrice", text)}
            keyboardType="numeric"
          />
          <View className="bg-white z-10 w-10 h-4 -mb-4 ml-2">
            <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
              Satuan
            </ThemedText>
          </View>
          <Dropdown
            data={UNITS}
            labelField="label"
            valueField="value"
            value={form.unit}
            onChange={(item) => onChange("unit", item.value)}
            search={false}
            placeholder="Pilih Satuan"
            placeholderStyle={{
              fontFamily: "Outfit-Regular",
              fontSize: 16,
              color: "#181D27",
            }}
            itemTextStyle={{
              fontFamily: "Outfit-Regular",
              fontSize: 16,
              color: "#181D27",
            }}
            containerStyle={{
              backgroundColor: "white",
              borderRadius: 10,
              borderWidth: 0,
            }}
            itemContainerStyle={{
              borderRadius: 10,
            }}
            activeColor={"#f0f0f0"}
            selectedTextStyle={{
              fontFamily: "Outfit-Regular",
              fontSize: 16,
              color: "#181D27",
            }}
            style={{
              borderColor: "#A0A0A0",
              borderWidth: 1,
              borderRadius: 10,
              padding: 12,
              marginBottom: 8,
            }}
          />
          <View className="z-10 w-15 h-4 -mb-1 ml-2">
            <ThemedText className="ml-1 text-gray-700 font-oregular text-xs">
              Foto Produk
            </ThemedText>
          </View>
          <SelectImage
            image={form.image}
            onChangeImage={(value) => onChange("image", value)}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            className="mb-4 p-3 flex items-center justify-center rounded-lg bg-custom-1 mt-4"
          >
            <ThemedText className="text-white font-oregular text-lg">
              {pending ? (
                <ActivityIndicator color="white" />
              ) : id ? (
                "Simpan"
              ) : (
                "Tambahkan"
              )}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <Confirmation />
    </ScrollView>
  );
};

interface ProductDTO {
  name: string;
  sellPrice: string;
  buyPrice: string;
  unit: string;
  image: string | null;
}

const initProductDTO: ProductDTO = {
  name: "",
  sellPrice: "",
  buyPrice: "",
  unit: "kg",
  image: null,
};

const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [form, setForm] = useState(initProductDTO);
  const id = (useLocalSearchParams().id as string) || "";
  useNavigation().setOptions({
    title: id ? "Edit Produk" : "Tambah Produk",
    headerRight: () =>
      !id ? null : (
        <TouchableOpacity
          onPress={onClickDel}
          style={{
            padding: 12,
            position: "relative",
            zIndex: 10,
            borderRadius: 16,
            marginRight: 6,
            marginVertical: 32,
            backgroundColor: "white",
          }}
        >
          <Ionicons name="trash-outline" size={26} color={"#F44336"} />
        </TouchableOpacity>
      ),
    headerShown: !loading,
  });

  const onClickDel = () => {
    setOpenDel(!openDel);
  };

  const onChange = (key: keyof ProductDTO, value: string | null) => {
    setForm({ ...form, [key]: value });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Api<Product>>(`/products/${id}`);
      setForm({
        name: res.data.data.name,
        buyPrice: res.data.data.buyPrice.toString(),
        sellPrice: res.data.data.sellPrice.toString(),
        unit: res.data.data.unit,
        image: res.data.data.image,
      });
      setLoading(false);
    } catch (error) {
      toastError(error);
      router.back();
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const UNITS = [
    {
      label: "pcs",
      value: "pcs",
    },
    {
      label: "kg",
      value: "kg",
    },
    {
      label: "liter",
      value: "liter",
    },
    {
      label: "package",
      value: "package",
    },
    {
      label: "box",
      value: "box",
    },
  ];

  const handleSubmit = async () => {
    try {
      Object.values(form).forEach((value) => {
        if (value === "") {
          throw new Error("Harap isi semua data");
        }
      });
      if (pending || loading) return;
      setPending(true);
      if (id) {
        const res = await api.put<Api<Product>>(`/products/${id}`, form);
        toastSuccess(res?.data?.message);
      } else {
        const res = await api.post<Api<Product>>("/products", form);
        toastSuccess(res?.data?.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (pending || loading) return;
      setPending(true);
      onClickDel();
      const res = await api.delete<Api<Product>>(`/products/${id}`);
      toastSuccess(res?.data?.message);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      console.log(error);
      toastError(error);
    } finally {
      setPending(false);
    }
  };

  const Confirmation = () => (
    <ModalConfirmation
      onConfirm={handleDelete}
      setShowAlert={setOpenDel}
      showAlert={openDel}
    />
  );

  return {
    form,
    onChange,
    loading,
    UNITS,
    handleSubmit,
    pending,
    id,
    Confirmation,
  };
};

export default FormProduct;
