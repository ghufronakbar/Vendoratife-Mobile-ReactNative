const formatRupiah = (number?: number | null) => {
  if (!number) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

export default formatRupiah;
