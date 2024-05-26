import { NavLink, useLocation } from "react-router-dom";
import { AuthTypes } from "../../enums/Enums";
import "./Header.css";
import HeaderAuthBlock from "./HeaderAuthBlock/HeaderAuthBlock";
import { usePage } from "../../store/store";
import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

const Header: React.FC = () => {
    const page = usePage(state => state.page);
    const cookies = new Cookies();
    const location = useLocation(); // Use the useLocation hook to get the current location
    const [authType, setAuthType] = useState(cookies.get("authType"));

    // Update authType when location changes
    useEffect(() => {
        setAuthType(cookies.get("authType"));
    }, [location]);

    function renderNav() {
        if (authType === AuthTypes.NONE || authType === null) {
            return (
                <>
                    <NavLink to={getHomePagePath()} className="a_to_home">На главную</NavLink>
                </>
            );
        }
        if (authType === AuthTypes.USER) {
            return (
                <>
                    <NavLink to={"/"} className="a_to_home">На главную</NavLink>
                    <NavLink to={"/order"}>Заказать</NavLink>
                </>
            );
        }
        if (authType === AuthTypes.DRIVER) {
            return (
                <>
                    <NavLink to={"/driver"} className="a_to_home">На главную</NavLink>
                </>
            );
        }
        if (authType === AuthTypes.ANALYTIC) {
            return (
                <>
                    <NavLink to={"/analytic/accounts"} className="a_to_home">Действия с аккаунтами</NavLink>
                    <NavLink to={"/analytic/cars"} className="a_to_home">Действия с автомобилями</NavLink>
                    <NavLink to={"/analytic/orders"} className="a_to_home">Действия с заказами</NavLink>
                    <NavLink to={"/analytic/payments"} className="a_to_home">Действия с платежами</NavLink>
                </>
            );
        }
    }

    const getHomePagePath = () => {
        switch (authType) {
            case AuthTypes.NONE:
                return "/";
            case AuthTypes.USER:
                return "/";
            case AuthTypes.DRIVER:
                return "/driver";
            case AuthTypes.ANALYTIC:
                return "/analytic";
            default:
                return "/";
        }
    };

    return (
        <header>
            <div className="main_header_info">
                <NavLink to={getHomePagePath()}>
                    <img className="logo" src="/public/assets/logo.png" alt="logo"/>
                </NavLink>
                <nav>
                    {renderNav()}
                </nav>
                <HeaderAuthBlock />
            </div>
        </header>
    );
}

export default Header;
