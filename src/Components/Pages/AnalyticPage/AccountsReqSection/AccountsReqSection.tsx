import { api } from "../../../../axios/api";
import {Categories, DriverStatuses, Statuses, UserStatuses} from "../../../../enums/Enums";
import { Account, DriverFilter, ResponseErr } from "../../../../types/Types";
import './AccountReqSection.css';
import {Accounts} from "../../../../types/Types";
import React, { useEffect, useState } from "react";

const AccountsReqSection: React.FC = () => {

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [driverAccounts, setDriverAccounts] = useState<Account[]>([]);
    const [idToDelete, setIdToDelete] = useState<number>(0);
    const [roleToDelete, setRoleToDelete] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [category, setCategory] = useState<string>('A');

    const [isValidatedEmail, setIsValidatedEmail] = useState<boolean>(true);
    const [isValidatedPhone, setIsValidatedPhone] = useState<boolean>(true);
    const [isValidatedName, setIsValidatedName] = useState<boolean>(true);
    const [isValidatedPassword, setIsValidatedPassword] = useState<boolean>(true);

    const [userPage, setUserPage] = useState(1);
    const [driverPage, setDriverPage] = useState(1);

    const [countOfUsers, setCountOfUsers] = useState(0);
    const [countOfDrivers, setCountOfDrivers] = useState(0);

    const [sortDriver, setSortDriver] = useState<string>('id');
    const [sortUser, setSortUser] = useState<string>('id');

    const [nameToFindDriver, setNameToFindDriver] = useState<string>('');
    const [nameToFindUser, setNameToFindUser] = useState<string>('');

    const [driverFilter, setDriverFilter] = useState<DriverFilter>({category: 'A', status: 'READY'} as DriverFilter);
    const [userFilter, setUserFilter] = useState<string>('');

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('limit', '10');
        params.append('page', String(userPage));
        params.append('sort', sortUser);

        api.get(`admin/account/user?${params.toString()}`).then(res => res.data)
        .then((data) => {
            let response: Account[] = data;
            setAccounts(response.filter(account => account.user.name.includes(nameToFindUser)).filter(account=>account.user.status == userFilter));
            data.length > 0 ? setCountOfUsers(data[0].count) : setCountOfUsers(0);
        })
        .catch((err: ResponseErr)  => {
            console.log(err);
     })
    }, [userPage, sortUser, nameToFindUser, userFilter]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('limit', '10');
        params.append('page', String(driverPage));
        params.append('sort', sortDriver);

        api.get(`admin/account/driver?${params.toString()}`).then(res => res.data)
        .then((data) => {
            console.log(data)
            const response: Account[] = data;
            setDriverAccounts(response.filter(account => account.driver.name.includes(nameToFindDriver)).filter(account=>account.driver.status == driverFilter.status).filter(account=>account.driver.category == driverFilter.category));
            console.log(driverAccounts, nameToFindDriver, driverFilter)
            data.length > 0 ? setCountOfDrivers(data[0].count) : setCountOfDrivers(0);
        })
        .catch((err: ResponseErr)  => {
            console.log(err);
     })
    }, [driverPage, sortDriver, nameToFindDriver, driverFilter]);

    const leftPageClickUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (userPage > 1) {
            setUserPage(userPage - 1);
        }
        else{
            setUserPage(1);
        }
    }

    const rightPageClickUser = (e: React.FormEvent) => {
        e.preventDefault();
        setUserPage(userPage + 1);
    }
    
    const rightPageClickDriver = (e: React.FormEvent) => {
        e.preventDefault();
        setDriverPage(driverPage + 1);
    }

    const leftPageClickDriver = (e: React.FormEvent) => {
        e.preventDefault();
        if (driverPage > 1) {
            setDriverPage(driverPage - 1);
        }
        else{
            setDriverPage(1);
        }
    }
    

    const validateEmail = (email: string): boolean => {
        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const regex: RegExp = /^\+\d{12}$/;
        return regex.test(phone);
    };

    const validateName = (name: string): boolean => {
        return name.trim() !== "";
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 8;
    };

    function createAccount(event: React.FormEvent) {
        event.preventDefault();
        const emailValue = email || "";
        const phoneValue = phone || "";
        const nameValue = name || "";
        const passwordValue = password || "";

        setIsValidatedEmail(validateEmail(emailValue));
        setIsValidatedPhone(validatePhone(phoneValue));
        setIsValidatedName(validateName(nameValue));
        setIsValidatedPassword(validatePassword(passwordValue));

        if (validateEmail(emailValue) && validatePhone(phoneValue) && validateName(nameValue) && validatePassword(passwordValue)) {
            api.post('admin/account/driver', { category: category, email: emailValue, name: nameValue, password: passwordValue, phone_number: phoneValue })
                .then(res => res.data)
                .then((data) => {
                    console.log(data); // Handle success response
                    getDriverAccount(event);
                })
                .catch((err: ResponseErr) => {
                    console.log(err);
                });
        }
    }



    function setRoleToDeleteHandler(value: string){
        setRoleToDelete(value);
    }

    function getDriverAccount(event: React.FormEvent){
        event.preventDefault();

        const params = new URLSearchParams();
        params.append('limit', '10');
        params.append('page', '1');
        params.append('sort', 'id');

        api.get(`admin/account/driver?${params.toString()}`).then(res => res.data)
        .then((data) => {
            console.log(data)
            const response: Account[] = data;
            setDriverAccounts(response);
        })
        .catch((err: ResponseErr)  => {
            console.log(err);
     })
    }

    function getCustomerAccount(event: React.FormEvent){

        const params = new URLSearchParams();
        params.append('limit', '10');
        params.append('page', '1');
        params.append('sort', 'id');

        api.get(`admin/account/user?${params.toString()}`).then(res => res.data)
        .then((data) => {
            const response: Account[] = data;
            setAccounts(response);
        })
        .catch((err: ResponseErr)  => {
            console.log(err);
     })
    }

    function deleteAccountById(event: React.FormEvent){
        event.preventDefault();
        api.delete(`admin/account/${roleToDelete}/${idToDelete}`).then(res => res.data)
        .catch((err: ResponseErr)  => {
            console.log(err);
     })
    }

    

    function deleteAccount(event: React.FormEvent, account: Account){
        // event.preventDefault();
        console.log(account)
        if(account.driver){
            api.delete(`admin/account/driver/${account.driver.id}`).then(res => res.data)
            .catch((err: ResponseErr)  => {
                console.log(err);
            })
            getDriverAccount(event)
        } else {
            api.delete(`admin/account/user/${account.user.id}`).then(res => res.data)
            .catch((err: ResponseErr)  => {
                console.log(err);
            })
            getCustomerAccount(event)
        }

    }

    return (
        <main id="analytic_page">
        <section id="section_requests-accounts">
            <h2>Действия с аккаунтами</h2>
            <form className="form_base" id="accounts_req_form-all">
                <h3>Получить все аккаунты водителей</h3>
                <input className="serach"
                    type="text"
                    placeholder="Имя"
                    onChange={(e) => setNameToFindDriver(e.target.value)}
                />
                <div className="filters_wrapper">
                    <div className="filters">
                        <p style={{marginBottom: "15px"}}>Фильтры</p>
                        <div>
                            <p>Категория</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setDriverFilter({...driverFilter, category: e.target.value})}>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                        <div>
                            <p>Статус</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setDriverFilter({...driverFilter, status: e.target.value})}>
                                <option value="READY">Доступен</option>
                                <option value="DELETED">Удален</option>
                                <option value="BUSY">Занят</option>
                            </select></div>
                    </div>
                    <div>
                        <p style={{marginBottom: "15px"}}>Выберите тип сортировки</p>
                        <select name="typeOfCar" id="typeOfCar" onChange={(e) => setSortDriver(e.target.value)}>
                            <option value="id">По ID</option>
                            <option value="created_at">По дате создания</option>
                        </select>
                    </div>
                    
                    <div className="pagination_wrapper">
                        <button className="button-left" onClick={(e: React.FormEvent) => leftPageClickDriver(e)}></button>
                        <button className="button-right" onClick={(e: React.FormEvent) => rightPageClickDriver(e)} disabled={!(countOfDrivers <= 10)}></button>
                    </div> 
                </div>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Аккаунт</th>
                        <th>Действия</th>
                    </thead>
                    <tbody>
                        {driverAccounts.map(account => (
                            <tr>
                                <td>{account.driver.id}</td>
                                <td>
                                    <div className="table_grid">
                                        <div className="item">Почта:</div>
                                        <div className="item">{account.driver.email}</div>
                                        <div className="item">Имя:</div>
                                        <div className="item">{account.driver.name}</div>
                                        <div className="item">Телефон:</div>
                                        <div className="item">{account.driver.phone_number}</div>
                                        <div className="item">Ср. оценка:</div>
                                        <div className="item">{account.driver.avg_rate}</div>
                                        <div className="item">Категория:</div>
                                        <div className="item">{account.driver.category}</div>
                                        <div className="item">Статус:</div>
                                        <div
                                            className="item">{account.driver.status}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {account.driver.status !== 'DELETED' ?
                                        <button className="basic_button action_button"
                                                onClick={(event) => deleteAccount(event, account)}>Удалить</button>
                                        : <></>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </form>
            <form className="form_base" id="accounts_req_form-all">
                <h3>Получить все аккаунты клиентов</h3>
                <input className="serach"
                    type="text"
                    placeholder="Имя"
                    onChange={(e) => setNameToFindUser(e.target.value)}
                />
                <div className="filters_wrapper">
                    <div className="filters">
                        <p style={{marginBottom: "15px"}}>Фильтры</p>
                        <div>
                            <p>Статус</p>
                            <select name="typeOfCar" id="typeOfCar" onChange={(e) => setUserFilter(e.target.value)}>
                                <option value="active">Доступен</option>
                                <option value="deleted">Удален</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <p style={{marginBottom: "15px"}}>Выберите тип сортировки</p>
                        <select name="typeOfCar" id="typeOfCar" onChange={(e) => setSortUser(e.target.value)}>
                            <option value="id">По ID</option>
                            <option value="created_at">По дате создания</option>
                        </select>
                    </div>
                    
                    <div className="pagination_wrapper" >
                        <button className="button-left" onClick={(e: React.FormEvent) => leftPageClickUser(e)}></button>
                        <button className="button-right" onClick={(e: React.FormEvent) => rightPageClickUser(e)} disabled={!(countOfUsers <= 10)}></button>
                    </div> 
                </div>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Аккаунт</th>
                        <th>Действия</th>
                    </thead>
                    <tbody>
                    {accounts.map(account => (
                            <tr>
                            <td>{account.user.id}</td>
                            <td>
                                <div className="table_grid">
                                    <div className="item">Почта:</div>
                                    <div className="item">{account.user.email}</div>
                                    <div className="item">Имя:</div>
                                    <div className="item">{account.user.name}</div>
                                    <div className="item">Телефон:</div>
                                    <div className="item">{account.user.phone_number}</div>
                                    <div className="item">Ср. оценка:</div>
                                    <div className="item">{account.user.avg_rate}</div>
                                    <div className="item">Статус:</div>
                                    <div className="item">{account.user.status}</div>
                                </div>
                            </td>
                            <td>
                                {account.user.status !== 'deleted' ?
                                    <button className="basic_button action_button"
                                            onClick={(event) => deleteAccount(event, account)}>Заблокировать</button>
                                    : <></>
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </form>
            <form className="form_base" id="accounts_req_form-create" onSubmit={(event)=>createAccount(event)}>
                <h3>Назначить водителя</h3>
                <div className="input_wrapper">
                    <p>Имя</p>
                    <input type="text" placeholder="Имя" onChange={(event)=>setName(event.target.value)}/>
                    {!isValidatedName && <p className="error_message" style={{color: 'red'}}>Некорректное имя пользователя</p>}
                </div>
                <div className="input_wrapper">
                    <p>Телефон</p>
                    <input type="text" placeholder="+375295555555" onChange={(event)=>setPhone(event.target.value)}/>
                    {!isValidatedPhone && <p className="error_message" style={{color: 'red'}}>Некорректный номер телефона</p>}
                </div>
                <div className="input_wrapper">
                    <p>Пароль</p>
                    <input type="password" placeholder="Пароль" onChange={(event)=>setPassword(event.target.value)}/>
                    {!isValidatedPassword && <p className="error_message" style={{color: 'red'}}>Некорректный пароль</p>}
                </div>
                <div className="input_wrapper">
                    <p>Почта</p>
                    <input type="text" placeholder="example@gmail.com" onChange={(event)=>setEmail(event.target.value)}/>
                    {!isValidatedEmail && <p className="error_message" style={{color: 'red'}}>Неверный формат email</p>}
                </div>
                <div className="input_wrapper">
                    <p>Категория</p>
                    <select name="category_select" id="category_select" onChange={(event)=>setCategory(event.target.value)}>
                        <option value={Categories.A}>A</option>
                        <option value={Categories.B}>B</option>
                        <option value={Categories.C}>C</option>
                        <option value={Categories.D}>D</option>
                    </select>
                </div>
                <input type="submit" className="basic_button" value="Назначить"/>
            </form>
        </section>
        </main>
    );
}

export default AccountsReqSection;