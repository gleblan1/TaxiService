import React, { useEffect, useState } from "react";
import { Order } from "../../../../types/Types";
import { api } from "../../../../axios/api";
import OrderTableItem from "../../AnalyticPage/OrdersReqSection/OrderTableItem/OrderTableItem";



export function CurrentOrder() {

  
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

function handleStop(){
    api.post(`account/order/${_currentOrder?.id}/quit`).then(()=>{
        setIsStopped(true)
    }).catch((error=>console.log(error)))
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
            <p>Перед началом поездки нажмите кнопку "Начать".</p>
        </div>

    </section>
    </main>
  );
}