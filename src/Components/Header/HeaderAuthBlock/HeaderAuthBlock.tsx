import {NavLink, useNavigate} from "react-router-dom";
import { AuthActionTypes, AuthTypes, PagesEnum } from "../../../enums/Enums";
import "./HeaderAuthBlock.css";
import { api } from "../../../axios/api";
import { ResponseErr } from "../../../types/Types";
import { useAuthStore, usePage, usePhone, useUser } from "../../../store/store";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import React from "react";

const HeaderAuthBlock: React.FC = () => {
    const page = usePage(state => state.page);
    const authType = useAuthStore(state => state.authType);
    const setPageStore = usePage(state => state.setPage);
    const setAuth = useAuthStore(state => state.setAuthType);;
    const [token, setToken] = useState<string>("");
    const cookies = new Cookies();
    const phone = localStorage.getItem("phone")

    const navigateTo = useNavigate()


    function setPage(page: PagesEnum) {
        setPageStore(page)
    }

    function setAuthType(newAuthType: AuthTypes) {
        setAuth(newAuthType)
        console.log(authType)
    }
    console.log(authType, 1)
    return (
        <div className="auth_buttons">            
            {!cookies.get("token") &&
            <>
                <NavLink to="/auth" className="basic_button nav_link">
                    <span className="button_text">Вход</span>
                </NavLink>     
                <NavLink to="/reg" className="button_reg nav_link">
                    <span className="button_text">Регистрация</span>
                </NavLink>          
            </>
            }
            {cookies.get("token") &&
                <>
                    <input type="checkbox" id="profile_checkbox"/>
                    <div className="profile_button_wrapper">
                        <label htmlFor="profile_checkbox" className="profile_button">
                            <div></div>    
                        </label>
                        {/* todo select from store */}
                        <p>{phone}</p>                
                    </div>
                    <div className="profile_nav">
                        <nav>
                            {cookies.get("authType") !== AuthTypes.ANALYTIC && <label htmlFor="profile_checkbox">
                                <NavLink to={"/account"}>Ваш профиль</NavLink></label>}
                            
                            <label htmlFor="profile_checkbox" onClick={() => {
                                api.post("account/logout",{}).then(res=>res.data).finally(() => {
                                    cookies.remove("token", { path: '/' })
                                    cookies.remove("authType", { path: '/' });
                                    setAuthType(AuthTypes.NONE);
                                    navigateTo("/")
                                })
                                    .catch((err: ResponseErr) => {
                                    console.log(err);
                                })
                            }}><NavLink to={"/"}>Выйти</NavLink></label>
                        </nav>
                    </div>           
                </>
            }
        </div>          
    );
}

export default HeaderAuthBlock;

function setToken(arg0: string) {
    throw new Error("Function not implemented.");
}
