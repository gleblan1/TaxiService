import "./OrderForm.css";
import "./../../FormBase.css";
import 'react-calendar/dist/Calendar.css';
import React, {useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-datepicker/dist/react-datepicker.css";
import { CarType, CreateOrderRequest, OrderCost, OrderLocation, ResponseErr } from "../../../../types/Types";
import { api } from "../../../../axios/api";
import axios from "axios";
import closeImg from "/assets/close.png";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const OrderForm : React.FC = () => {
    const [date, setDate] = useState<Value>(new Date());

    const [startAdressValue, setStartAdressValue] = useState<string>("");
    const [endAdressValue, setEndAdressValue] = useState<string>("");

    const [isAdressesSubmitted, setIsAdressesSubmitted] = useState<boolean>(false);
    const [isCounted, setIsCounted] = useState<boolean>(false);
    const [isOpenAddAdress, setIsOpenAddAdress] = useState<boolean>(false);
    const [newAdressValue, setNewAdressValue] = useState<string>("");
    const [intermediateAdresses, setIntermediateAdresses] = useState<string[]>([]);
    const [orderTime, setOrderTime] = useState<number>(0);
    const [carType, setCarType] = useState<string>("Эконом");
    const [period, setPeriod] = useState<string>("");
    const [frequency, setFrequency] = useState<number>(1);
    const [endDate, setEndDate] = useState<string>("");
    const [count, setCount] = useState<number>(1);
    const [addDocs, setAddDocs] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(0);
    const [fromLocation, setFromLocation] = useState<OrderLocation>({lat: 52, lng: 52});
    const [toLocation, setToLocation] = useState<OrderLocation>({lat: 54, lng: 54});
    const [errResponse, setErrResponse] = useState<boolean>(false);

    const [cars, setCars] = useState<CarType[]>([]);

    const [isOnTime, setIsOnTime] = useState<boolean>(false);
    const [isReqular, setIsReqular] = useState<boolean>(false);

    const [countMsg, setCountMsg] = useState<boolean>(false)

    const taxiTypes: string[] = ["Эконом", "Комфорт", "Бизнес", "Эконом-класс", "Миниван", "Лимузин", "Автобус"];
    const periods: string[] = ["День", "Неделя", "Месяц", "Год"];

    useEffect(() => {
        console.log(endDate);
    }, [endDate]);

    function removeCar(index: number){
        setCars(cars.filter((_, i) => i !== index));
    }

    function addCar(e: React.FormEvent) {
        e.preventDefault();
        setCars([...cars, {type: carType, count: count}]);
    }

    async function getFromCoordinates(e: React.FormEvent) {
        e.preventDefault();
        const options = {
            method: 'GET',
            url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
            params: {
                address: startAdressValue,
                language: 'ru'
            },
            headers: {
                'X-RapidAPI-Key': '0e504cffc2mshd22b3e9815b9356p19187bjsn253dbbcd8468',
                'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
            }
        };
        try {
            const response = await axios.request(options);
            setFromLocation(response.data.results[0].location);
            return response.data.results[0].location;
        } catch (error) {
            throw error;
        }
    }

    async function getToCoordinates(e: React.FormEvent) {
        e.preventDefault();
        const options = {
            method: 'GET',
            url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
            params: {
                address: endAdressValue,
                language: 'ru'
            },
            headers: {
                'X-RapidAPI-Key': '0e504cffc2mshd22b3e9815b9356p19187bjsn253dbbcd8468',
                'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
            }
        };
        try {
            const response = await axios.request(options);
            setToLocation(response.data.results[0].location);
            return response.data.results[0].location;
        } catch (error) {
            throw error;
        }
    }

    function regularIsChecked() {
        setIsReqular(!isReqular);
        setPeriod("Day");
    }

    function checkboxOnChaneHandler() {
        setIsOnTime(!isOnTime);
    }

    function refreshAllStates() {
        setStartAdressValue("");
        setEndAdressValue("");
        setIsAdressesSubmitted(false);
        setIsCounted(false);
        setIsOpenAddAdress(false);
        setNewAdressValue("");
        setIntermediateAdresses([]);
    }

    function handleClose(e: React.FormEvent) {
        e.preventDefault();
    }

    const submitAdresses = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const [fromResponse, toResponse] = await Promise.all([getFromCoordinates(e), getToCoordinates(e)]);
            console.log(fromResponse, toResponse);
            setIsAdressesSubmitted(true);
        } catch (error) {
            console.error(error);
            setErrResponse(true);
            setIsAdressesSubmitted(false);
        }
    }

    const countOrder = (e: React.FormEvent) => {
        e.preventDefault();

        if (fromLocation?.lat && toLocation?.lat) {
            const requestData: any = {
                car_types: cars.map((car)=>{count: car.count; carType: car.type}),
                from: {
                    lat: fromLocation!.lat.toString(),
                    long: fromLocation!.lng.toString(),
                    name: startAdressValue
                },
                to: {
                    lat: toLocation!.lat.toString(),
                    long: toLocation!.lng.toString(),
                    name: endAdressValue
                }
            };
            api.post("account/order/cost", requestData)
                .then(res => res.data)
                .then((data) => {
                    setPrice(+data);
                })
                .catch((err: ResponseErr) => {
                    console.log(err);
                });
            setIsCounted(true);
        } else {
            setCountMsg(true);
        }
    };

    
    function addAddress(e: React.FormEvent) {
        e.preventDefault();
        let newAddresses: string[] = [...intermediateAdresses];
        newAddresses.push(newAdressValue);
        setIntermediateAdresses(newAddresses);
        setIsOpenAddAdress(false);
    }

    function pay(e: React.FormEvent) {
        e.preventDefault();

        if (isAdressesSubmitted) {
            // Создаем объект с данными
            const requestData = {
                "from": {
                    "lat": 200,
                    "long": 200,
                    "name": "Timiryazeva 92"
                },
                "order_type": "DURATION",
                "order_time": "2024-05-14T16:00:00Z",
                "cost": 50.5,
                "duration": 96,
                "message": "transfer stuff from one point to another",
                "car_types": [
                    {
                        "type": "PASSENGER_BUSINESS",
                        "count": 1
                    }
                ],
                "documents_required": true,
                "is_regular": false
            }

            api.post("account/order", requestData)
                .then((response) => {
                    console.log(response);
                })
                .catch((err: ResponseErr) => {
                    console.log(err);
                });
        }

        refreshAllStates();
    }


    return (
        <form className="form_base" id="order_form" onSubmit={(e: React.FormEvent) => pay(e)}>
            <div className="wrapper-adresses_block">
                <div className="wrapper-adresses_inputs">
                    <div className="input_wrapper">
                        <p>Начальный адрес</p>
                        <input type="text" placeholder="Точный адрес" onChange={(e) => setStartAdressValue(e.target.value)}/>
                    </div>
                    <div className="input_wrapper">
                        <p>Конечный адрес</p>
                        <input type="text" placeholder="Точный адрес" onChange={(e) => setEndAdressValue(e.target.value)}/>
                    </div>             
                    {errResponse && <p style={{color: "red", textAlign: "center", marginBottom: "10px"}}>Вы указали неверный адрес</p>}
                </div>
                {isAdressesSubmitted &&
                    <div className="wrapper-adresses">
                        <div className="points_wrapper">
                            <h4>Начальный адрес:</h4>
                            <p>{startAdressValue}</p>
                        </div>
                        <div className="points_wrapper">
                            <h4>Конечный адрес:</h4>
                            <p>{endAdressValue}</p>
                        </div>
                    </div>
                }
                <div className="reservation-wrapper">
                    <button className="basic_button" id="submit_adresses" onClick={(e: React.FormEvent) => submitAdresses(e)}>Подтвердить адреса</button> 
                    <div className="reservation-wrapper_checkbox">
                        <input type="checkbox" id="reservationCheckbox" onChange={checkboxOnChaneHandler}/>
                        <label htmlFor="reservationCheckbox">Забронировать на время</label>
                    </div>
                    {isOnTime && 
                    <>
                        <input type="text" id="timeInput" className="time_input" onChange={(e) => setOrderTime(+e.target.value)}/>
                        <label htmlFor="timeInput">Время в минутах</label>
                    </>
                    }
                </div>
                <div className="wrapper-cars_block">
                    <div className="wrapper-cars_type">
                        <label htmlFor="typeOfCar">Выберите класс автомобиля</label>  
                        <select name="typeOfCar" id="typeOfCar" onChange={(e) => setCarType(e.target.value)}>
                            {taxiTypes.map((type, index) => 
                                <option key={index} value={type}>{type}</option>
                            )}
                        </select>
                    </div>
                    <div className="wrapper-cars_count">
                        <label htmlFor="countOfCarf">Количество машин</label>  
                        <input type="number" id="countOfCarf" className="time_input" onChange={(e) => setCount(+e.target.value)}/>
                    </div>
                </div>
                <div className="add-car">
                    <input onClick={(e: React.FormEvent) => addCar(e)} type="submit" id="submit_button_yellow" className="submit_button" value="Добавить автомобиль"/>
                    {cars &&
                        <>
                            <div className="points_wrapper_cars">
                                <h4>Добавленные автомобили:</h4>
                                {cars.map((car, index) =>
                                <div>
                                    <p key={index} style={{marginBottom: "10px", borderBottom: "1px solid black", width:"50%"}}>Тип: {car.type}, количество: {car.count}</p>
                                    <img src={closeImg} alt="" className="close_img" onClick={() => removeCar(index)}/>
                                </div>
                                )}
                            </div>                   
                        </>
                    }
                </div>
                <div className="wrapper-date_block" style={{marginBottom: "20px"}}>
                {date instanceof Date ? (
                    <>
                    <p>Время заказа</p>
                    <input
                        type="datetime-local"
                        value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`}
                        onChange={(e) => setDate(new Date(e.target.value))}
                        min={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}T${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`}
                    />
                    </>
                ) : null}
                    <div className="wrapper-order_details" style={{marginTop: "20px"}}>
                        <div>
                            <input type="checkbox" id="regularOrder" onChange={regularIsChecked}/>
                            <label htmlFor="regularOrder">Регулярный заказ</label>
                        </div>
                        {isReqular && 
                        <div>
                            <p>Каждый</p>
                            <input type="number" className="number_input" min={1} onChange={(e) => setFrequency(+e.target.value)}/>
                            <select name="every" id="every" onChange={(e) => setPeriod(e.target.value)} style={{marginBottom: "30px"}}>
                                {periods.map((period, index) => 
                                    <option key={index} value={period}>{period}</option>
                                )}
                            </select>
                            <div>
                            <p>Дата и время окончания</p>
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            </div>
                        </div>
                    }
                    </div>
                </div>
            </div>
            <div className="add_docs">
                <input type="checkbox" id ="addDocs" name="addDocs" onChange={(e) => setAddDocs(e.target.checked)}/>
                <label htmlFor="addDocs">Прикрепить документы</label>
            </div>

            <input onClick={(e: React.FormEvent) => countOrder(e)} type="submit" id="submit_button_yellow" className="submit_button" value="Рассчитать заказ"/>
            {isCounted &&
                <>
                    <div className="points_wrapper">
                        <h4>Предварительная стоимость:</h4>
                        <p>{`${price} BYN`}</p>
                    </div>                   
                </>
            }
            {countMsg &&
                <p className="error-message" style={{color: "red"}}>Введите начальный и конечный адреса</p>
            }
            <input type="submit" className="submit_button" value="Заказать" style={{alignSelf: 'center'}} disabled={!isAdressesSubmitted}/>  
        </form>
    );
}

export default OrderForm;