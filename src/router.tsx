import { createBrowserRouter } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage/HomePage";
import AuthPage from "./Components/Pages/AuthPage/AuthPage";
import RegPage from "./Components/Pages/RegPage/RegPage";
import AccountPage from "./Components/Pages/AccountPage/AccountPage";
import OrderPage from "./Components/Pages/OrderPage/OrderPage";
import DriverPage from "./Components/Pages/DriverPage/DriverPage";
import AnalyticPage from "./Components/Pages/AnalyticPage/AnalyticPage";
import { Layout } from "./Components/Layout";
import { useAuthStore } from "./store/store";
import React from "react";
import { OrderDetailsPage } from "./Components/Pages/AnalyticPage/OrdersReqSection/OrderDeatilsPage/OrderDetailsPage";
import AccountsReqSection from "./Components/Pages/AnalyticPage/AccountsReqSection/AccountsReqSection";
import CarsReqSection from "./Components/Pages/AnalyticPage/CarsReqSection/CarsReqSection";
import OrdersReqSection from "./Components/Pages/AnalyticPage/OrdersReqSection/OrdersReqSection";
import PaymentsReqSection from "./Components/Pages/AnalyticPage/PaymentsReqSection/PaymentsReqSection";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/reg",
        element: <RegPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
      {
        path: "/order",
        element: <OrderPage />,
      },
      {
        path: "/driver",
        element: <DriverPage />,
      },
      {
        path: "/analytic",
        element: <AnalyticPage />,
      },
      {
        path: "/order/details/:id",
        element: <OrderDetailsPage></OrderDetailsPage>
      },
      {
        path: "/analytic/accounts",
        element: <AccountsReqSection></AccountsReqSection>
      },
      {
        path: "/analytic/cars",
        element: <CarsReqSection></CarsReqSection>
      },
      {
        path: "/analytic/orders",
        element: <OrdersReqSection></OrdersReqSection>
      },
      {
        path: "/analytic/payments",
        element: <PaymentsReqSection></PaymentsReqSection>
      }
    ],
  },
]);

{/* <NavLink to={"/analytic/accounts"} className="a_to_home">Действия с аккаунтами</NavLink>
<NavLink to={"/analytic/cars"} className="a_to_home">Действия с автомобилями</NavLink>
<NavLink to={"/analytic/orders"} className="a_to_home">Действия с заказами</NavLink>
<NavLink to={"/analytic/payments"} className="a_to_home">Действия с платежами</NavLink> */}