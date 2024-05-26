import "./AuthForm.css";
import "./../../FormBase.css";
import { AuthTypes } from "../../../../enums/Enums";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../../axios/api";
import { ResponseErr, token } from "../../../../types/Types";
import { createForm, field } from "react-fluent-form";
import {  useNavigate } from 'react-router-dom'
import { useAuthStore, usePage, usePhone, useUser } from "../../../../store/store";
import { Cookies } from "react-cookie";
import React from "react";

const AuthForm: React.FC = () => {
    const { setAuthType, authType } = useAuthStore(state => state);
    const [isErr, setIsErr] = useState<boolean>(false);
    const [supposedAuthType, setSupposedAuthType] = useState<AuthTypes>(AuthTypes.USER);
    const [isValidatedPassword, setIsValidatedPassword] = useState<boolean>(true);
    const [isValidatedPhone, setIsValidatedPhone] = useState<boolean>(true);
    const phoneRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const setUserPhone = usePhone(state => state.setPhone);
    const cookie = new Cookies();

    const authorizeUser = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(passwordRef.current?.value, phoneRef.current?.value);
        const password = passwordRef.current?.value ?? "";
        const phone = phoneRef.current?.value ?? "";
        const regex: RegExp = /^\+375\d{9}$/;

        let isPasswordValid = true;
        let isPhoneValid = true;
    
        if (password === "" || password === null || password?.length < 8) {
            isPasswordValid = false;
        }
    
        if (phone === "" || phone === null || !regex.test(phone)) {
            isPhoneValid = false;
        }
    
        setIsValidatedPassword(isPasswordValid);
        setIsValidatedPhone(isPhoneValid);
    
        if (!isPasswordValid || !isPhoneValid) {
            return;
        }

        

        switch (supposedAuthType) {
            case AuthTypes.DRIVER:
                api.post("driver/sign-in", {
                    password: password,
                    phone_number: phoneRef.current?.value,
                })
                .then(resp=>resp.data)
                .then((data: any) => {                    
                    const tokenData: token = {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken
                    };
                    
                    cookie.set("token", tokenData.accessToken, {path: "/"});

                    navigate("/driver/");
                    setAuthType(supposedAuthType)
                    cookie.set("authType", supposedAuthType, {path: "/"});
                    setUserPhone(phoneRef.current?.value as string);
                })
                .catch((err: ResponseErr)  => {
                    setAuthType(AuthTypes.NONE);
                    cookie.set("authType", AuthTypes.NONE, {path: "/"});
                    setIsErr(true);
                    console.log("Error:", err);
                });
                break;
            case AuthTypes.ANALYTIC:
                api.post("admin/sign-in", {
                    password: password,
                    phone_number: phoneRef.current?.value,
                })
                .then(resp=>resp.data)
                .then((data: any) => {                    
                    const tokenData: token = {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken
                    };
                    
                    cookie.set("token", tokenData.accessToken, {path: "/"});
                    navigate("/analytic/");
                    setAuthType(supposedAuthType)
                    cookie.set("authType", supposedAuthType, {path: "/"});
                    setUserPhone(phoneRef.current?.value as string);
                })
                .catch((err: ResponseErr)  => {
                    setAuthType(AuthTypes.NONE);
                    cookie.set("authType", AuthTypes.NONE, {path: "/"});
                    setIsErr(true);
                    console.log("Error:", err);
                });
                break;
            default:
                api.post("user/sign-in", {
                    password: password,
                    phone_number: phoneRef.current?.value,
                })
                .then(resp=>resp.data)
                .then((data: any) => {

                    console.log(data)
                    
                    const tokenData: token = {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken
                    };
                    cookie.set("token", tokenData.accessToken, { path: "/" });
                    navigate("/");
                    setAuthType(supposedAuthType)
                    cookie.set("authType", supposedAuthType, {path: "/"});
                    setUserPhone(phoneRef.current?.value as string);
                })
                .catch((err: ResponseErr)  => {
                    setAuthType(AuthTypes.NONE);
                    cookie.set("authType", AuthTypes.NONE, {path: "/"});
                    setIsErr(true);
                    console.log("Error:", err);
                });
                break;
            }
            
    }
    
    return (
        <form id="auth_form" className="form_base" onSubmit={(e: React.FormEvent) => authorizeUser(e)}>
            <h2>Войдите, чтобы продолжить</h2>
            <div className="inputs_wrapper">
                <div className="input_wrapper">
                    <p>Телефон</p>
                    <input ref={phoneRef} type="text" placeholder="+375295555555"/>
                    {!isValidatedPhone && <p style={{ color: "red" }}>Вы ввели некорректный номер</p>}
                </div>
                <div className="input_wrapper">
                    {/* <p>Пароль</p> */}
                    <input ref={passwordRef} type="password" placeholder="Пароль"/>
                    {!isValidatedPassword && <p style={{ color: "red" }}>Вы ввели некорректный пароль</p>}
                </div>
                <div className="auth_type_wrapper">
                    <div className="radio_wrapper">
                        <input onChange={() => setSupposedAuthType(AuthTypes.USER)} 
                            type="radio" id="radio-user" name="auth_type_radios" defaultChecked/>
                        <label htmlFor="radio-user">Заказчик</label>
                    </div>
                    <div className="radio_wrapper">
                        <input onChange={() => setSupposedAuthType(AuthTypes.DRIVER)} 
                            type="radio" id="radio-driver" name="auth_type_radios"/>
                        <label htmlFor="radio-driver">Водитель</label>
                    </div>
                    <div className="radio_wrapper">
                        <input onChange={() => setSupposedAuthType(AuthTypes.ANALYTIC)} 
                            type="radio" id="radio-analytic" name="auth_type_radios"/>
                        <label htmlFor="radio-analytic">Администратор</label>
                    </div>
                </div>          
            </div>
            {isErr && <p style={{ color: "red" }}>Ошибка авторизации</p>}
            <input type="submit" className="submit_button" value="Войти"/>
        </form>
    );
}

export default AuthForm;

