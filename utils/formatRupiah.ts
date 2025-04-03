const formatRupiah = (number?: number | null, withRp = true) => {
  if (!number) return "-";
  if (!withRp) {
    return number.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  }
};

export default formatRupiah;
