import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import styles from "../styles/LRForm.module.css"
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { logger } from "./utils/logger";

interface userProps {
    username: string
    password: string
    email: string
    phone_number: string
}

interface errorInterface {
    type: string;
    text: string;
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
    const [logError, setLogError] = useState<errorInterface>({
        type: "",
        text: "",
    });
    
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userData.password != repeatPassword) {
            setLogError({
                type: "repeatPassword",
                text: "Passwords do not match!",
            })
            return;
        }
        
        if (userData.password.length < 8 || userData.password.length > 64) {
            setLogError({
                text: "The password cannot be shorter than 8\nand more than 64 characters!!!",
                type: "password",
            });
            return;
        }

        if (userData.phone_number.length > 1 && userData.phone_number.length < 10 || userData.phone_number.length > 13) {
            setLogError({
                type: "phone",
                text: "The phone number cannot be smaller than 10 and more than 13 characters!",
            })
            return;
        }

        try {
            const response = await api.post("/users/register", userData)
            console.log(response)
            if (response) {
                navigate("/login");
            }
        } catch (error: any) {
            if (error.response.data.detail && typeof error.response.data.detail != "object") {
                const detail = error.response.data.detail;
                const lowerDetail = detail.toLowerCase();

                setLogError({
                    type: lowerDetail.includes("phone") ? "phone" :
                          lowerDetail.includes("email") ? "email" : "other",
                    text: detail,
                })

                logger.error("Ошибка сервера:", error.response.data.detail);
            } else {
                logger.error("Ошибка сети или другая ошибка:", error);
            }
        }
    }

    return(
        <form className={styles.form} onSubmit={handleRegister}>
            <h2 className={styles.h2Form}>SIGN UP</h2>

            <Input 
                className={styles.input}
                type="text"
                label="Username *"
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
                label="Email *"
                id="email-field"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                placeholder="Enter email..."
                autoComplete="email"
                required
            />
            {logError.type == "email" &&
                <span className={styles.error}>{logError.text}</span>
            }

            <Input
                className={styles.input}
                type="password"
                label="Password *"
                id="password-field"
                value={userData.password}
                onChange={(e) => setUserData({...userData, password: e.target.value})}
                placeholder="Enter password..."
                autoComplete="new-password"
                required
            />
            {logError.type == "password" && 
                <span className={styles.error}>{logError.text}</span>
            }

            <Input 
                className={styles.input}
                type="password"
                label="Repeat password *"
                id="repeat-password-field"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Enter password..."
                autoComplete="new-password"            
                required
            />
            {logError.type == "repeatPassword" &&
                <span className={styles.error}>{logError.text}</span>
            }

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
            {logError.type == "phone" &&
                <span className={styles.error}>{logError.text}</span>
            }

            <Button 
                className={styles.button}
                label="REGISTER"
                type="submit"
            />

            <div className={styles.rlink}>
                    Already have an account?
                    <Link to="/login" className={styles.link}>Sign in</Link>
            </div>
        </form>
    )
}

export default RegisterForm;