import { useState } from "react";
import { LimitRequest, Payment } from "../../../../types/Types";
import { api } from "../../../../axios/api";
import React from "react";

const PaymentsReqSection: React.FC = () => {

    const [payments, setPayments] = useState<Payment[]>([]);
    const [paymentId, setPaymentId] = useState(0);
    const [payment, setPayment] = useState<Payment>();

    function getAllPayments(e: React.FormEvent) {
        e.preventDefault();

        const request: any ={
            limit: 10,
            page: 1
        }

        api.get('admin/payment', request).then(res=>res.data)
        .then((data) => {
            const response: Payment[] = JSON.parse(data);
            setPayments([...payments, ...response]);
        })
        .catch((err) => console.log(err));
    }

    function getPaymentById(e: React.FormEvent) {
        e.preventDefault();
        api.get(`admin/payment/${paymentId}`).then(res=>res.data)
        .then((data) => {
            const response: Payment = JSON.parse(data);
            setPayment(response);
        })
        .catch((err) => console.log(err));
    }

    return (
        <main id="analytic_page">
        <section id="section_requests-payments">
            <h2>Действия с платежами</h2>
            <form className="form_base" id="payments_req_form-all" onSubmit={(e) => getAllPayments(e)}>
                <h3>Получить все платежи</h3>
                <input type="submit" className="basic_button" value="Получить"/>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Платеж</th>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr>
                                <td>{payment.id}</td>
                                <td>
                                    <div className="table_grid">
                                        <div className="item">ID плательщика:</div>
                                        <div className="item">{payment.customer}</div>
                                        <div className="item">Сеть:</div>
                                        <div className="item">{payment.network}</div>
                                        <div className="item">Статус:</div>
                                        <div className="item">{payment.status}</div>
                                        <div className="item">Сумма:</div>
                                        <div className="item">{payment.amount} р</div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>1</td>
                            <td>
                                <div className="table_grid">
                                    <div className="item">ID плательщика:</div>
                                    <div className="item">1</div>
                                    <div className="item">Сеть:</div>
                                    <div className="item">PayPal</div>
                                    <div className="item">Статус:</div>
                                    <div className="item">Оплачено</div>
                                    <div className="item">Сумма:</div>
                                    <div className="item">50 р</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <form className="form_base" id="payments_req_form-info">
                <h3>Получить информацию о платеже</h3>
                <div className="input_wrapper">
                    <input type="text" placeholder="ID..." onChange={(e) => setPaymentId(+e.target.value)}/>
                </div>
                <input type="submit" className="basic_button" value="Получить" onClick={(e) => getPaymentById(e)}/>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Платеж</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{payment?.id}</td>
                            <td>
                                <div className="table_grid">
                                    <div className="item">ID плательщика:</div>
                                    <div className="item">{payment?.customer}</div>
                                    <div className="item">Сеть:</div>
                                    <div className="item">{payment?.network}</div>
                                    <div className="item">Статус:</div>
                                    <div className="item">{payment?.status}</div>
                                    <div className="item">Сумма:</div>
                                    <div className="item">{payment?.amount}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </section>
        </main>
    );
}

export default PaymentsReqSection;