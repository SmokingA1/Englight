import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import styles from "../styles/LRForm.module.css"
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { logger } from "./utils/logger";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/login", {username: email, password}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            logger.info(response)
            if (response) {
                navigate("/");
            }
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.response);
            } else {
                console.error('Some type of error ocured during loginning: ', error);
            }
        }
    }


    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.h2Form}>LOG IN</h2>

                <Input 
                    className={styles.input}
                    type="email"
                    label="Email" 
                    id="email-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email here"
                    required
                />

                <Input 
                    className={styles.input}
                    type="password"
                    label="Password" 
                    id="password-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password here"
                    autoComplete="current-password"
                    required
                />

                <Button
                className={styles.button}
                label="SIGN IN" type="submit"/>

                <div className={styles.links}>
                    <Link to="/signup" className={styles.link}>Register</Link>
                    <Link to="/" className={styles.link}>Forgot Password?</Link>
                </div>
            </form>
        </>
    )
}

export default LoginForm;