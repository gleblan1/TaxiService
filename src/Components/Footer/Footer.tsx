import { NavLink } from "react-router-dom";
import { PagesEnum } from "../../enums/Enums";
import "./Footer.css";
import { usePage } from "../../store/store";
import React from "react";

const Footer: React.FC = () => {
    const page = usePage(state => state.page);

    return (
        <footer>
            <div className="footer_contacts">
                <h3>Контакты</h3>
                <div>
                    <img src="assets/email_icon.png" alt="email" />
                    <a href="">driveease@gmail.com</a>
                </div>
                <div>
                    <img src="assets/phone_icon.png" alt="phone" />
                    <a href="">+375 (29) 555-5555</a>
                </div>
            </div>
            <div className="footer_navigation">
                <h3>Содержание</h3>
                <nav>
                    <a href="">Зарегистрироваться</a>
                    <a href="">Заказать автомобиль</a>
                    <a href="">О нас</a>
                    <a href="">Услуги</a>
                    <a href="">Связаться с нами</a>
                    <a href="">FAQ</a>
                </nav>
            </div>
            <div>
                <NavLink to={"/"}>
                    <img className="logo" src="/public/assets/logo_white.png" alt="logo" />
                </NavLink>
            </div>
        </footer>
    );
}

export default Footer;