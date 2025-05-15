import React from "react";
import LoginForm from "../components/LoginForm";
import style from "../styles/Base.module.css"
const LoginPage: React.FC = () => {

    return(
        <main className={style.mainCenter}>
            
            <LoginForm />
        </main>
    );
};

export default LoginPage;