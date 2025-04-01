export interface User {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  address: string;
  role: Role;
  image: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
}

export type Role = "Employee" | "Admin";
