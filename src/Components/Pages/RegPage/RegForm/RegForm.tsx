import React, { useRef, useState } from "react";
import "./RegForm.css";
import "./../../FormBase.css";
import { api } from "../../../../axios/api";
import { ResponseErr, token } from "../../../../types/Types";
import { useAuthStore, usePhone, useUser } from "../../../../store/store";
import { AuthTypes } from "../../../../enums/Enums";
import {Cookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

type RegRequest = {
        email: string
        name: string
        password: string
        phone_number: string
}

const RegForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [isErr, setIsErr] = useState<boolean>(false);
    const setAuthType = useAuthStore(state => state.setAuthType);
    const [password, setPassword] = useState<string>("");
    const [isValidatedEmail, setIsValidatedEmail] = useState<boolean>(true);
    const [isValidatedPhone, setIsValidatedPhone] = useState<boolean>(true);
    const [isValidatedName, setIsValidatedName] = useState<boolean>(true);
    const [isValidatedPassword, setIsValidatedPassword] = useState<boolean>(true);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const setUserPhone = usePhone(state => state.setPhone);

    const navigator = useNavigate()
    
    const {user, setUser} = useUser(state => state);

    const cookie = new Cookies();

    const validateEmail = (email: string): boolean => {
        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const regex: RegExp = /^\+375\d{9}$/;
        return regex.test(phone);
    };

    const validateName = (name: string): boolean => {
        return name.trim() !== "";
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const emailValue = emailRef.current?.value || "";
        const phoneValue = phoneRef.current?.value || "";
        const nameValue = nameRef.current?.value || "";
        const passwordValue = passwordRef.current?.value || "";

        setIsValidatedEmail(validateEmail(emailValue));
        setIsValidatedPhone(validatePhone(phoneValue));
        setIsValidatedName(validateName(nameValue));
        setIsValidatedPassword(validatePassword(passwordValue));



        if (validateEmail(emailValue) && validatePhone(phoneValue) && validateName(nameValue) && validatePassword(passwordValue)) {
           const regBody: RegRequest = {
               email: emailValue,
               name: nameValue,
               phone_number: phoneValue,
               password: passwordValue
           } 
            api.post("user/sign-up", regBody)
            .then(res => res.data)
            .then((data) => {
                setUserPhone(phone);
                setUser({
                    name: name,
                    phone_number: phone,
                    email: email,
                })
                cookie.set("name", name)
                cookie.set("email", email)
                cookie.set("phone", phone)
                console.log(data)
                navigator("/")
            })
            .catch((err: ResponseErr)  => {
                console.log(1)
            });
        }
    };

    return (
        <form id="reg_form" className="form_base" onSubmit={handleSubmit}>
            <h2>Регистрация</h2>
            <div className="inputs_wrapper">
                <div className="input_wrapper">
                    <p>Email</p>
                    <input
                        ref={emailRef}
                        type="text"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!isValidatedEmail && <p style={{ color: "red" }}>Вы ввели некорректный email</p>}
                </div>
                <div className="input_wrapper">
                    <p>Телефон</p>
                    <input
                        ref={phoneRef}
                        type="text"
                        placeholder="+375295555555"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {!isValidatedPhone && <p style={{ color: "red" }}>Вы ввели некорректный номер телефона</p>}
                </div>
                <div className="input_wrapper">
                    <p>Имя</p>
                    <input
                        ref={nameRef}
                        type="text"
                        placeholder="Имя Фамилия"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {!isValidatedName && <p style={{ color: "red" }}>Поле Имя не может быть пустым</p>}
                </div>
                <div className="input_wrapper">
                    <p>Пароль</p>
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isValidatedPassword && <p style={{ color: "red" }}>Пароль должен содержать не менее 8 символов</p>}
                </div>
            </div>
            {isErr && <p style={{ color: "red" }}>Ошибка регистрации</p>}
            <input type="submit" className="submit_button" value="Зарегистрироваться" />
        </form>
    );
}

export default RegForm;
