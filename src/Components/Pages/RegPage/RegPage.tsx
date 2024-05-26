import React from "react";
import RegForm from "./RegForm/RegForm";
import "./RegPage.css";

const RegPage: React.FC = () => {
    return (
        <main id="reg_page">
            <section id="reg_form_section">
                <RegForm></RegForm>
            </section>            
        </main>
    );
}

export default RegPage;