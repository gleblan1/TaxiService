import "./AnalyticPage.css";

import CarsReqSection from "./CarsReqSection/CarsReqSection";
import OrdersReqSection from "./OrdersReqSection/OrdersReqSection";
import AccountsReqSection from "./AccountsReqSection/AccountsReqSection";
import PaymentsReqSection from "./PaymentsReqSection/PaymentsReqSection";
import React from "react";
import { Outlet } from "react-router-dom";

const AnalyticPage: React.FC = () => {
    return (
        <main id="analytic_page">
            <AccountsReqSection></AccountsReqSection>
            {/* <AccountsReqSection></AccountsReqSection>
            <CarsReqSection></CarsReqSection>
            <OrdersReqSection></OrdersReqSection>
            <PaymentsReqSection></PaymentsReqSection> */}
            <Outlet/>
        </main>
    );
}

export default AnalyticPage;