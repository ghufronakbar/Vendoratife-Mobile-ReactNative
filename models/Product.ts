import { OrderItem } from "./Order";

export interface Product {
  id: string;
  name: string;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  image: string | null;
  orderItems: OrderItem[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
