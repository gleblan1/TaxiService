import React from "react";
import AuthForm from "./AuthForm/AuthForm";
import "./AuthPage.css";

const AuthPage: React.FC = () => {
    return (
        <main id="auth_page">
            <section id="auth_form_section">
                <AuthForm></AuthForm>
            </section>            
        </main>
    );
}

export default AuthPage;