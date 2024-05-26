import React from "react";
import AccountForm from "./AccountForm/AccountForm";
import AccountInfoForm from "./AccountInfoForm/AccountInfoForm";
import "./AccountPage.css";

const AccountPage: React.FC = () => {
    return (
        <main id="account_page">
            <section id="account_form_section">
                <h2>Ваш аккаунт</h2>
                <div className="account_forms_wrapper">
                    <AccountForm></AccountForm>                    
                    <AccountInfoForm></AccountInfoForm>
                </div>

            </section>            
        </main>
    );
}

export default AccountPage;