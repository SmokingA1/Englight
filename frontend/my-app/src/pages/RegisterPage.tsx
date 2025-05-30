import React from "react";
import RegisterForm from "../components/RigesterForm";
import style from "../styles/Base.module.css"

const RegisterPage: React.FC = () => {

    return(
        <main className={style.mainCenter}>
            <RegisterForm />
        </main>
    )
}

export default RegisterPage;