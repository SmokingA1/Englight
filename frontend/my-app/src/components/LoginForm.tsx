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
    const [logError, setLogError] = useState("");
    // should be implemented
    const [rememberMe, setRememberMe] = useState<boolean>(false);
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
            setLogError("Incorrect email or password, try again!");
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
                <h2 className={styles.h2Form}>LOGIN</h2>

                <Input 
                    className={styles.input}
                    type="email"
                    label="Email" 
                    id="email-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email here"
                    autoComplete="username"
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
                {
                    logError && 
                    <span className={styles.error}>{logError}</span>
                }

                <div className={styles.options}>
                    <div className={styles.rememberContainer}>
                        <Input 
                            id="remember-field"
                            type="checkbox"
                            label="Remember me"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                    </div>
                    
                    <Link to="/" className={styles.link}>Forgot Password?</Link>
                </div>

                <Button
                className={styles.button}
                label="SIGN IN" type="submit"/>

                
                <span style={{alignSelf: "center"}}>
                    Don't have an account?   <Link to="/signup" className={styles.linkRegister}>Sign up</Link>
                </span>
            </form>
        </>
    )
}

export default LoginForm;