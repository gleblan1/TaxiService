import { useNavigate } from "react-router-dom";
import { AuthTypes, PagesEnum } from "../../../enums/Enums";
import "./HomePage.css";
import { useAuthStore, usePage } from "../../../store/store";
import React from "react";

const HomePage: React.FC = () => {
    const authType = useAuthStore(state => state.authType);
    const { page } = usePage();
    const navigator = useNavigate();

    const orderButtonClick = () => {
        authType === AuthTypes.USER ?
            navigator("/order") :
            navigator("/auth");
    }

    return (
        <main id="home_page">
            <section id="section_welcome">
                <div className="blackout">
                    <h1>Drive Ease</h1>
                    <h2>Индивидуальный подход к каждой поездке: автомобили с водителями для вашего комфорта.</h2>
                    <button className="start_button" onClick={orderButtonClick}>Заказать</button>
                </div>
            </section>
            <section id="section_about">
                <div className="about_content">
                    <h2>О нас</h2>
                    <hr/>
                    <p>Добро пожаловать в <b>Drive Ease</b> – Ваш надежный партнер в области транспортных
                        услуг. Мы специализируемся на предоставлении высококачественных автомобилей для различных нужд,
                        от повседневных поездок до организации масштабных мероприятий.</p>
                    <p>Наша миссия – обеспечить комфортное, безопасное и своевременное обслуживание для каждого клиента.
                        Мы предлагаем автомобили всех классов, включая эконом, комфорт, бизнес и лимузины, чтобы
                        удовлетворить любые запросы.</p>
                    <p>В <b>Drive Ease</b> мы стремимся к совершенству, постоянно улучшая наш сервис и внедряя
                        современные технологии для удобства наших клиентов. Доверьте свои транспортные задачи
                        профессионалам и наслаждайтесь комфортом и надежностью наших услуг.</p>
                </div>

                <div className="about_picture"></div>
            </section>
            <section id="section_services">
                <div className="blackout_2">
                    <h2>Наши услуги</h2>
                    <hr/>
                    <ul className="services_list">
                        <li>Предоставляем автомобили различных классов: эконом, комфорт и бизнес, чтобы удовлетворить
                            любые потребности в поездках.
                        </li>
                        <li>Для особых случаев мы предлагаем роскошные лимузины, идеально подходящие для свадеб и других
                            торжественных мероприятий.
                        </li>
                        <li>Организуем транспортировку групп людей на массовые мероприятия, предоставляя автобусы и
                            минивэны.
                        </li>
                        <li>Возможность заказа нескольких автомобилей разных типов для максимального удобства.</li>
                        <li>Опция создания регулярных заказов для постоянных поездок по заданному расписанию.</li>
                    </ul>
                </div>
            </section>
            <section id="section_contact">
                <h2>Связаться с нами</h2>
                <hr/>
                <div className="contact_content">
                    <form>
                        <input type="tel" placeholder="Номер телефона"/>
                        <input type="text" placeholder="Имя"/>
                        <textarea placeholder="Вопрос"/>
                        <input className="basic_button" type="submit" value="Оставить заявку"/>
                    </form>
                    <div>
                        <p>Если у Вас возникли вопросы или требуется консультация, Вы можете связаться с нами, заполнив
                            и отправив форму.</p>
                        <p>Также Вы можете написать нам по электронной почте:</p>
                        <div className="contacts">
                            <div className="contacts_email">
                                <img src="assets/email_icon.png" alt="Электронная почта"/>
                                <a href="mailto:driveease@gmail.com">driveease@gmail.com</a>
                            </div>
                        </div>
                        <p>
                            <strong>
                                <em>Мы ответим Вам в кратчайшие сроки.</em>
                            </strong>
                        </p>

                    </div>
                </div>
            </section>
        </main>
    );
}

export default HomePage;
