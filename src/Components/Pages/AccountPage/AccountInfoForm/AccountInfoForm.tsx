import "./AccountInfoForm.css";
import "./../../FormBase.css";
import { api } from "../../../../axios/api";
import { ResponseErr } from "../../../../types/Types";
import React from "react";

const AccountInfoForm: React.FC = () => {
    const updateUser = (e: React.FormEvent) => {
        e.preventDefault();
        api.get("").then(res => res.data).then((data) => console.log(data)).catch((err: ResponseErr)  => {
            console.log(err);
        });
    }

    const deleteUser = (e: React.FormEvent) => {
        e.preventDefault();
        api.delete("account/").then(res => res.data).then((data) => console.log(data)).catch((err: ResponseErr)  => {
            console.log(err);
        });
    }
    
    return (
        <form id="account_info_form" className="form_base" onSubmit={(e: React.FormEvent) => updateUser(e)}>
            <div className="acc_info_wrapper">
                {/*<div className="input_wrapper">*/}
                {/*    <p>Получить информацию об аккаунте</p>                    */}
                {/*</div>*/}
                {/*<input type="submit" className="submit_button" value="Получить" style={{marginBottom: "20px"}}/>        */}
                {/*<div className="input_wrapper">*/}
                {/*    <p>Удалить аккаунт</p>                    */}
                {/*</div>*/}
                <input type="submit" className="submit_button delete_button" value="Удалить аккаунт" onClick={deleteUser}/>       
            </div>
        </form>
    );
}

export default AccountInfoForm;