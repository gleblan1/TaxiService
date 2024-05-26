import React, { useEffect, useState } from "react";
import { Available, AvailableCars, Order, ResponseErr, car_driver_pairs } from "../../../../../types/Types";
import "./OrderDetailsPage.css";
import { api } from "../../../../../axios/api";
import { CarStatuses, OrderTypes, Statuses, Types } from "../../../../../enums/Enums";
import { useParams } from "react-router-dom";

export const OrderDetailsPage: React.FC = () => { 
    const [availables, setAvailables] = useState<Available>();
    const [selectedCars, setSelectedCars] = useState<AvailableCars[]>([]);
    const [selectedDrivers, setSelectedDrivers] = useState<AvailableCars[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>();
    const [typeFilter, setTypeFilter] = useState<string>();
    const [sort, setSort] = useState<string>('id');
    const [page, setPage] = useState<number>(1);
    const [order, setOrder] = useState<Order>();
    const {id} = useParams();
    const [pairs, setPairs] = useState<car_driver_pairs[]>([]);
    const [isFree, setIsFree] = useState<boolean>(true);

    useEffect(() => {
        api.get(`admin/order/${id}`).then(res => res.data).then((data) => {
            setOrder(data);
        }).catch((err) => console.log(err));
    }, [])
//выбирать любого водителя у которого статус available
    useEffect(() => {
            api.get(`admin/available`).then(res => res.data).then((data) => {
                setAvailables(data);
            }).catch((err) => console.log(err));
    }, [isFree])

    useEffect(() => {
        if (isFree) {
            const car_types = order?.car_driver.map((car) => {
                return{
                    count: order.car_driver.length,
                    type: car.car.car_type
                }
            })
            const request: any = {
                car_types: car_types,
                duration: order?.duration,
                order_time: order?.order_time
            }
            api.get(`admin/free`, request).then(res => res.data).then((data) => {
                setAvailables(prevAvailables => ({
                    ...prevAvailables,
                    cars: [...prevAvailables?.cars || [], ...data.cars],
                    drivers: prevAvailables?.drivers ?? []
                }));
            }).catch((err) => console.log(err));
        }
    }, [isFree]);

    function changeHandler(){
        api.post(`admin/order/${order?.id}`, {
            "car_driver_pairs": selectedCars.map((car) => ({ car_id: car.id, driver_id: car.driver ?? selectedCars.find((car) => car.driver !== 0)?.driver ?? 1})),
            "duration": order?.duration,
            "order_time": order?.order_time,
            "user_id": order?.user_id
          }).catch((err) => console.log(err));
    }

    const handleCarSelection = (car: AvailableCars, isSelected: boolean) => {
        if (isSelected) {
            setSelectedCars((prevSelectedCars) => [...prevSelectedCars, car]);
        } else {
            setSelectedCars((prevSelectedCars) => prevSelectedCars.filter((selectedCar) => selectedCar.id !== car.id));
        }
    };

    return <main className="order-details">
            <div className="table-deatils-wrapper">
            <table >
                <thead>
                    <th>Заказ</th>
                    <th></th>
                </thead>
            <tbody>
            <tr>
                <td>
                    <div className="table_grid">
                        <div className="item">Создан:</div>
                        <div className="item">{order?.created_at}</div>
                        <div className="item">Водители:</div>
                        <div className="item">{order?.car_driver?.map((driver) => driver.driver.name)}</div>
                        <div className="item">Из:</div>
                        <div className="item">
                            <div className="table_grid">
                                <div className="smaill_item">Адрес:</div>
                                <div className="smaill_item">{order?.from?.name}</div>
                            </div>
                        </div>
                        <div className="item">В:</div>
                        <div className="item">
                            <div className="table_grid">
                                <div className="small_item">Адрес:</div>
                                <div className="small_item">{order?.to?.name}</div>
                            </div>
                        </div>
                        <div className="item">Статус:</div>
                        <div className="item">{order?.status}</div>
                        <div className="item">Расстояние:</div>
                        <div className="item">{order?.mileage}</div>
                        <div className="item">Продолжительность:</div>
                        <div className="item">{order?.duration}</div>
                        <div className="item">Сообщение:</div>
                        <div className="item">{order?.message}</div>
                        <div className="item">Начат:</div>
                        <div className="item">{order?.started_at}</div>
                        <div className="item">Завершен:</div>
                        <div className="item">{order?.finished_at}</div>
                        <div className="item">Тип:</div>
                        <div className="item">{order?.order_type}</div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
        <div>
        {/* disabled={selectedCars?.length !== order?.car_driver?.length} */}
            <button className="basic_button details_button" onClick={changeHandler} >Назначить</button>
            <p>Выбрано: {selectedCars?.length} из {order?.car_driver?.length || 1}</p>
        </div>
    </div>
    <section className="section_history-start" id="section_order_history">
        <div className="cars-deatils-wrapper">
                <h2>Автомобили</h2>
                <div>
                    <input type="checkbox" name="addFree" id="addFree" />
                    <label htmlFor="addFree">Только свободные</label>
                </div>
                <hr />
                    <article>
                        <div>
                            <table>
                                <thead>
                                <th></th>
                                <th>Статус</th>
                                <th>Тип</th>
                                <th>Номер</th>
                                <th>Название</th>
                                </thead>
                                <tbody>
                                    {availables?.cars?.map((available) => ( 
                                        <tr key={available.id}>
                                            <td><input type="checkbox" name="selectCar" id={available.id.toString()} onChange={(e) => handleCarSelection(available, e.target.checked)}/></td>
                                            <td>{available.status}</td>
                                            <td>{available.car_type}</td>
                                            <td>{available.number}</td>
                                            <td>{available.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>                 
                    </article>
                    </div>
                    <div className="selected_cars">
                        <h2>Выбранные автомобили</h2>
                        <hr />
                        <div className="filters_wrapper">
                    <div className="filters">
                        <p style={{marginBottom: "15px"}}>Фильтры</p>
                        <div>
                            <p>Статус</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="BUSY">{CarStatuses.BUSY}</option>
                                <option value="FREE">{CarStatuses.FREE}</option>
                                <option value="UNDER_REPAIR">{CarStatuses.UNDER_REPAIR}</option>
                            </select>
                        </div>
                        <div>
                            <p>Тип</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setTypeFilter(e.target.value)}>
                                <option value="DURATION">{Types.BUS}</option>
                                <option value="DESTINATION">{Types.LIMOUSINE}</option>
                                <option value="DESTINATION">{Types.MINIVAN}</option>
                                <option value="DESTINATION">{Types.PASSENGER_BUSINESS}</option>
                                <option value="DESTINATION">{Types.PASSENGER_COMFORT}</option>
                                <option value="DESTINATION">{Types.PASSENGER_ECONOMY}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <hr />
                        <p>Выбрано: {selectedCars?.length} из {availables?.cars?.length}</p>
                        <article>
                        <div>
                            <table>
                                <thead>
                                <th></th>
                                <th>Номер</th>
                                <th>Название</th>
                                <th>Тип машины</th>
                                <th>Имя водителя</th>
                                </thead>
                                <tbody>
                                    {selectedCars?.map((selected) => ( 
                                        <tr key={selected.id}>
                                            <td>{selected.id}</td>
                                            <td>{selected.name}</td>
                                            <td>{selected.number}</td>
                                            <td>{selected.car_type}</td>
                                            <td>{selectedDrivers.find((driver) => driver.id === selected.driver)?.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>                 
                    </article>
                    </div>
            </section>
    
</main>
}