import { useEffect, useState } from "react";
import { api } from "../../../../axios/api";
import { Order } from "../../../../types/Types";
import OrderTableItem from "./OrderTableItem/OrderTableItem";
import React from "react";
import { OrderTypes, Statuses } from "../../../../enums/Enums";
import { useNavigate } from "react-router-dom";

const OrdersReqSection: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [numberToFind, setNumberToFind] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('active');
    const [typeFilter, setTypeFilter] = useState<string>('active');
    const [sort, setSort] = useState<string>('id');
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(0);

    const navigator = useNavigate();

    const leftPageClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (page > 1) {
            setPage(page - 1);
        }
        else{
            setPage(1);
        }
    }

    const rightPageClick = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(page + 1);
    }

    function handleInfo(e : React.FormEvent, id: number){
        e.preventDefault();
        navigator(`/order/details/${id}`);
    }

    function handleCancel(e : React.FormEvent, id: number){
        e.preventDefault();
        api.post(`admin/order/${id}/quit`).catch((err) => console.log(err));
    }

    useEffect(() => {
        const requestParams = {
            limit: '10',
            page: page,
            sort: 'id'
        };
        api.get('admin/order', { params: requestParams })
            .then(res => res.data)
            .then((data) => {
                const response: Order[] = data;
                console.log(response)
                console.log(statusFilter, typeFilter)
                setOrders(response.filter((order: Order) => order.status === statusFilter)
                .filter((order: Order) => order.order_type === typeFilter));
                console.log(orders);
                setCount(response.length);
            })
            .catch((err) => console.log(err));
    }, [statusFilter, typeFilter, sort, page]);

    

    return (
        <main id="analytic_page">
        <section id="section_requests-orders">
            <h2>Действия с заказами</h2>
            <form className="form_base" id="orders_req_form-all">
                <h3>Все заказы</h3>
                <input className="serach"
                    type="text"
                    placeholder="Номер машины"
                    onChange={(e) => setNumberToFind(e.target.value)}
                />
                <div className="filters_wrapper">
                    <div className="filters">
                        <p style={{marginBottom: "15px"}}>Фильтры</p>
                        <div>
                            <p>Статус</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="ABORTED">{Statuses.ABORTED}</option>
                                <option value="IN_PROGRESS">{Statuses.IN_PROGRESS}</option>
                                <option value="IN_PROCESSING">{Statuses.IN_PROCESSING}</option>
                                <option value="CREATED">{Statuses.CREATED}</option>
                                <option value="ASSIGNED">{Statuses.ASSIGNED}</option>
                                <option value="CLOSED">{Statuses.CLOSED}</option>
                            </select>
                        </div>
                        <div>
                            <p>Тип</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setTypeFilter(e.target.value)}>
                                <option value="DURATION">{OrderTypes.DURATION}</option>
                                <option value="DESTINATION">{OrderTypes.DESTINATION}</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <p style={{marginBottom: "15px"}}>Выберите тип сортировки</p>
                        <select name="typeOfCar" id="typeOfCar" onChange={(e) => setSort(e.target.value)}>
                            <option value="id">По ID</option>
                            <option value="created_at">По дате создания</option>
                        </select>
                    </div>
                    <div className="pagination_wrapper" >
                        <button className="button-left" onClick={(e: React.FormEvent) => leftPageClick(e)}></button>
                        <button className="button-right" onClick={(e: React.FormEvent) => rightPageClick(e)} disabled={!(count <= 10)}></button>
                    </div> 
                </div>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Заказ</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr>
                            <td>{order.id}</td>
                            <td>
                                <div className="table_grid">
                                    <div className="item">Создан:</div>
                                    <div className="item">{order.created_at}</div>
                                    <div className="item">Водители:</div>
                                    <div className="item">{order.car_driver?.map((driver) => driver.driver.name)}</div>
                                    <div className="item">Из:</div>
                                    <div className="item">
                                        <div className="table_grid">
                                            <div className="smaill_item">Адрес:</div>
                                            <div className="smaill_item">{order.from?.name}</div>
                                        </div>
                                    </div>
                                    <div className="item">В:</div>
                                    <div className="item">
                                        <div className="table_grid">
                                            <div className="small_item">Адрес:</div>
                                            <div className="small_item">{order.to?.name}</div>
                                        </div>
                                    </div>
                                    <div className="item">Статус:</div>
                                    <div className="item">{order.status}</div>
                                    <div className="item">Расстояние:</div>
                                    <div className="item">{order.mileage}</div>
                                    <div className="item">Продолжительность:</div>
                                    <div className="item">{order.duration}</div>
                                    <div className="item">Сообщение:</div>
                                    <div className="item">{order.message}</div>
                                    <div className="item">Начат:</div>
                                    <div className="item">{order.started_at}</div>
                                    <div className="item">Завершен:</div>
                                    <div className="item">{order.finished_at}</div>
                                    <div className="item">Тип:</div>
                                    <div className="item">{order.order_type}</div>
                                </div>
                            </td>
                            <td><button className="basic_button action_button" onClick={(e) => handleInfo(e, order.id)} style={{marginBottom: "10px"}}>Детали</button>
                            {order.status != 'ABORTED' && order.status != 'CLOSED' &&
                             <button className="basic_button action_button" onClick={(e) => handleCancel(e, order.id)}>Отменить</button>
                            }
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </form>

            <form className="form_base" id="orders_req_form-all">
                <h3>Необработанные заказы</h3>
                <input className="serach"
                    type="text"
                    placeholder="Номер машины"
                    onChange={(e) => setNumberToFind(e.target.value)}
                />
                <div className="filters_wrapper">
                    <div className="filters">
                        <p style={{marginBottom: "15px"}}>Фильтры</p>
                        <div>
                            <p>Статус</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="ABORTED">{Statuses.ABORTED}</option>
                                <option value="IN_PROGRESS">{Statuses.IN_PROGRESS}</option>
                                <option value="IN_PROCESSING">{Statuses.IN_PROCESSING}</option>
                                <option value="CREATED">{Statuses.CREATED}</option>
                                <option value="ASSIGNED">{Statuses.ASSIGNED}</option>
                                <option value="CLOSED">{Statuses.CLOSED}</option>
                            </select>
                        </div>
                        <div>
                            <p>Тип</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setTypeFilter(e.target.value)}>
                                <option value="DURATION">{OrderTypes.DURATION}</option>
                                <option value="DESTINATION">{OrderTypes.DESTINATION}</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <p style={{marginBottom: "15px"}}>Выберите тип сортировки</p>
                        <select name="typeOfCar" id="typeOfCar" onChange={(e) => setSort(e.target.value)}>
                            <option value="id">По ID</option>
                            <option value="created_at">По дате создания</option>
                        </select>
                    </div>
                    <div className="pagination_wrapper" >
                        <button className="button-left" onClick={(e: React.FormEvent) => leftPageClick(e)}></button>
                        <button className="button-right" onClick={(e: React.FormEvent) => rightPageClick(e)} disabled={!(count <= 10)}></button>
                    </div> 
                </div>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Заказ</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr>
                            <td>{order.id}</td>
                            <td>
                                <div className="table_grid">
                                    <div className="item">Создан:</div>
                                    <div className="item">{order.created_at}</div>
                                    <div className="item">Водители:</div>
                                    <div className="item">{order.car_driver?.map((driver) => driver.driver.name)}</div>
                                    <div className="item">Из:</div>
                                    <div className="item">
                                        <div className="table_grid">
                                            <div className="smaill_item">Адрес:</div>
                                            <div className="smaill_item">{order.from?.name}</div>
                                        </div>
                                    </div>
                                    <div className="item">В:</div>
                                    <div className="item">
                                        <div className="table_grid">
                                            <div className="small_item">Адрес:</div>
                                            <div className="small_item">{order.to?.name}</div>
                                        </div>
                                    </div>
                                    <div className="item">Статус:</div>
                                    <div className="item">{order.status}</div>
                                    <div className="item">Расстояние:</div>
                                    <div className="item">{order.mileage}</div>
                                    <div className="item">Продолжительность:</div>
                                    <div className="item">{order.duration}</div>
                                    <div className="item">Сообщение:</div>
                                    <div className="item">{order.message}</div>
                                    <div className="item">Начат:</div>
                                    <div className="item">{order.started_at}</div>
                                    <div className="item">Завершен:</div>
                                    <div className="item">{order.finished_at}</div>
                                    <div className="item">Тип:</div>
                                    <div className="item">{order.order_type}</div>
                                </div>
                            </td>
                            <td><button className="basic_button action_button" onClick={(e) => handleInfo(e, order.id)}>Детали</button></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </form>
        </section>
        </main>
    );
}

export default OrdersReqSection;