import { useEffect, useState } from "react";
import { useDrive } from "../../../../../store/store";
import { api } from "../../../../../axios/api";
import { Order } from "../../../../../types/Types";
import {OrderTypes, Statuses} from "../../../../../enums/Enums";
import React from "react";

interface OrderTableItemProps {
    currentOrder: Order;
}

const OrderTableItem: React.FC<OrderTableItemProps> = ({ currentOrder }) => {



    return (
        <td>
            <div className="table_grid">
                <div className="item">Начало заказа:</div>
                <div className="item">
                    {currentOrder && new Date(currentOrder.order_time).toLocaleString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                        timeZoneName: 'short'
                    })}
                </div>
                <div className="item">Отправление:</div>
                <div className="item">
                    {currentOrder?.from?.name}
                </div>
                <div className="item">Назначение:</div>
                <div className="item">
                    {currentOrder?.to?.name}
                </div>
                <div className="item">Статус:</div>
                <div className="item">{Statuses[currentOrder?.status as keyof typeof Statuses]}</div>
                <div className="item">Продолжительность:</div>
                <div className="item">{currentOrder?.duration}</div>
                <div className="item">Стоимость:</div>
                <div className="item">{typeof currentOrder?.cost === 'number' ? currentOrder?.cost.toFixed(2) : ''} руб.</div>
                <div className="item">Тип заказа:</div>
                <div className="item">{OrderTypes[currentOrder?.order_type as keyof typeof OrderTypes]}</div>
                <div className="item">Номер автомобиля:</div>
                <div className="item">{currentOrder?.car_driver.find(driver => driver.driver.id === 1)?.car?.number}</div>
                <div className="item">Коментарии:</div>
                <div className="item">{currentOrder?.message}</div>
                <div className="item">Начат:</div>
                {currentOrder && currentOrder.started_at !== '0001-01-01T00:00:00Z' ?
                    <div className="item">
                        {new Date(currentOrder.started_at).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                            timeZoneName: 'short'
                        })}
                    </div> : <div className="item"></div>
                }
                <div className="item">Завершен:</div>
                {currentOrder && currentOrder.finished_at !== '0001-01-01T00:00:00Z' ?
                    <div className="item">
                        {new Date(currentOrder.finished_at).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                            timeZoneName: 'short'
                        })}
                    </div> : <div className="item"></div>
                }
            </div>
        </td>
    );
};

export default OrderTableItem;
