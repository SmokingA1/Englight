import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import styles from "../styles/LRForm.module.css"
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

type userProps = {
    username: string
    password: string
    email: string
    phone_number: string
}

const RegisterForm: React.FC = () => {
    const [userData, setUserData] = useState<userProps>(
        {
            username: "",
            password: "",
            email: "",
            phone_number: ""
        }
    )
    const [repeatPassword, setRepeatPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/users/register", userData)
            console.log(response)
            if (response) {
                navigate("/login");
            }
        } catch (error: any) {
            if (error.response) {
            console.error("Ошибка сервера:", error.response.data);
        } else {
            console.error("Ошибка сети или другая ошибка:", error.message);
        }
        }

    }

    return(
        <form className={styles.form} onSubmit={handleRegister}>
            <h2 className={styles.h2Form}>Registration</h2>

            <Input 
                className={styles.input}
                type="text"
                label="Username"
                id="username-field"
                value={userData.username}
                onChange={(e) => setUserData({...userData, username: e.target.value})}
                placeholder="Enter username..."
                autoComplete="username"
                required
            />

            <Input 
                className={styles.input}
                type="email"
                label="Email"
                id="email-field"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                placeholder="Enter email..."
                autoComplete="email"
                required
            />
            
            <Input
                className={styles.input}
                type="password"
                label="Password"
                id="password-field"
                value={userData.password}
                onChange={(e) => setUserData({...userData, password: e.target.value})}
                placeholder="Enter password..."
                autoComplete="new-password"
                required
            />

            <Input 
                className={styles.input}
                type="password"
                label="Repeat password"
                id="repeat-password-field"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Enter password..."
                autoComplete="new-password"            
                required
            />

            <Input
                className={styles.input}
                type="text"
                label="Phone number"
                id="phone-number-field"
                value={userData.phone_number}
                onChange={(e) => setUserData({...userData, phone_number: e.target.value})}
                autoComplete="tel"
                placeholder="Enter phone number..."
                
            />

            <Button 
                className={styles.button}
                label="REGISTER"
                type="submit"
            />

            <div className={styles.rlinks}>
                    Already have an account?
                    <Link to="/login" className={styles.link}>Sign in</Link>
            </div>

        </form>
    )
}

export default RegisterForm;