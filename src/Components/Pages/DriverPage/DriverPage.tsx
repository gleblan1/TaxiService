import { useEffect, useState } from "react";
import "./DriverPage.css";
import OrderTableItem from "../AnalyticPage/OrdersReqSection/OrderTableItem/OrderTableItem";
import { useAuthStore, useDrive } from "../../../store/store";
import axios from "axios";
import { api } from "../../../axios/api";
import { Order, OrdersRequestBody } from "../../../types/Types";
import React from "react";

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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const params = new URLSearchParams();
                params.append('limit', '100');
                params.append('page', String(page));
                params.append('sort', 'created_at');

                api.get(`account/order?${params.toString()}`).then(res => res.data).then(data=>{
                    setOrders(data)
                    setHasOrder(data?.length > 0);
                }).catch(err=>console.log(err));
                // const acceptedOrder = orders?.find((order: Order) => order.status === 'ACCEPTED');
                // setCurrentOrder(acceptedOrder || undefined);
                const startedOrder = orders?.find((order: Order) => order.status === 'IN_PROGRESS');
                setCurrentOrder(startedOrder || undefined);
                setIsAccepted( !(startedOrder === null))
                console.log("Is accepted: ", startedOrder, isAccepted)
                const assignedOrders = orders?.filter((order: Order) => order.status === 'ASSIGNED');
                setOrdersToAccept(assignedOrders);
                setOrderToAccept(assignedOrders.length > 0 ? assignedOrders[0] : undefined);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [page])

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
        //TODO: modal with order by id
    
        const order = orders.find((order: Order) => order.id === id);

        <section id="section_orders">
                <div>
                    <h2>История заказов</h2>
                    <hr/>
                    <div className="form_base">
                        {hasOrder ?
                            <table>
                                <thead>
                                <th>Заказ</th>
                                </thead>
                                <tbody>
                                <tr>
                                   <OrderTableItem currentOrder={order!}></OrderTableItem>
                                </tr>
                                </tbody>
                            </table>
                            :
                            <div className="div_no_orders">
                                <p>Вы еще не совершили заказов.</p>
                            </div>
                        }
                    </div>
                </div>
                <div className="actions">
                    <p>Тут отображается история ваших заказов.</p>
                </div>
            </section>
    }

    return (
        <main id="driver_page">
            <section id="section_current_order">
                <div>
                    <h2>Текущий заказ</h2>
                    <hr/>
                    <div className="form_base">
                        {isAccepted || isStarted ?
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
                           <th>Из</th>
                           <th>В</th>
                           <th>Цена</th>
                           <th>Автомобиль</th>
                           <th>Тип</th>
                           <th></th>
                           </thead>
                           <tbody>
                           {orders?.map((order) => (
                               <tr>
                                   <td>{order.id}</td>
                                   <td>{order.from.name}</td>
                                   <td>{order.to.name}</td>
                                   <td>{order.cost}</td>
                                   <td>{order?.car_driver && order.car_driver?.map((car) => {
                                       return car.car.number
                                   })}</td>
                                   <td>{order.order_type}</td>
                                   <td><button className="info" id={String(order.id)} onClick={() => handleInfo(order.id)}>Подробнее</button></td>
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
        </main>
    );
}
export default DriverPage;
