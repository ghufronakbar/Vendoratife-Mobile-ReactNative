export interface Overview {
  order: {
    total: number;
    message: string;
  };
  sales: {
    totalIncome: number;
    totalProfit: number;
    averageTransactionValue: number;
  };
  orderItem: {
    total: number;
  };
}

export interface ChartProduct {
  keys: string[];
  chart: {
    month: string;
    [key: string]: number | string;
  }[];
}

export interface ChartIncome {
  keys: string[];
  chart: {
    month: string;
    [key: string]: number | string;
    total: number;
  }[];
}

export interface TopProduct {
  name: string;
  quantity: number;
  totalSellPrice: number;
}

export interface PartnerOverview {
  totalPartners: number;
  topPartners: {
    name: string;
    totalQuantity: number;
  }[];
}
