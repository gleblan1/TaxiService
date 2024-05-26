import React, { useEffect, useState } from "react";
import { Order } from "../../../../types/Types";
import { api } from "../../../../axios/api";
import OrderTableItem from "../../AnalyticPage/OrdersReqSection/OrderTableItem/OrderTableItem";



export function AssignedOrders() {

  
  const [hasOrder, setHasOrder] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAccepted, setIsAccepted] = useState<boolean>(false)
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

  return (
    <main id="driver_page">
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
    </main>
  );
}