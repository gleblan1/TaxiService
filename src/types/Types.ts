import { Categories, OrderTypes } from "../enums/Enums"

export type OrderDto = {
  from: {
    name: string,
    lat: number,
    long: number
  },
  to: {
    name: string,
    lat: number,
    long: number
  },
  duration: number,
  message: string,
  order_type: OrderTypes
}

export type UserRegDto = {
  created_at: string,
  email: string,
  id: number,
  name: string,
  phone_number: string,
  avg_rate: number,
  status: string,
  category: Categories,
  updated_at: string
}

export type UserAuthDto = {
  phoneNumber: string,
  password: string
}

export type ResponseErr = {
  code: number,
  message: string
}

export type CreateOrderRequest ={
    car_types: [
      {
        count: number,
        type: string
      }
    ],
    documents_required: boolean,
    duration: number,
    from: {
      lat: number,
      long: number,
      name: string
    },
    is_regular: boolean,
    message: string,
    mileage: number,
    order_time: string,
    order_type: string,
    recurrence: {
      end_date: string,
      frequency: number,
      interval_type: string
    },
    to: {
      lat: number,
      long: number,
      name: string
    },
    user_id: number
}

export type CarType ={
  count: number,
  type: string
}

export type token = {
  accessToken: string;
  refreshToken: string;
}

export type CarDriver = {
  car: Car;
  driver: Driver;
};

export type Order = {
  car_driver: CarDriver[]
  cost: number
  created_at: string;
  documents_required: boolean;
  duration: number;
  finished_at: string;
  from: {
    lat: number;
    long: number;
    name: string;
  };
  id: number;
  is_regular: boolean;
  message: string;
  mileage: number;
  order_time: string;
  order_type: string;
  recurrence_end_date: string;
  started_at: string;
  status: string;
  to: {
    lat: number;
    long: number;
    name: string;
  };
  user_id: number;
};

export type Orders = {
  orders: Order[]
}

export type OrdersRequestBody = {
  limit: number
  page: number
  sort: string
};

export type OrderCost = {
  car_types: CarType[]
  from: {
    lat: number,
    long: number,
    name: string
  },
  order_type: string,
  to: {
    lat: number,
    long: number,
    name: string
  }
}

export type Driver = {
  avg_rate: number,
  category: string,
  email: string,
  id: number,
  name: string,
  phone_number: string,
  status: string
}

export type User = {
  avg_rate: number,
  email: string,
  id: number,
  name: string,
  phone_number: string,
  status: string
}

export type Account = {
  driver: Driver,
  user: User
}

export type Accounts = {
  accounts: Account[]
}

export type AccountsRequestBody = {
    limit: number,
    page: number,
    role: string,
    sort: string
}

export type CreateDriverRequest = {
    category: string,
    email: string,
    name: string,
    password: string,
    phone_number: string
}

export type LimitRequest = {
    limit: number
    page: number
}

export type Car ={
  car_type: string,
  driver: number,
  gas_consumption: number,
  id: number,
  name: string,
  number: string,
  status: string
}

export type NewCarRequest = {
  car_type: string,
  driver: number,
  name: string,
  number: string,
  gas_consumption: number,
}

export type CarUpdateRequest = {
  field: string,
  value: string
}

export type Payment={
  amount: number,
  customer: number,
  id: number,
  network: string,
  status: string
}

export type OrderLocation={
  lat: number,
  lng: number
}

export type UserProfile = {
  name: string,
  phone_number: string,
  email: string,
}

export type DriverFilter ={
  category: string,
  status: string
}

export type AvailableDrivers = {
  avg_rate: number,
  category: string,
  email: string,
  id: number,
  name: string,
  phone_number: string,
  status: string
}

export type AvailableCars = {
  car_type: string,
  driver: number,
  gas_consumption: number,
  id: number,
  name: string,
  number: string,
  status: string
}

export type Available ={
  cars: AvailableCars[],
  drivers: AvailableDrivers[]
}

export type car_driver_pairs = {
  car_id: number,
  driver_id: number
}