import { useEffect, useState } from "react";
import "./DriverPage.css";
import OrderTableItem from "../AnalyticPage/OrdersReqSection/OrderTableItem/OrderTableItem";
import { useAuthStore, useDrive } from "../../../store/store";
import axios from "axios";
import { api } from "../../../axios/api";
import { Order, OrdersRequestBody } from "../../../types/Types";
import React from "react";
import { OrderDetailsPage } from "../AnalyticPage/OrdersReqSection/OrderDeatilsPage/OrderDetailsPage";

const DriverPage: React.FC = () => {
    const [hasOrder, setHasOrder] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isAccepted, setIsAccepted] = useState<boolean>(false)
    const [isStarted, setIsStarted] = useState<boolean>(false)
    const [_currentOrder, setCurrentOrder] = useState<Order>()
    const [isStopped, setIsStopped] = useState<boolean>(false)
    const [ordersToAccept, setOrdersToAccept] = useState<Order[]>()
    const [orderToAccept, setOrderToAccept] = useState<Order>()
    const [details, setDetails] = useState<Order>()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const params = new URLSearchParams();
                params.append('limit', '100');
                params.append('page', String(page));
                params.append('sort', 'created_at');

                const response = await api.get(`account/order?${params.toString()}`);
                console.log(response.data)
                setOrders(response.data);
                // const acceptedOrder = orders?.find((order: Order) => order.status === 'ACCEPTED');
                // setCurrentOrder(acceptedOrder || undefined);
                const startedOrder = orders?.find((order: Order) => order.status === 'IN_PROGRESS');
                setCurrentOrder(startedOrder || undefined);
                setIsAccepted( !(startedOrder === null))
                console.log("Is accepted: ", startedOrder, isAccepted)
                const assignedOrders = orders?.filter((order: Order) => order.status === 'ASSIGNED');
                setOrdersToAccept(assignedOrders);
                setOrderToAccept(assignedOrders.length > 0 ? assignedOrders[0] : undefined);
                setHasOrder(response?.data?.length > 0);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [page])

    console.log(_currentOrder)

    function handleStart(){
        api.post(`account/order/${_currentOrder?.id}/start`).then(()=>{
            setIsStarted(true)
        }).catch((error=>console.log(error)))

    }

    function handleAccept(){
        api.post(`account/order/${orderToAccept?.id}/accept`).then(()=>{
            setIsAccepted(true)
        }).catch((error=>console.log(error)))

    }

    function handleStop(){
        api.post(`account/order/${_currentOrder?.id}/quit`).then(()=>{
            setIsStopped(true)
        }).catch((error=>console.log(error)))
    }


    const leftPageClick = () => {
        console.log(page)
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
        console.log(page)
        setPage(page +1);
        console.log(page)
    }

    function handleInfo(id: number){
        const order = orders?.find((order: Order) => order.id === id);
        setDetails(order);
    }

    return (
        <main id="driver_page">
            <section id="section_current_order">
                <div>
                    <h2>Текущий заказ</h2>
                    <hr/>
                    <div className="form_base">
                        {(isAccepted || isStarted) && _currentOrder ?
                            <table>
                                <thead>
                                <th>Заказ</th>
                                </thead>
                                <tbody>
                                <tr>
                                    <OrderTableItem currentOrder={_currentOrder!}></OrderTableItem>
                                </tr>
                                </tbody>
                            </table>
                            :
                            <div className="div_no_orders">
                                <p>Текущих заказов нет.</p>
                            </div>
                        }
                    </div>
                </div>
                <div className="actions">
                    {!isStarted ?
                        <button disabled={isStarted} className="basic_button" style={{height: "50px"}}
                                onClick={handleStop}>Завершить </button> :
                        <button disabled={hasOrder && isAccepted} className="basic_button" style={{height: "50px"}}
                                onClick={handleStart}>Начать</button>
                    }
                    <p>Перед началом поездки нажмите кнопку "Начать".</p>
                </div>

            </section>
            <section id="section_order_to_accept">
                <div>
                    <h2>Назначенный заказ</h2>
                    <hr/>
                    <div className="form_base">
                        {!hasOrder ?
                            <table>
                                <thead>
                                <th>Заказ</th>
                                </thead>
                                <tbody>
                                <tr>
                                    <OrderTableItem currentOrder={orderToAccept!}></OrderTableItem>
                                </tr>
                                </tbody>
                            </table>
                            :
                            <div className="div_no_orders">
                                <p>Назначенных заказов нет.</p>
                            </div>
                        }
                    </div>
                </div>
                <div className="actions">
                        <button disabled={!hasOrder} className="basic_button" style={{height: "50px"}}
                                onClick={handleAccept}>Принять</button>
                        <button disabled={!hasOrder} className="basic_button" style={{height: "50px"}}
                                onClick={handleStop}>Отказаться </button>
                    <p>Вы можете принять заказ или отказаться от него.</p>
                </div>

            </section>
            <section className="section_history">
               <h2>Все заказы</h2>
               <hr/>
               <article>
                   <div>
                       <table>
                           <thead>
                           <th>ID</th>
                           <th>Отправление</th>
                           <th>Назначение</th>
                           <th>Стоимость</th>
                           <th>Дата заказа</th>
                           <th>Номер автомобиля</th>
                           <th>Тип</th>
                           <th></th>
                           </thead>
                           <tbody>
                           {orders?.map((order) => (
                               <tr>
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
                                   <td>{order?.car_driver && order.car_driver?.map((car) => {
                                       return car.car.number
                                   })}</td>
                                   <td>{order.order_type}</td>
                                   <td>
                                       <button className="info" id={String(order.id)}
                                               onClick={() => handleInfo(order.id)}>Подробнее
                                       </button>
                                   </td>
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
            {details &&
                <section id="section_current_order">
                    <div>
                        <h2>Детали заказа</h2>
                        <hr/>
                        <div className="form_base">
                        <table>
                            <thead>
                            <th>Заказ</th>
                            </thead>
                            <tbody>
                            <tr>
                                <OrderTableItem currentOrder={details!}></OrderTableItem>
                            </tr>
                            </tbody>
                        </table>
                        :
                        <div className="div_no_orders">
                            <p>Текущих заказов нет.</p>
                        </div>
                </div>
            </div>
        </section>
           }
        </main>
    );
}
export default DriverPage;
