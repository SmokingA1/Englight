import React, {useEffect, useState, useCallback} from "react";
import styles from "../styles/MyProfile.module.css"
import api from "../api";
import Button from "./Button";
import { logger } from "./utils/logger";

interface userDataInterface {
    username: string;
    email: string;
    phone_number: string
    avatar_url: string
    id: string
}

const MyProfile: React.FC = () => {
    const [userData, setUserData] = useState<userDataInterface>({
        username: '',
        email: '',
        phone_number: '',
        avatar_url: '',
        id: ''
    })
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [isFormAvatar, setIsFormAvatar] = useState<boolean>(false);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await api.get("/users/me");
            const { username, email, phone_number, avatar_url, id } = response.data;
            setUserData({
                username,
                email,
                phone_number,
                avatar_url,
                id
            });

            logger.info(response.data);
        } catch (error: any) {
            if (error.response) {
                console.error("server error: ", error.response)
            }
            console.log(error);
        }
    }, []);

    const uploadAvatar = async () => {
        if (!newAvatar) return;

        const formData = new FormData();
        formData.append("user_id", userData.id);
        formData.append("file",  newAvatar);

        try {
            const response = await api.post("/users/upload-avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            logger.info(response.data);
            logger.info(newAvatar);
            if (response) {
                setIsFormAvatar(false);
                fetchUserData();
            }
        } catch (error: any) {
            if (error.response) {
                console.error("Server error: ", error.respone);
            } else {
                console.error("Network or other error: ", error);
            }
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    return(
        <div className={styles.layout}>
            <main className={styles.mainContent}>
                <div className={styles.mainInfo} >
                    <img 
                        className={styles.avatar}
                        src={`http://localhost:8000/${userData.avatar_url}`}
                        alt="My-logo" 
                        onClick={() => setIsFormAvatar(true)}
                    />
                    <span>{userData.username}</span>

                    {isFormAvatar && (
                        <>
                            <div
                                className={styles.darkBg}
                                onClick={() => {
                                    setIsFormAvatar(false);
                                    setNewAvatar(null);
                                }}
                            >
                            </div>
                            <div className={styles.formAvatar}>
                                <label htmlFor="avatar-upload" className={styles.customUpload}>
                                    { newAvatar ? (
                                        <span style={{width: 100 + "%", height: 100 + "%"}} >
                                            <img
                                                className={styles.avatarPreload}
                                                src={URL.createObjectURL(newAvatar)} alt="newAvatar"/>
                                        </span>
                                    ): (
                                        <span className={styles.plus}>+</span>

                                    )
                                    }
                                    
                                </label>
                                <input 
                                    className={styles.hiddenInput}
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setNewAvatar(e.target.files[0])
                                        }
                                    }}
                                />
                                <Button
                                    className={styles.buttonAvatar}
                                    label="Submit"
                                    onClick={uploadAvatar}
                                />
                            </div>
                        </>
                        
                        
                    )}
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