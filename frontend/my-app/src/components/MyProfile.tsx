import React, {useEffect, useState, useCallback} from "react";
import styles from "../styles/MyProfile.module.css"
import api from "../api";
import { logger } from "./utils/logger";

interface userDataInterface {
    username: string;
    email: string;
    phone_number: string
    avatar_url: string
}

const MyProfile: React.FC = () => {
    const [userData, setUserData] = useState<userDataInterface>({
        username: '',
        email: '',
        phone_number: '',
        avatar_url: ''
    })

    const fetchUserData = useCallback(async () => {
        try {
            const response = await api.get("/users/me");
            const { username, email, phone_number, avatar_url } = response.data;
            setUserData({
                username,
                email,
                phone_number,
                avatar_url
            });

            logger.info(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("server error: ", error.response)
            }
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [])

    return(
        <div className={styles.layout}>
            <main className={styles.mainContent}>
                <div className={styles.mainInfo} >
                    <img className={styles.avatar} src={`http://localhost:8000/${userData.avatar_url}`} alt="My-logo" />
                    <span>{userData.username}</span>
                </div>
                <div className={styles.otherInfo}>
                    <span>Email: {userData.email}</span>
                    <span>Phone: {userData.phone_number}</span>
                </div>
            </main>
            <aside>
                <nav>

                </nav>
            </aside>
        </div>
        
       
    )
}

export default MyProfile;