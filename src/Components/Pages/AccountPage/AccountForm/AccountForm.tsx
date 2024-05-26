import React, { useState } from "react";
import "./AccountForm.css";
import "./../../FormBase.css";
import { api } from "../../../../axios/api";
import { ResponseErr } from "../../../../types/Types";
import { useAuthStore } from "../../../../store/store";
import { AuthTypes } from "../../../../enums/Enums";
import {Cookies} from "react-cookie";

const AccountForm: React.FC = () => {
    const cookies = new Cookies()
    const [email, setEmail] = useState<string>(cookies.get("email"));
    const [name, setName] = useState<string>(cookies.get("name"));
    const [phone, setPhone] = useState<string>(cookies.get("phone"));
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [isValidatedEmail, setIsValidatedEmail] = useState<boolean>(true);
    const [isValidatedName, setIsValidatedName] = useState<boolean>(true);
    const [isValidatedPhone, setIsValidatedPhone] = useState<boolean>(true);
    const [isValidatedOldPassword, setIsValidatedOldPassword] = useState<boolean>(true);
    const [isValidatedNewPassword, setIsValidatedNewPassword] = useState<boolean>(true);
    const [isDriverStatus, setIsDriverStatus] = useState<boolean>(false);
    const authType = useAuthStore(state => state.authType);



    const validateEmail = (email: string): boolean => {
        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateName = (name: string): boolean => {
        return name.trim() !== "";
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    const validatePhone = (phone: string): boolean => {
        const regex: RegExp = /^\+375\d{9}$/;
        return regex.test(phone);
    }

    const updateUser = (e: React.FormEvent) => {
        e.preventDefault();

        setIsValidatedEmail(validateEmail(email));
        setIsValidatedName(validateName(name));
        setIsValidatedOldPassword(validatePassword(oldPassword));
        setIsValidatedPhone(validatePhone(phone));


        if (validateEmail(email) && validateName(name) && validatePassword(oldPassword)) {
            if (email !== cookies.get("email")){
                api.patch("account", {
                    field: "EMAIL",
                    old_password: oldPassword,
                    value: email
                })
                    .then(res => res.data)
                    .then(() => {
                        cookies.set("email", email)
                    })
                    .catch((err: ResponseErr)  => {
                        console.log(err);
                    });
            }
            if (name !== cookies.get("name")){
                api.patch("account", {
                    field: "NAME",
                    old_password: oldPassword,
                    value: name
                })
                    .then(res => res.data)
                    .then(() => {
                        cookies.set("name", name)
                    })
                    .catch((err: ResponseErr)  => {
                        console.log(err);
                    });
            }
            if (phone !== cookies.get("phone")){
                api.patch("account", {
                    field: "PHONE_NUMBER",
                    old_password: oldPassword,
                    value: phone
                })
                    .then(res => res.data)
                    .then(() => {
                        cookies.set("phone", phone)
                    })
                    .catch((err: ResponseErr)  => {
                        console.log(err);
                    });
            }
        }
    };
    
    return (
        <form id="account_form" className="form_base" onSubmit={(e: React.FormEvent) => updateUser(e)}>
            <div className="inputs_wrapper">
                <div className="input_wrapper">
                    <p>Email</p>
                    <input
                        type="text"
                        placeholder="example@gmail.com"
                        defaultValue={cookies.get("email")}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {!isValidatedEmail && <p style={{ color: "red" }}>Вы ввели некорректный email</p>}
                </div>
                <div className="input_wrapper">
                    <p>Имя</p>
                    <input
                        type="text"
                        placeholder="Имя"
                        defaultValue={cookies.get("name")}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {!isValidatedName && <p style={{ color: "red" }}>Некорректное значение имени</p>}
                </div>
                <div className="input_wrapper">
                    <p>Номер телефона</p>
                    <input
                        type="text"
                        placeholder="+375()___-__-__"
                        defaultValue={cookies.get("phone")}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {!isValidatedPhone && <p style={{ color: "red" }}>Некорректный номер телефона</p>}
                </div>
                <div className="passwords_wrapper">
                    <div className="input_wrapper">
                        <p>Старый пароль</p>
                        <input
                            type="password"
                            placeholder="Старый пароль"
                            defaultValue={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        {!isValidatedOldPassword && <p style={{ color: "red" }}>Пароль должен содержать не менее 8 символов</p>}
                    </div>
                    <div className="input_wrapper">
                        <p>Новый пароль</p>
                        <input
                            type="password"
                            placeholder="Новый пароль"
                            defaultValue={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {!isValidatedNewPassword && <p style={{ color: "red" }}>Пароль должен содержать не менее 8 символов</p>}
                    </div>
                </div>             
            </div>
            {authType === AuthTypes.DRIVER && (
                <div className="driver_status_wrapper">
                    <label>
                        <input
                            type="checkbox"
                            checked={isDriverStatus}
                            onChange={() => setIsDriverStatus(!isDriverStatus)}
                        />
                        Занят
                    </label>
                </div>
            )}
            <input type="submit" className="submit_button" value="Сохранить"/>
        </form>
    );
}

export default AccountForm;
