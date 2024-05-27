import "./OrderPage.css";
import "./../FormBase.css";
import OrderForm from "./OrderForm/OrderForm";
import { useEffect, useState } from "react";
import { api } from "../../../axios/api";
import { Order, Orders, OrdersRequestBody, ResponseErr } from "../../../types/Types";
import {OrderTypes, Statuses} from "../../../enums/Enums";
import React from "react";
import docs from "../../../../public/assets/Акт выполненных работ.pdf"
import agreement from "../../../../public/assets/Договор на услуги транспорта.pdf"
import { useDocuments } from "../../../store/store";



const OrderPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [orders, setOrders] = useState<Order[]>([]);
    const [requiredOrders, setRequiredOrders] = useState<number[]>([]);
    
    const leftPageClick = () => {
        if (page > 1) {
            setPage(page - 1);
            console.log(page)
        }
        else{
            setPage(1);
            console.log(page)
        }
    }

    const rightPageClick = () => {
        setPage(page + 1);
        console.log(page)
    }

    function handleCancelOrder(orderId: number) {
        api.post(`/account/order/${orderId}/user-quit`)
    }

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const params = new URLSearchParams();
                params.append('limit', '3');
                params.append('page', String(page));
                params.append('sort', 'id');
                const response = await api.get(`account/order?${params.toString()}`).then(res=>res.data).then(data=>{
                    setOrders(data)
                    orders.map((order) => {
                        if (order.documents_required){
                            setRequiredOrders([...requiredOrders, order.id]);
                        }
                    })
                }).catch(err=>console.log(err));
                } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [page]);

    function handleDownloadDocs() {
        console.log('Download docs');
    }

    return (
        <main id="order_page">
            <section className="section_history" id="section_order_history">
                <h2>История заказов</h2>
                <hr />
                    <article>
                        <div>
                            <table>
                                <thead>
                                <th></th>
                                <th>Отправление</th>
                                <th>Назначение</th>
                                <th>Стоимость</th>
                                <th>Дата заказа</th>
                                <th>Номера автомобилей</th>
                                <th>Водители</th>
                                <th>Тип</th>
                                <th>Статус</th>
                                <th>Акт выполненных работ</th>
                                <th>Договор на услуги</th>
                                <th></th>
                                </thead>
                                <tbody>
                                    {orders && orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.from.name}</td>
                                            <td>{order.to.name}</td>
                                            <td> {typeof order.cost === 'number' ? order.cost.toFixed(2) : ''}</td>
                                            <td>{new Date(order?.order_time).toLocaleString('ru-RU', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })}</td>
                                            <td>{order.car_driver?.map((driver) => driver.car.number).join(', ') || ''}</td>
                                            <td>{order.car_driver?.map((driver) => driver.driver.name).join(', ') || ''}</td>
                                            <td>{OrderTypes[order.order_type as keyof typeof OrderTypes]}</td>
                                            <td>{Statuses[order.status as keyof typeof Statuses]}</td>
                                            {requiredOrders.includes(order.id) &&
                                            <>
                                                <td>
                                                    <a href={docs} download={"Акт выполненных работ.pdf"}>
                                                        <button className="info" id={String(order.id)+"docs"}>Скачать документы</button>
                                                    </a>
                                                </td>
                                                <td>
                                                    <a href={agreement} download={"Договор на услуги.pdf"}>
                                                        <button className="info">Скачать документы</button>
                                                    </a>
                                                </td>
                                            </>
                                            }
                                            {order?.status === 'ASSIGNED' || order?.status === 'CREATED' || order?.status === 'ACCEPTED' ? <td></td> : <td><button className="info" onClick={()=>handleCancelOrder(order.id)}>Отменить</button></td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination_wrapper">
                            <button className="button-left" onClick={() => leftPageClick()}></button>
                            <button className="button-right" onClick={() => rightPageClick()}></button>
                        </div>                 
                    </article>
            </section>
            <section id="section_order_instruction">
                <h2>Как заказать?</h2>
                <div>
                    <p>Все очень просто!</p>
                    <ul>
                        <li>Для начала, заполните форму ниже. В поле "Начальный адрес" введите точный адрес места,
                            откуда начнется поездка.
                        </li>
                        <li>Далее, выберите один из следующих вариантов:
                            <ul>
                                <li>Напишите пункт назначения, или</li>
                                <li>Выберите аренду автомобиля на время (в этом случае выбор адреса назначения является
                                    опциональным, и расчет стоимости заказа будет по времени).
                                </li>
                            </ul>
                        </li>
                        <li>Обязательно подтвердите выбранные адреса после их ввода.</li>
                        <li>Выберите тип транспорта и количество машин. При необходимости, можно добавлять несколько
                            различных типов автомобилей.
                        </li>
                        <li>Выберите дату и время заказа.</li>
                        <li>При необходимости, можно оформить регулярный заказ. В этом случае выберите дату и время
                            окончания заказа, а также периодичность повторения.
                        </li>
                        <li>Для юридических лиц предоставляется возможность выбора документов по заказу, которые будут
                            доступны для скачивания по завершении заказа.
                        </li>
                        <li>Для просмотра предварительной стоимости заказа нажмите на кнопку "Рассчитать".</li>
                    </ul>
                    <p>Мы стремимся к улучшению нашего обслуживания и упрощению сайта, чтобы все было интуитивно понятным для всех пользователей. Если у вас есть предложения или вопросы, вы можете отправить их нам с помощью формы на главной странице.</p>
                </div>
            </section>
            <section id="section_order_order">
                <h2>Оформление заказа</h2>
                <hr />
                <OrderForm></OrderForm>
            </section>    
        </main>
    );
}

export default OrderPage;

