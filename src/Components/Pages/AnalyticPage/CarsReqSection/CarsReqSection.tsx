import React, { useState } from "react";
import { api } from "../../../../axios/api";
import { Car, CarUpdateRequest, LimitRequest, NewCarRequest } from "../../../../types/Types";
import {CarStatuses, Categories, Statuses, Types} from "../../../../enums/Enums";

const CarsReqSection: React.FC = () => {

    const [cars, setCars] = useState<Car[]>([]);
    const [carId, setCarId] = useState(0);
    const [carById, setCarById] = useState<Car>();
    const [carGas, setCarGas] = useState(0);
    const [carName, setCarName] = useState<string>('');
    const [carNumber, setCarNumber] = useState<string>('');
    const [carType, setCarType] = useState<string>('');
    const [driverId, setDriverId] = useState(0);
    const [carIdToUpdate, setCarIdToUpdate] = useState(0);
    const [driverIdToUpdate, setDriverIdToUpdate] = useState(0);
    const [carNameToUpdate, setCarNameToUpdate] = useState<string>('');
    const [carNumberToUpdate, setCarNumberToUpdate] = useState<string>('');
    const [carTypeToUpdate, setCarTypeToUpdate] = useState<string>('');
    const [carIdToDelete, setCarIdToDelete] = useState(0);

    function updateCarName(e: React.FormEvent){
        e.preventDefault();
        const request: CarUpdateRequest ={
            field: 'NAME',
            value: carNameToUpdate
        }
        api.patch(`admin/car/${carIdToUpdate}`, request).then((response) => response.data).then((data) => console.log(data)).catch((err) => console.log(err));
        handleGetAllCars(e)
    }

    function updateCarNumber(e: React.FormEvent){
        e.preventDefault();
        const request: CarUpdateRequest ={
            field: 'NUMBER',
            value: carNumberToUpdate
        }
        api.patch(`admin/car/${carIdToUpdate}`, request).then((response) => response.data).then((data) => console.log(data)).catch((err) => console.log(err));
        handleGetAllCars(e)
    }

    function updateCarType(e: React.FormEvent){
        e.preventDefault();
        const request: CarUpdateRequest ={
            field: 'CAR_TYPE',
            value: carTypeToUpdate
        }
        api.patch(`admin/car/${carIdToUpdate}`, request).then((response) => response.data).then((data) => console.log(data)).catch((err) => console.log(err));
        handleGetAllCars(e)
    }

    function deleteCar(e: React.FormEvent, car: Car){
        e.preventDefault();
        api.delete(`admin/car/${car.id}`).then((response) => response.data).then((data) => console.log(data)).catch((err) => console.log(err));
        handleGetAllCars(e)
    }

    function addNewCar(e : React.FormEvent){
        e.preventDefault();
        const request: NewCarRequest ={
            car_type: carType,
            driver: driverId,
            name: carName,
            number: carNumber,
            gas_consumption: carGas,
        }
        api.post('admin/car', request).then((response) => response.data).then((data) => console.log(data)).catch((err) => console.log(err));
        handleGetAllCars(e)
    }

    function handleGetAllCars(e: React.FormEvent){
        e.preventDefault();

        const params = new URLSearchParams();
        params.append('limit', '10');
        params.append('page', '1');
        params.append('sort', 'id');

        api.get(`admin/car?${params.toString()}`).then(res => res.data)
        .then((data) => {
            const response: Car[] = data;
            setCars(response);
        })
        .catch((err) => console.log(err));
    }

    function getCatById(e: React.FormEvent){
        e.preventDefault();
        api.get(`admin/car/${carId}`).then((response) => response.data)
        .then((data) => setCarById(data))
            .catch((err) => console.log(err));
    }

    return (
        <main id="analytic_page">
        <section id="section_requests-cars">
            <h2>Действия с автомобилями</h2>
            <form className="form_base" id="cars_req_form-all">
                <h3>Получить все автомобили</h3>
                <input type="submit" className="basic_button" value="Получить" onClick={handleGetAllCars}/>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Автомобиль</th>
                        <th>Действия</th>
                    </thead>
                    <tbody>
                        {cars?.map((car) => (
                            <tr key={car.id}>
                                <td>{car.id}</td>
                                <td>
                                    <div className="table_grid">
                                        <div className="item">Название:</div>
                                        <div className="item">{car.name}</div>
                                        <div className="item">Номер:</div>
                                        <div className="item">{car.number}</div>
                                        <div className="item">Тип:</div>
                                        <div className="item">{Types[car.car_type as keyof typeof Types]}</div>
                                        <div className="item">Водитель:</div>
                                        <div className="item">{car.driver}</div>
                                        <div className="item">Израсходовано топлива:</div>
                                        <div className="item">{car.gas_consumption}</div>
                                        <div className="item">Статус:</div>
                                        <div
                                            className="item">{CarStatuses[car.status as keyof typeof CarStatuses]}</div>
                                    </div>
                                </td>
                                <td>
                                    <button className="basic_button action_button"
                                            onClick={(event) => deleteCar(event, car)}>Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </form>
            {/*<form className="form_base" id="cars_req_form-info">*/}
            {/*    <h3>Получить информацию о машине</h3>*/}
            {/*    <div className="input_wrapper">*/}
            {/*        <input type="text" placeholder="ID..." onChange={(e) => setCarId(+e.target.value)}/>*/}
            {/*    </div>*/}
            {/*    <input type="submit" className="basic_button" value="Получить" onClick={getCatById}/>*/}
            {/*    <table>*/}
            {/*        <thead>*/}
            {/*            <th>ID</th>*/}
            {/*            <th>Автомобиль</th>*/}
            {/*        </thead>*/}
            {/*        <tbody>*/}
            {/*        <tr>*/}
            {/*            <td>{carById?.id}</td>*/}
            {/*            <td>*/}
            {/*                <div className="table_grid">*/}
            {/*                    <div className="item">Название:</div>*/}
            {/*                    <div className="item">{carById?.name}</div>*/}
            {/*                    <div className="item">Номер:</div>*/}
            {/*                    <div className="item">{carById?.number}</div>*/}
            {/*                    <div className="item">Тип:</div>*/}
            {/*                    <div className="item">{Types[carById?.car_type as keyof typeof Types]}</div>*/}
            {/*                    <div className="item">Водитель:</div>*/}
            {/*                    <div className="item">{carById?.driver}</div>*/}
            {/*                    <div className="item">Израсходовано топлива:</div>*/}
            {/*                    <div className="item">{carById?.gas_consumption}</div>*/}
            {/*                    <div className="item">Статус:</div>*/}
            {/*                    <div className="item">{CarStatuses[carById?.status as keyof typeof CarStatuses]}</div>*/}
            {/*                </div>*/}
            {/*            </td>*/}
            {/*        </tr>*/}
            {/*        </tbody>*/}
            {/*    </table>*/}
            {/*</form>*/}
            <form className="form_base" id="cars_req_form-create">
                <h3>Добавить машину</h3>
                <div className="input_wrapper">
                    <p>Название</p>
                    <input type="text" placeholder="Wolkswagen" onChange={(e) => setCarName(e.target.value)}/>
                </div>
                <div className="input_wrapper">
                    <p>ID Водителя</p>
                    <input type="text" placeholder="ID" onChange={(e) => setDriverId(+e.target.value)}/>
                </div>
                <div className="input_wrapper">
                    <p>Номер</p>
                    <input type="text" placeholder="1111АА-1" onChange={(e) => setCarNumber(e.target.value)}/>
                </div>
                <div className="input_wrapper">
                    <p>Расход бензина</p>
                    <input type="text" placeholder="30" onChange={(e) => setCarGas(+e.target.value)}/>
                </div>
                <div className="input_wrapper">
                    <p>Тип</p>
                    <select name="category_select" id="category_select" onChange={(e) => setCarType(e.target.value)}>
                        <option value='BUS'>{Types.BUS}</option>
                        <option value='MINIVAN'>{Types.MINIVAN}</option>
                        <option value='LIMOUSINE'>{Types.LIMOUSINE}</option>
                        <option value='PASSENGER_BUSINESS'>{Types.PASSENGER_BUSINESS}</option>
                        <option value='PASSENGER_COMFORT'>{Types.PASSENGER_COMFORT}</option>
                        <option value='PASSENGER_ECONOMY'>{Types.PASSENGER_ECONOMY}</option>
                    </select>
                </div>
                <input type="submit" className="basic_button" value="Назначить" onClick={(e) => addNewCar(e)}/>
            </form>
            <form className="form_base" id="cars_req_form-update">
                <h3>Обновить данные машины</h3>
                <div className="input_wrapper">
                    <p>ID Водителя</p>
                    <input type="text" placeholder="ID" onChange={(e) => setCarIdToUpdate(+e.target.value)}/>
                </div>
                <div className="input_wrapper">
                    <p>ID машины</p>
                    <input type="text" placeholder="ID" onChange={(e) => setCarIdToUpdate(+e.target.value)}/>
                </div>
                <div className="update_wrapper">
                    <div className="input_wrapper">
                        <p>Название</p>
                        <input type="text" placeholder="Wolkswagen" onChange={(e) => setCarNameToUpdate(e.target.value)}/>
                    </div>
                    <button className="basic_button" onClick={(e) => updateCarName(e)}>Обновить поле</button>
                </div>
                <div className="update_wrapper">
                    <div className="input_wrapper">
                        <p>Номер</p>
                        <input type="text" placeholder="1111АА-1" onChange={(e) => setCarNumberToUpdate(e.target.value)}/>
                    </div>
                    <button className="basic_button" onClick={(e) => updateCarNumber(e)}>Обновить поле</button>
                </div>
                <div className="update_wrapper">
                    <div className="input_wrapper">
                        <p>Тип</p>
                        <select name="category_select" id="category_select" onChange={(e) => setCarTypeToUpdate(e.target.value)}>
                            <option value='BUS'>{Types.BUS}</option>
                            <option value='MINIVAN'>{Types.MINIVAN}</option>
                            <option value='LIMOUSINE'>{Types.LIMOUSINE}</option>
                            <option value='PASSENGER_BUSINESS'>{Types.PASSENGER_BUSINESS}</option>
                            <option value='PASSENGER_COMFORT'>{Types.PASSENGER_COMFORT}</option>
                            <option value='PASSENGER_ECONOMY'>{Types.PASSENGER_ECONOMY}</option>
                        </select>
                    </div>
                    <button className="basic_button" onClick={(e) => updateCarType(e)}>Обновить поле</button>
                </div>
            </form>
            {/*<form className="form_base" id="cars_req_form-delete">*/}
            {/*    <h3>Удалить машину</h3>*/}
            {/*    <div className="input_wrapper">*/}
            {/*        <input type="text" placeholder="ID" onChange={(e) => setCarIdToDelete(+e.target.value)}/>*/}
            {/*    </div>*/}
            {/*    <input type="submit" className="basic_button" value="Удалить" onClick={(e) => deleteCar(e)}/>*/}
            {/*</form>*/}
        </section>
        </main>
    );
}

export default CarsReqSection;